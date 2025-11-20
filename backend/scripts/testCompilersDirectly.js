const dockerExecutionService = require('../services/dockerExecutionService');
const nativeExecutionService = require('../services/nativeExecutionService');

const tests = [
  {
    language: 'javascript',
    code: 'console.log("Hello from JavaScript!");',
    description: 'JavaScript Test',
    useNative: true
  },
  {
    language: 'python',
    code: 'print("Hello from Python!")',
    description: 'Python Test',
    useDocker: true
  },
  {
    language: 'java',
    code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from Java!");
    }
}`,
    description: 'Java Test',
    useDocker: true
  },
  {
    language: 'typescript',
    code: 'console.log("Hello from TypeScript!");',
    description: 'TypeScript Test',
    useNative: true
  },
  {
    language: 'c',
    code: `#include <stdio.h>

int main() {
    printf("Hello from C!\\n");
    return 0;
}`,
    description: 'C Test',
    useDocker: true
  },
  {
    language: 'cpp',
    code: `#include <iostream>

int main() {
    std::cout << "Hello from C++!" << std::endl;
    return 0;
}`,
    description: 'C++ Test',
    useDocker: true
  }
];

async function testCompilers() {
  console.log('🧪 Testing Docker Compilers Directly...\n');
  console.log('='.repeat(60));

  for (const test of tests) {
    console.log(`\n${test.description}:`);
    console.log('-'.repeat(60));

    try {
      let result;

      if (test.useDocker) {
        result = await dockerExecutionService.executeCode(test.code, test.language, '');
      } else {
        result = await nativeExecutionService.executeCode(test.code, test.language, '');
      }

      if (result && result.output !== undefined) {
        console.log(`✅ SUCCESS`);
        console.log(`Output: ${result.output.trim()}`);
        console.log(`Execution Time: ${result.executionTime}ms`);
        console.log(`Memory Used: ${result.memoryUsage || 0}MB`);
      } else {
        console.log(`❌ FAILED`);
        console.log(`Error: No output returned`);
      }
    } catch (error) {
      console.log(`❌ ERROR`);
      console.log(`Message: ${error.message}`);
      console.log(`Stack: ${error.stack}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ Compiler tests complete!');
}

testCompilers();
