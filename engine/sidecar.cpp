#include "bop.hpp"
#include "core/engine.hpp"
#include "core/logic.hpp"
#include "exchanges/kalshi/kalshi.hpp"
#include "exchanges/polymarket/polymarket.hpp"
#include "nlohmann/json.hpp"
#include <boost/asio.hpp>
#include <boost/beast.hpp>
#include <iostream>
#include <memory>
#include <string>
#include <thread>
#include <mutex>
#include <unordered_set>

namespace beast = boost::beast;
namespace http = beast::http;
namespace websocket = beast::websocket;
namespace net = boost::asio;
using tcp = net::ip::tcp;

using namespace bop;

extern bop::LiveExecutionEngine global_live_engine;
bop::LiveExecutionEngine &RealLiveExchange = global_live_engine;

class SidecarServer;

class Session : public std::enable_shared_from_this<Session> {
  websocket::stream<beast::tcp_stream> ws_;
  beast::flat_buffer buffer_;
  SidecarServer* server_;

public:
  explicit Session(tcp::socket &&socket, SidecarServer* server) : ws_(std::move(socket)), server_(server) {}

  void run();
  void on_accept(beast::error_code ec);
  void do_read();
  void on_read(beast::error_code ec, std::size_t bytes_transferred);
  void send_msg(const std::string& msg);
};

class SidecarServer : public std::enable_shared_from_this<SidecarServer> {
  tcp::acceptor acceptor_;
  net::io_context &ioc_;
  std::mutex sessions_mtx_;
  std::unordered_set<std::shared_ptr<Session>> sessions_;

public:
  SidecarServer(net::io_context &ioc, tcp::endpoint endpoint)
      : acceptor_(ioc, endpoint), ioc_(ioc) {}

  void run() { do_accept(); }

  void add_session(std::shared_ptr<Session> session) {
    std::lock_guard<std::mutex> lock(sessions_mtx_);
    sessions_.insert(session);
  }

  void remove_session(std::shared_ptr<Session> session) {
    std::lock_guard<std::mutex> lock(sessions_mtx_);
    sessions_.erase(session);
  }

  void broadcast(const std::string& msg) {
    std::lock_guard<std::mutex> lock(sessions_mtx_);
    for (auto& session : sessions_) {
      session->send_msg(msg);
    }
  }

private:
  void do_accept() {
    acceptor_.async_accept(net::make_strand(ioc_),
                           beast::bind_front_handler(&SidecarServer::on_accept,
                                                     shared_from_this()));
  }

  void on_accept(beast::error_code ec, tcp::socket socket) {
    if (ec) {
      std::cerr << "[Sidecar] Accept error: " << ec.message() << std::endl;
    } else {
      std::make_shared<Session>(std::move(socket), this)->run();
    }
    do_accept();
  }
};

void Session::run() {
  ws_.async_accept(
      beast::bind_front_handler(&Session::on_accept, shared_from_this()));
}

void Session::on_accept(beast::error_code ec) {
  if (ec) {
    std::cerr << "[Sidecar] WS Accept error: " << ec.message() << std::endl;
    return;
  }
  std::cout << "[Sidecar] Client connected" << std::endl;
  server_->add_session(shared_from_this());
  do_read();
}

void Session::do_read() {
  ws_.async_read(buffer_, beast::bind_front_handler(&Session::on_read,
                                                    shared_from_this()));
}

void Session::on_read(beast::error_code ec, std::size_t bytes_transferred) {
  if (ec == websocket::error::closed) {
    server_->remove_session(shared_from_this());
    return;
  }
  if (ec) {
    std::cerr << "[Sidecar] Read error: " << ec.message() << std::endl;
    server_->remove_session(shared_from_this());
    return;
  }

  std::string msg = beast::buffers_to_string(buffer_.data());
  std::cout << "[Sidecar] Received: " << msg << std::endl;
  
  try {
    auto j = nlohmann::json::parse(msg);
    if (j.contains("cmd")) {
      std::string cmd = j["cmd"];
      if (cmd == "Buy" || cmd == "Sell") {
        std::string ticker = j.value("ticker", "");
        int qty = j.value("qty", 0);
        int price = j.value("price", 0);
        
        Order o;
        o.market = MarketId(ticker);
        o.quantity = Shares(qty);
        o.is_buy = (cmd == "Buy");
        o.outcome = OutcomeId(true);
        if (price > 0) o.price = Price::from_cents(price);
        
        RealLiveExchange.submit_command({Command::Type::SubmitOrder, o});
      } else if (cmd == "CancelAll") {
        RealLiveExchange.submit_command({Command::Type::CancelAll});
      } else if (cmd == "ClosePositions") {
        RealLiveExchange.submit_command({Command::Type::ClosePositions});
      }
    }
  } catch(const std::exception& e) {
    std::cerr << "[Sidecar] Parse error: " << e.what() << std::endl;
  }

  buffer_.consume(buffer_.size());
  do_read();
}

void Session::send_msg(const std::string& msg) {
  ws_.async_write(net::buffer(msg), [](beast::error_code ec, std::size_t) {
    if (ec) {
      std::cerr << "[Sidecar] Write error: " << ec.message() << std::endl;
    }
  });
}

std::shared_ptr<SidecarServer> global_server;

int main() {
  try {
    std::cout << "[Sidecar] Starting MuTerminal BOP Engine..." << std::endl;
    
    using namespace bop::exchanges;
    const char *k_key = std::getenv("KALSHI_API_KEY");
    const char *k_sec = std::getenv("KALSHI_SECRET_KEY");
    kalshi.set_credentials({k_key ? k_key : "", k_sec ? k_sec : "", "", ""});
    
    const char *p_key = std::getenv("POLY_API_KEY");
    polymarket.set_credentials({p_key ? p_key : "", "", "", ""});
    
    RealLiveExchange.register_backend(&kalshi);
    RealLiveExchange.register_backend(&polymarket);
    RealLiveExchange.sync_all_markets();
    
    std::thread engine_thread([]() {
      RealLiveExchange.run();
    });

    std::thread stream_thread([]() {
      while(true) {
        std::this_thread::sleep_for(std::chrono::milliseconds(500));
        if (global_server) {
          // Stream Market Depth
          nlohmann::json j;
          j["type"] = "depth";
          j["ticker"] = ""; // No default ticker
          
          j["bids"] = nlohmann::json::array();
          j["asks"] = nlohmann::json::array();
          global_server->broadcast(j.dump());
          
          // Stream Portfolio Status
          nlohmann::json p;
          p["type"] = "status";
          p["balance"] = RealLiveExchange.get_balance().to_double();
          p["exposure"] = RealLiveExchange.get_exposure().to_double();
          p["pnl"] = RealLiveExchange.get_pnl().to_double();
          global_server->broadcast(p.dump());
        }
      }
    });
    
    net::io_context ioc{1};
    tcp::endpoint endpoint{net::ip::make_address("127.0.0.1"), 8080};
    
    global_server = std::make_shared<SidecarServer>(ioc, endpoint);
    global_server->run();
    
    std::cout << "[Sidecar] Listening on 127.0.0.1:8080" << std::endl;
    ioc.run();
    
    if (engine_thread.joinable()) engine_thread.join();
    if (stream_thread.joinable()) stream_thread.join();

  } catch (const std::exception &e) {
    std::cerr << "[Sidecar] Fatal Error: " << e.what() << std::endl;
    return 1;
  }
  return 0;
}
