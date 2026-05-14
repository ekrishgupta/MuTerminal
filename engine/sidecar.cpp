#include "bop.hpp"
#include "core/engine.hpp"
#include "core/logic.hpp"
#include "exchanges/kalshi/kalshi.hpp"
#include "exchanges/polymarket/polymarket.hpp"
#include <boost/asio.hpp>
#include <boost/beast.hpp>
#include <iostream>
#include <memory>
#include <string>
#include <thread>

namespace beast = boost::beast;
namespace http = beast::http;
namespace websocket = beast::websocket;
namespace net = boost::asio;
using tcp = net::ip::tcp;

using namespace bop;

class SidecarServer : public std::enable_shared_from_this<SidecarServer> {
  tcp::acceptor acceptor_;
  net::io_context &ioc_;

public:
  SidecarServer(net::io_context &ioc, tcp::endpoint endpoint)
      : acceptor_(ioc, endpoint), ioc_(ioc) {}

  void run() { do_accept(); }

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
      std::make_shared<Session>(std::move(socket))->run();
    }
    do_accept();
  }

  class Session : public std::enable_shared_from_this<Session> {
    websocket::stream<beast::tcp_stream> ws_;
    beast::flat_buffer buffer_;

  public:
    explicit Session(tcp::socket &&socket) : ws_(std::move(socket)) {}

    void run() {
      ws_.async_accept(
          beast::bind_front_handler(&Session::on_accept, shared_from_this()));
    }

    void on_accept(beast::error_code ec) {
      if (ec) {
        std::cerr << "[Sidecar] WS Accept error: " << ec.message() << std::endl;
        return;
      }
      std::cout << "[Sidecar] Client connected" << std::endl;
      
      // Start streaming mock data for now
      do_stream();
      do_read();
    }

    void do_read() {
      ws_.async_read(buffer_, beast::bind_front_handler(&Session::on_read,
                                                        shared_from_this()));
    }

    void on_read(beast::error_code ec, std::size_t bytes_transferred) {
      if (ec == websocket::error::closed)
        return;
      if (ec) {
        std::cerr << "[Sidecar] Read error: " << ec.message() << std::endl;
        return;
      }

      // Handle command from UI
      std::string msg = beast::buffers_to_string(buffer_.data());
      std::cout << "[Sidecar] Received: " << msg << std::endl;
      
      buffer_.consume(buffer_.size());
      do_read();
    }

    void do_stream() {
      if (!ws_.is_open()) return;

      // Mock market data update
      std::string update = R"({"type": "depth", "ticker": "MU:TRUMP", "bids": [[0.61, 500]], "asks": [[0.62, 300]]})";
      
      ws_.async_write(net::buffer(update), [self = shared_from_this()](beast::error_code ec, std::size_t) {
        if (!ec) {
          // Stream again after 500ms
          auto timer = std::make_shared<net::steady_timer>(self->ws_.get_executor(), std::chrono::milliseconds(500));
          timer->async_wait([self, timer](beast::error_code ec) {
            if (!ec) self->do_stream();
          });
        }
      });
    }
  };
};

int main() {
  try {
    std::cout << "[Sidecar] Starting MuTerminal BOP Engine..." << std::endl;
    
    net::io_context ioc{1};
    tcp::endpoint endpoint{net::ip::make_address("127.0.0.1"), 8080};
    
    std::make_shared<SidecarServer>(ioc, endpoint)->run();
    
    std::cout << "[Sidecar] Listening on 127.0.0.1:8080" << std::endl;
    ioc.run();
  } catch (const std::exception &e) {
    std::cerr << "[Sidecar] Fatal Error: " << e.what() << std::endl;
    return 1;
  }
  return 0;
}
