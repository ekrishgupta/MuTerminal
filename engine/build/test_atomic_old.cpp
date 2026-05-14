#include <memory>
#include <iostream>
int main() {
    std::shared_ptr<int> p = std::make_shared<int>(1);
    std::shared_ptr<int> p2 = std::atomic_load(&p);
    std::cout << *p2 << std::endl;
    return 0;
}
