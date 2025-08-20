#include <iostream>
#include <vector>
#include <string>

using namespace std;

// Function declaration
int fibonacci(int n);

int main() {
    cout << "Hello from C++!" << endl;
    
    // Calculate fibonacci numbers
    cout << "First 10 Fibonacci numbers:" << endl;
    for (int i = 0; i < 10; i++) {
        cout << "F(" << i << ") = " << fibonacci(i) << endl;
    }
    
    // Vector operations
    vector<int> numbers = {1, 2, 3, 4, 5};
    vector<int> doubled;
    
    for (int num : numbers) {
        doubled.push_back(num * 2);
    }
    
    cout << "Doubled numbers: ";
    for (int num : doubled) {
        cout << num << " ";
    }
    cout << endl;
    
    return 0;
}

// Function definition
int fibonacci(int n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}