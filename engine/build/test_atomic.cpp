#include <atomic>
#include <memory>
int main() {
    std::atomic<std::shared_ptr<int>> a;
    return 0;
}
