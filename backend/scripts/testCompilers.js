const codeExecutionService = require('../services/codeExecutionService');

const tests = [
  {
    language: 'javascript',
    code: 'console.log("Hello from JavaScript!");',
    description: 'JavaScript Test'
  },
  {
    language: 'python',
    code: 'print("Hello from Python!")',
    description: 'Python Test'
  },
  {
    language: 'java',
    code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from Java!");
    }
}`,
    description: 'Java Test'
  },
  {
    language: 'typescript',
    code: 'console.log("Hello from TypeScript!");',
    description: 'TypeScript Test'
  },
  {
    language: 'c',
    code: `#include <stdio.h>

int main() {
    printf("Hello from C!\\n");
    return 0;
}`,
    description: 'C Test'
  },
  {
    language: 'cpp',
    code: `#include <iostream>

int main() {
    std::cout << "Hello from C++!" << std::endl;
    return 0;
}`,
    description: 'C++ Test'
  }
];

async function testCompilers() {
  console.log('🧪 Testing Docker Compilers...\n');
  console.log('='.repeat(60));

  for (const test of tests) {
    console.log(`\n${test.description}:`);
    console.log('-'.repeat(60));

    try {
      const result = await codeExecutionService.executeCode(
        'test-user',
        test.code,
        test.language,
        '',
        null,
        null,
        null,
        { ipAddress: '127.0.0.1', userAgent: 'Test Script' }
      );

      if (result.success) {
        console.log(`✅ SUCCESS`);
        console.log(`Output: ${result.output}`);
        console.log(`Execution Time: ${result.executionTime}ms`);
        console.log(`Memory Used: ${result.memoryUsage}MB`);
      } else {
        console.log(`❌ FAILED`);
        console.log(`Error: ${result.error}`);
      }
    } catch (error) {
      console.log(`❌ ERROR`);
      console.log(`Message: ${error.message}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ Compiler tests complete!');
}

testCompilers();
