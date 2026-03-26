require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const CodingChallenge = require('../models/CodingChallenge');
const mongoURI = process.env.MONGODB_URI || 'mongodb://mongo:27017/seek';

const challenges = [
  // ── EASY 101-115 ────────────────────────────────────────────────────────────
  {
    number: 101, title: 'Valid Palindrome', slug: 'valid-palindrome', difficulty: 'easy',
    category: 'String', tags: ['String', 'Two Pointers'], companies: ['Facebook', 'Microsoft'],
    description: 'Given a string `s`, return `true` if it is a palindrome, or `false` otherwise.\n\nOnly alphanumeric characters count; ignore case.',
    constraints: [{ description: '1 <= s.length <= 2 * 10⁵' }, { description: 's consists only of printable ASCII characters.' }],
    examples: [
      { input: 's = "A man, a plan, a canal: Panama"', output: 'true', explanation: '"amanaplanacanalpanama" is a palindrome.' },
      { input: 's = "race a car"', output: 'false' },
      { input: 's = " "', output: 'true', explanation: 'An empty string after filtering is a palindrome.' }
    ],
    testCases: [
      { input: { s: 'A man, a plan, a canal: Panama' }, expectedOutput: true, isHidden: false },
      { input: { s: 'race a car' }, expectedOutput: false, isHidden: false },
      { input: { s: ' ' }, expectedOutput: true, isHidden: false },
      { input: { s: 'Was it a car or a cat I saw?' }, expectedOutput: true, isHidden: true },
      { input: { s: 'hello' }, expectedOutput: false, isHidden: true }
    ],
    hints: [{ order: 1, text: 'Filter out non-alphanumeric characters first, then lowercase.' }, { order: 2, text: 'Use two pointers from both ends.' }],
    starterCode: [
      { language: 'javascript', code: 'function isPalindrome(s) {\n    // Write your code here\n}', functionName: 'isPalindrome' },
      { language: 'python', code: 'def is_palindrome(s):\n    # Write your code here\n    pass', functionName: 'is_palindrome' }
    ],
    acceptanceRate: 44
  },
  {
    number: 102, title: 'Fizz Buzz', slug: 'fizz-buzz', difficulty: 'easy',
    category: 'Math', tags: ['Math', 'String', 'Simulation'], companies: ['Amazon', 'Google'],
    description: 'Given an integer `n`, return a string array where:\n- `answer[i] == "FizzBuzz"` if `i` is divisible by 3 and 5.\n- `answer[i] == "Fizz"` if divisible by 3.\n- `answer[i] == "Buzz"` if divisible by 5.\n- `answer[i] == i` (as a string) otherwise.\n\n(1-indexed)',
    constraints: [{ description: '1 <= n <= 10⁴' }],
    examples: [
      { input: 'n = 3', output: '["1","2","Fizz"]' },
      { input: 'n = 5', output: '["1","2","Fizz","4","Buzz"]' },
      { input: 'n = 15', output: '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]' }
    ],
    testCases: [
      { input: { n: 3 }, expectedOutput: ['1','2','Fizz'], isHidden: false },
      { input: { n: 5 }, expectedOutput: ['1','2','Fizz','4','Buzz'], isHidden: false },
      { input: { n: 15 }, expectedOutput: ['1','2','Fizz','4','Buzz','Fizz','7','8','Fizz','Buzz','11','Fizz','13','14','FizzBuzz'], isHidden: false },
      { input: { n: 1 }, expectedOutput: ['1'], isHidden: true },
      { input: { n: 10 }, expectedOutput: ['1','2','Fizz','4','Buzz','Fizz','7','8','Fizz','Buzz'], isHidden: true }
    ],
    hints: [{ order: 1, text: 'Check divisibility by 15 first, then 3, then 5.' }],
    starterCode: [
      { language: 'javascript', code: 'function fizzBuzz(n) {\n    // Write your code here\n}', functionName: 'fizzBuzz' },
      { language: 'python', code: 'def fizz_buzz(n):\n    # Write your code here\n    pass', functionName: 'fizz_buzz' }
    ],
    acceptanceRate: 68
  },
  {
    number: 103, title: 'Single Number', slug: 'single-number', difficulty: 'easy',
    category: 'Bit Manipulation', tags: ['Array', 'Bit Manipulation'], companies: ['Amazon', 'Apple'],
    description: 'Given a non-empty array of integers `nums`, every element appears **twice** except for one. Find that single one.\n\nYou must implement a solution with O(n) time and O(1) space.',
    constraints: [{ description: '1 <= nums.length <= 3 * 10⁴' }, { description: 'Each element appears exactly twice except for one.' }],
    examples: [
      { input: 'nums = [2,2,1]', output: '1' },
      { input: 'nums = [4,1,2,1,2]', output: '4' },
      { input: 'nums = [1]', output: '1' }
    ],
    testCases: [
      { input: { nums: [2,2,1] }, expectedOutput: 1, isHidden: false },
      { input: { nums: [4,1,2,1,2] }, expectedOutput: 4, isHidden: false },
      { input: { nums: [1] }, expectedOutput: 1, isHidden: false },
      { input: { nums: [0,1,0] }, expectedOutput: 1, isHidden: true },
      { input: { nums: [3,3,7,7,10] }, expectedOutput: 10, isHidden: true }
    ],
    hints: [{ order: 1, text: 'XOR of a number with itself is 0. XOR of a number with 0 is the number itself.' }],
    starterCode: [
      { language: 'javascript', code: 'function singleNumber(nums) {\n    // Write your code here\n}', functionName: 'singleNumber' },
      { language: 'python', code: 'def single_number(nums):\n    # Write your code here\n    pass', functionName: 'single_number' }
    ],
    acceptanceRate: 72
  },
  {
    number: 104, title: 'Missing Number', slug: 'missing-number', difficulty: 'easy',
    category: 'Array', tags: ['Array', 'Math', 'Bit Manipulation'], companies: ['Microsoft', 'Amazon'],
    description: 'Given an array `nums` containing `n` distinct numbers in the range `[0, n]`, return the only number in the range that is missing.',
    constraints: [{ description: 'n == nums.length' }, { description: '1 <= n <= 10⁴' }, { description: '0 <= nums[i] <= n' }, { description: 'All numbers are unique.' }],
    examples: [
      { input: 'nums = [3,0,1]', output: '2' },
      { input: 'nums = [0,1]', output: '2' },
      { input: 'nums = [9,6,4,2,3,5,7,0,1]', output: '8' }
    ],
    testCases: [
      { input: { nums: [3,0,1] }, expectedOutput: 2, isHidden: false },
      { input: { nums: [0,1] }, expectedOutput: 2, isHidden: false },
      { input: { nums: [9,6,4,2,3,5,7,0,1] }, expectedOutput: 8, isHidden: false },
      { input: { nums: [0] }, expectedOutput: 1, isHidden: true },
      { input: { nums: [1,2,3,4,5] }, expectedOutput: 0, isHidden: true }
    ],
    hints: [{ order: 1, text: 'Expected sum = n*(n+1)/2. Subtract actual sum.' }],
    starterCode: [
      { language: 'javascript', code: 'function missingNumber(nums) {\n    // Write your code here\n}', functionName: 'missingNumber' },
      { language: 'python', code: 'def missing_number(nums):\n    # Write your code here\n    pass', functionName: 'missing_number' }
    ],
    acceptanceRate: 63
  },
  {
    number: 105, title: 'Majority Element', slug: 'majority-element', difficulty: 'easy',
    category: 'Array', tags: ['Array', 'Hash Table', 'Divide and Conquer'], companies: ['Amazon', 'Google', 'Microsoft'],
    description: 'Given an array `nums` of size `n`, return the majority element.\n\nThe majority element is the element that appears **more than** `⌊n / 2⌋` times. You may assume the majority element always exists.',
    constraints: [{ description: 'n == nums.length' }, { description: '1 <= n <= 5 * 10⁴' }, { description: 'The majority element always exists.' }],
    examples: [
      { input: 'nums = [3,2,3]', output: '3' },
      { input: 'nums = [2,2,1,1,1,2,2]', output: '2' }
    ],
    testCases: [
      { input: { nums: [3,2,3] }, expectedOutput: 3, isHidden: false },
      { input: { nums: [2,2,1,1,1,2,2] }, expectedOutput: 2, isHidden: false },
      { input: { nums: [1] }, expectedOutput: 1, isHidden: false },
      { input: { nums: [6,5,5] }, expectedOutput: 5, isHidden: true },
      { input: { nums: [1,1,2,1] }, expectedOutput: 1, isHidden: true }
    ],
    hints: [{ order: 1, text: 'Boyer-Moore Voting Algorithm: maintain a candidate and a count.' }],
    starterCode: [
      { language: 'javascript', code: 'function majorityElement(nums) {\n    // Write your code here\n}', functionName: 'majorityElement' },
      { language: 'python', code: 'def majority_element(nums):\n    # Write your code here\n    pass', functionName: 'majority_element' }
    ],
    acceptanceRate: 64
  },
  {
    number: 106, title: 'Best Time to Buy and Sell Stock', slug: 'best-time-buy-sell-stock', difficulty: 'easy',
    category: 'Array', tags: ['Array', 'Dynamic Programming'], companies: ['Amazon', 'Facebook', 'Microsoft', 'Goldman Sachs'],
    description: 'You are given an array `prices` where `prices[i]` is the price of a stock on day `i`.\n\nReturn the maximum profit from a single buy-sell transaction. If no profit is possible, return `0`.',
    constraints: [{ description: '1 <= prices.length <= 10⁵' }, { description: '0 <= prices[i] <= 10⁴' }],
    examples: [
      { input: 'prices = [7,1,5,3,6,4]', output: '5', explanation: 'Buy on day 2 (price=1), sell on day 5 (price=6). Profit = 5.' },
      { input: 'prices = [7,6,4,3,1]', output: '0', explanation: 'No transaction gives profit.' }
    ],
    testCases: [
      { input: { prices: [7,1,5,3,6,4] }, expectedOutput: 5, isHidden: false },
      { input: { prices: [7,6,4,3,1] }, expectedOutput: 0, isHidden: false },
      { input: { prices: [1,2] }, expectedOutput: 1, isHidden: false },
      { input: { prices: [2,4,1] }, expectedOutput: 2, isHidden: true },
      { input: { prices: [3,3,3,3] }, expectedOutput: 0, isHidden: true }
    ],
    hints: [{ order: 1, text: 'Track the minimum price seen so far and maximum profit at each step.' }],
    starterCode: [
      { language: 'javascript', code: 'function maxProfit(prices) {\n    // Write your code here\n}', functionName: 'maxProfit' },
      { language: 'python', code: 'def max_profit(prices):\n    # Write your code here\n    pass', functionName: 'max_profit' }
    ],
    acceptanceRate: 54
  },
  {
    number: 107, title: "Pascal's Triangle", slug: 'pascals-triangle', difficulty: 'easy',
    category: 'Array', tags: ['Array', 'Dynamic Programming'], companies: ['Apple', 'Amazon'],
    description: "Given an integer `numRows`, return the first `numRows` of Pascal's triangle.\n\nIn Pascal's triangle, each number is the sum of the two numbers directly above it.",
    constraints: [{ description: '1 <= numRows <= 30' }],
    examples: [
      { input: 'numRows = 5', output: '[[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]' },
      { input: 'numRows = 1', output: '[[1]]' }
    ],
    testCases: [
      { input: { numRows: 5 }, expectedOutput: [[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]], isHidden: false },
      { input: { numRows: 1 }, expectedOutput: [[1]], isHidden: false },
      { input: { numRows: 2 }, expectedOutput: [[1],[1,1]], isHidden: false },
      { input: { numRows: 3 }, expectedOutput: [[1],[1,1],[1,2,1]], isHidden: true },
      { input: { numRows: 6 }, expectedOutput: [[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1],[1,5,10,10,5,1]], isHidden: true }
    ],
    hints: [{ order: 1, text: 'Each row starts and ends with 1. Middle elements are sum of the two above.' }],
    starterCode: [
      { language: 'javascript', code: 'function generate(numRows) {\n    // Write your code here\n}', functionName: 'generate' },
      { language: 'python', code: 'def generate(num_rows):\n    # Write your code here\n    pass', functionName: 'generate' }
    ],
    acceptanceRate: 70
  },
  {
    number: 108, title: 'Contains Duplicate', slug: 'contains-duplicate', difficulty: 'easy',
    category: 'Hash Table', tags: ['Array', 'Hash Table', 'Sorting'], companies: ['Amazon', 'Apple', 'Bloomberg'],
    description: 'Given an integer array `nums`, return `true` if any value appears at least twice, and `false` if every element is distinct.',
    constraints: [{ description: '1 <= nums.length <= 10⁵' }, { description: '-10⁹ <= nums[i] <= 10⁹' }],
    examples: [
      { input: 'nums = [1,2,3,1]', output: 'true' },
      { input: 'nums = [1,2,3,4]', output: 'false' },
      { input: 'nums = [1,1,1,3,3,4,3,2,4,2]', output: 'true' }
    ],
    testCases: [
      { input: { nums: [1,2,3,1] }, expectedOutput: true, isHidden: false },
      { input: { nums: [1,2,3,4] }, expectedOutput: false, isHidden: false },
      { input: { nums: [1,1,1,3,3,4,3,2,4,2] }, expectedOutput: true, isHidden: false },
      { input: { nums: [1] }, expectedOutput: false, isHidden: true },
      { input: { nums: [0,0] }, expectedOutput: true, isHidden: true }
    ],
    hints: [{ order: 1, text: 'Use a Set to track seen elements.' }],
    starterCode: [
      { language: 'javascript', code: 'function containsDuplicate(nums) {\n    // Write your code here\n}', functionName: 'containsDuplicate' },
      { language: 'python', code: 'def contains_duplicate(nums):\n    # Write your code here\n    pass', functionName: 'contains_duplicate' }
    ],
    acceptanceRate: 61
  },
  {
    number: 109, title: 'Valid Anagram', slug: 'valid-anagram', difficulty: 'easy',
    category: 'Hash Table', tags: ['Hash Table', 'String', 'Sorting'], companies: ['Amazon', 'Microsoft', 'Lyft'],
    description: 'Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.',
    constraints: [{ description: '1 <= s.length, t.length <= 5 * 10⁴' }, { description: 's and t consist of lowercase English letters.' }],
    examples: [
      { input: 's = "anagram", t = "nagaram"', output: 'true' },
      { input: 's = "rat", t = "car"', output: 'false' }
    ],
    testCases: [
      { input: { s: 'anagram', t: 'nagaram' }, expectedOutput: true, isHidden: false },
      { input: { s: 'rat', t: 'car' }, expectedOutput: false, isHidden: false },
      { input: { s: 'a', t: 'a' }, expectedOutput: true, isHidden: false },
      { input: { s: 'ab', t: 'a' }, expectedOutput: false, isHidden: true },
      { input: { s: 'listen', t: 'silent' }, expectedOutput: true, isHidden: true }
    ],
    hints: [{ order: 1, text: 'Count character frequencies in both strings and compare.' }],
    starterCode: [
      { language: 'javascript', code: 'function isAnagram(s, t) {\n    // Write your code here\n}', functionName: 'isAnagram' },
      { language: 'python', code: 'def is_anagram(s, t):\n    # Write your code here\n    pass', functionName: 'is_anagram' }
    ],
    acceptanceRate: 63
  },
  {
    number: 110, title: 'Power of Two', slug: 'power-of-two', difficulty: 'easy',
    category: 'Math', tags: ['Math', 'Bit Manipulation', 'Recursion'], companies: ['Amazon', 'Google'],
    description: 'Given an integer `n`, return `true` if it is a power of two. Otherwise, return `false`.\n\nAn integer `n` is a power of two if there exists an integer `x` such that `n == 2^x`.',
    constraints: [{ description: '-2³¹ <= n <= 2³¹ - 1' }],
    examples: [
      { input: 'n = 1', output: 'true', explanation: '2⁰ = 1' },
      { input: 'n = 16', output: 'true', explanation: '2⁴ = 16' },
      { input: 'n = 3', output: 'false' }
    ],
    testCases: [
      { input: { n: 1 }, expectedOutput: true, isHidden: false },
      { input: { n: 16 }, expectedOutput: true, isHidden: false },
      { input: { n: 3 }, expectedOutput: false, isHidden: false },
      { input: { n: 0 }, expectedOutput: false, isHidden: true },
      { input: { n: 64 }, expectedOutput: true, isHidden: true }
    ],
    hints: [{ order: 1, text: 'A power of two in binary has exactly one 1-bit. n & (n-1) == 0 for powers of two.' }],
    starterCode: [
      { language: 'javascript', code: 'function isPowerOfTwo(n) {\n    // Write your code here\n}', functionName: 'isPowerOfTwo' },
      { language: 'python', code: 'def is_power_of_two(n):\n    # Write your code here\n    pass', functionName: 'is_power_of_two' }
    ],
    acceptanceRate: 46
  },
  {
    number: 111, title: 'Move Zeroes', slug: 'move-zeroes', difficulty: 'easy',
    category: 'Array', tags: ['Array', 'Two Pointers'], companies: ['Facebook', 'Microsoft', 'Bloomberg'],
    description: 'Given an integer array `nums`, move all `0`s to the end while maintaining the relative order of the non-zero elements.\n\nReturn the modified array.',
    constraints: [{ description: '1 <= nums.length <= 10⁴' }, { description: '-2³¹ <= nums[i] <= 2³¹ - 1' }],
    examples: [
      { input: 'nums = [0,1,0,3,12]', output: '[1,3,12,0,0]' },
      { input: 'nums = [0]', output: '[0]' }
    ],
    testCases: [
      { input: { nums: [0,1,0,3,12] }, expectedOutput: [1,3,12,0,0], isHidden: false },
      { input: { nums: [0] }, expectedOutput: [0], isHidden: false },
      { input: { nums: [1,2,3] }, expectedOutput: [1,2,3], isHidden: false },
      { input: { nums: [0,0,1] }, expectedOutput: [1,0,0], isHidden: true },
      { input: { nums: [4,0,2,0,1] }, expectedOutput: [4,2,1,0,0], isHidden: true }
    ],
    hints: [{ order: 1, text: 'Use a write pointer for the next non-zero position.' }],
    starterCode: [
      { language: 'javascript', code: 'function moveZeroes(nums) {\n    // Write your code here\n    return nums;\n}', functionName: 'moveZeroes' },
      { language: 'python', code: 'def move_zeroes(nums):\n    # Write your code here\n    return nums', functionName: 'move_zeroes' }
    ],
    acceptanceRate: 61
  },
  {
    number: 112, title: 'Ransom Note', slug: 'ransom-note', difficulty: 'easy',
    category: 'Hash Table', tags: ['Hash Table', 'String', 'Counting'], companies: ['Amazon', 'Google'],
    description: 'Given two strings `ransomNote` and `magazine`, return `true` if `ransomNote` can be constructed by using the letters from `magazine`, and `false` otherwise.\n\nEach letter in magazine can only be used once.',
    constraints: [{ description: '1 <= ransomNote.length, magazine.length <= 10⁵' }, { description: 'Strings consist of lowercase English letters.' }],
    examples: [
      { input: 'ransomNote = "a", magazine = "b"', output: 'false' },
      { input: 'ransomNote = "aa", magazine = "ab"', output: 'false' },
      { input: 'ransomNote = "aa", magazine = "aab"', output: 'true' }
    ],
    testCases: [
      { input: { ransomNote: 'a', magazine: 'b' }, expectedOutput: false, isHidden: false },
      { input: { ransomNote: 'aa', magazine: 'ab' }, expectedOutput: false, isHidden: false },
      { input: { ransomNote: 'aa', magazine: 'aab' }, expectedOutput: true, isHidden: false },
      { input: { ransomNote: 'abc', magazine: 'aabbcc' }, expectedOutput: true, isHidden: true },
      { input: { ransomNote: 'xyz', magazine: 'xy' }, expectedOutput: false, isHidden: true }
    ],
    hints: [{ order: 1, text: 'Count character frequencies in magazine, then check if ransomNote needs more of any character.' }],
    starterCode: [
      { language: 'javascript', code: 'function canConstruct(ransomNote, magazine) {\n    // Write your code here\n}', functionName: 'canConstruct' },
      { language: 'python', code: 'def can_construct(ransom_note, magazine):\n    # Write your code here\n    pass', functionName: 'can_construct' }
    ],
    acceptanceRate: 58
  },
  {
    number: 113, title: 'Reverse String', slug: 'reverse-string', difficulty: 'easy',
    category: 'String', tags: ['Two Pointers', 'String'], companies: ['Amazon', 'Apple'],
    description: 'Write a function that reverses an array of characters `s` in-place. Return the reversed array.',
    constraints: [{ description: '1 <= s.length <= 10⁵' }, { description: 's[i] is a printable ASCII character.' }],
    examples: [
      { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]' },
      { input: 's = ["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]' }
    ],
    testCases: [
      { input: { s: ['h','e','l','l','o'] }, expectedOutput: ['o','l','l','e','h'], isHidden: false },
      { input: { s: ['H','a','n','n','a','h'] }, expectedOutput: ['h','a','n','n','a','H'], isHidden: false },
      { input: { s: ['a'] }, expectedOutput: ['a'], isHidden: false },
      { input: { s: ['A','B','C'] }, expectedOutput: ['C','B','A'], isHidden: true },
      { input: { s: ['1','2','3','4'] }, expectedOutput: ['4','3','2','1'], isHidden: true }
    ],
    hints: [{ order: 1, text: 'Use two pointers swapping from both ends towards the middle.' }],
    starterCode: [
      { language: 'javascript', code: 'function reverseString(s) {\n    // Write your code here\n    return s;\n}', functionName: 'reverseString' },
      { language: 'python', code: 'def reverse_string(s):\n    # Write your code here\n    return s', functionName: 'reverse_string' }
    ],
    acceptanceRate: 77
  },
  {
    number: 114, title: 'Climbing Stairs', slug: 'climbing-stairs', difficulty: 'easy',
    category: 'Dynamic Programming', tags: ['Math', 'Dynamic Programming', 'Memoization'], companies: ['Amazon', 'Google', 'Adobe'],
    description: 'You are climbing a staircase. It takes `n` steps to reach the top.\n\nEach time you can either climb `1` or `2` steps. In how many distinct ways can you climb to the top?',
    constraints: [{ description: '1 <= n <= 45' }],
    examples: [
      { input: 'n = 2', output: '2', explanation: '1+1 or 2' },
      { input: 'n = 3', output: '3', explanation: '1+1+1, 1+2, 2+1' }
    ],
    testCases: [
      { input: { n: 2 }, expectedOutput: 2, isHidden: false },
      { input: { n: 3 }, expectedOutput: 3, isHidden: false },
      { input: { n: 1 }, expectedOutput: 1, isHidden: false },
      { input: { n: 5 }, expectedOutput: 8, isHidden: true },
      { input: { n: 10 }, expectedOutput: 89, isHidden: true }
    ],
    hints: [{ order: 1, text: 'The number of ways to reach step n is climbStairs(n-1) + climbStairs(n-2).' }, { order: 2, text: 'This is the Fibonacci sequence!' }],
    starterCode: [
      { language: 'javascript', code: 'function climbStairs(n) {\n    // Write your code here\n}', functionName: 'climbStairs' },
      { language: 'python', code: 'def climb_stairs(n):\n    # Write your code here\n    pass', functionName: 'climb_stairs' }
    ],
    acceptanceRate: 52
  },
  {
    number: 115, title: 'Maximum Subarray', slug: 'maximum-subarray', difficulty: 'easy',
    category: 'Array', tags: ['Array', 'Dynamic Programming', 'Divide and Conquer'], companies: ['Amazon', 'Apple', 'LinkedIn', 'Google'],
    description: 'Given an integer array `nums`, find the subarray with the largest sum, and return its sum.',
    constraints: [{ description: '1 <= nums.length <= 10⁵' }, { description: '-10⁴ <= nums[i] <= 10⁴' }],
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'Subarray [4,-1,2,1] has sum 6.' },
      { input: 'nums = [1]', output: '1' },
      { input: 'nums = [5,4,-1,7,8]', output: '23' }
    ],
    testCases: [
      { input: { nums: [-2,1,-3,4,-1,2,1,-5,4] }, expectedOutput: 6, isHidden: false },
      { input: { nums: [1] }, expectedOutput: 1, isHidden: false },
      { input: { nums: [5,4,-1,7,8] }, expectedOutput: 23, isHidden: false },
      { input: { nums: [-1,-2,-3] }, expectedOutput: -1, isHidden: true },
      { input: { nums: [1,-1,1,-1,1] }, expectedOutput: 1, isHidden: true }
    ],
    hints: [{ order: 1, text: "Kadane's Algorithm: at each index decide to extend or start a new subarray." }],
    starterCode: [
      { language: 'javascript', code: 'function maxSubArray(nums) {\n    // Write your code here\n}', functionName: 'maxSubArray' },
      { language: 'python', code: 'def max_sub_array(nums):\n    # Write your code here\n    pass', functionName: 'max_sub_array' }
    ],
    acceptanceRate: 50
  },

  // ── MEDIUM 116-125 ─────────────────────────────────────────────────────────
  {
    number: 116, title: '3Sum', slug: 'three-sum', difficulty: 'medium',
    category: 'Array', tags: ['Array', 'Two Pointers', 'Sorting'], companies: ['Amazon', 'Facebook', 'Microsoft', 'Apple'],
    description: 'Given an integer array `nums`, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j != k` and `nums[i] + nums[j] + nums[k] == 0`.\n\nThe solution set must not contain duplicate triplets.',
    constraints: [{ description: '3 <= nums.length <= 3000' }, { description: '-10⁵ <= nums[i] <= 10⁵' }],
    examples: [
      { input: 'nums = [-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]' },
      { input: 'nums = [0,1,1]', output: '[]' },
      { input: 'nums = [0,0,0]', output: '[[0,0,0]]' }
    ],
    testCases: [
      { input: { nums: [-1,0,1,2,-1,-4] }, expectedOutput: [[-1,-1,2],[-1,0,1]], isHidden: false },
      { input: { nums: [0,1,1] }, expectedOutput: [], isHidden: false },
      { input: { nums: [0,0,0] }, expectedOutput: [[0,0,0]], isHidden: false },
      { input: { nums: [-2,0,1,1,2] }, expectedOutput: [[-2,0,2],[-2,1,1]], isHidden: true },
      { input: { nums: [1,2,3] }, expectedOutput: [], isHidden: true }
    ],
    hints: [
      { order: 1, text: 'Sort the array first.' },
      { order: 2, text: 'For each element, use two pointers to find pairs that sum to its negation.' },
      { order: 3, text: 'Skip duplicates by checking if the current element equals the previous.' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function threeSum(nums) {\n    // Write your code here\n}', functionName: 'threeSum' },
      { language: 'python', code: 'def three_sum(nums):\n    # Write your code here\n    pass', functionName: 'three_sum' }
    ],
    acceptanceRate: 33
  },
  {
    number: 117, title: 'Longest Substring Without Repeating Characters', slug: 'longest-substring-no-repeat', difficulty: 'medium',
    category: 'Sliding Window', tags: ['Hash Table', 'String', 'Sliding Window'], companies: ['Amazon', 'Bloomberg', 'Facebook', 'Google'],
    description: 'Given a string `s`, find the length of the **longest substring** without repeating characters.',
    constraints: [{ description: '0 <= s.length <= 5 * 10⁴' }, { description: 's consists of English letters, digits, symbols and spaces.' }],
    examples: [
      { input: 's = "abcabcbb"', output: '3', explanation: '"abc" has length 3.' },
      { input: 's = "bbbbb"', output: '1' },
      { input: 's = "pwwkew"', output: '3', explanation: '"wke"' }
    ],
    testCases: [
      { input: { s: 'abcabcbb' }, expectedOutput: 3, isHidden: false },
      { input: { s: 'bbbbb' }, expectedOutput: 1, isHidden: false },
      { input: { s: 'pwwkew' }, expectedOutput: 3, isHidden: false },
      { input: { s: '' }, expectedOutput: 0, isHidden: true },
      { input: { s: 'aab' }, expectedOutput: 2, isHidden: true }
    ],
    hints: [{ order: 1, text: 'Use a sliding window with a set to track current window characters.' }],
    starterCode: [
      { language: 'javascript', code: 'function lengthOfLongestSubstring(s) {\n    // Write your code here\n}', functionName: 'lengthOfLongestSubstring' },
      { language: 'python', code: 'def length_of_longest_substring(s):\n    # Write your code here\n    pass', functionName: 'length_of_longest_substring' }
    ],
    acceptanceRate: 34
  },
  {
    number: 118, title: 'Product of Array Except Self', slug: 'product-except-self', difficulty: 'medium',
    category: 'Array', tags: ['Array', 'Prefix Sum'], companies: ['Amazon', 'Facebook', 'Microsoft', 'Apple', 'Google'],
    description: 'Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`.\n\nYou must not use the division operation.',
    constraints: [{ description: '2 <= nums.length <= 10⁵' }, { description: '-30 <= nums[i] <= 30' }, { description: 'The product fits in a 32-bit integer.' }],
    examples: [
      { input: 'nums = [1,2,3,4]', output: '[24,12,8,6]' },
      { input: 'nums = [-1,1,0,-3,3]', output: '[0,0,9,0,0]' }
    ],
    testCases: [
      { input: { nums: [1,2,3,4] }, expectedOutput: [24,12,8,6], isHidden: false },
      { input: { nums: [-1,1,0,-3,3] }, expectedOutput: [0,0,9,0,0], isHidden: false },
      { input: { nums: [2,3] }, expectedOutput: [3,2], isHidden: false },
      { input: { nums: [1,1,1,1] }, expectedOutput: [1,1,1,1], isHidden: true },
      { input: { nums: [2,2,2,2] }, expectedOutput: [8,8,8,8], isHidden: true }
    ],
    hints: [
      { order: 1, text: 'Use prefix products and suffix products.' },
      { order: 2, text: 'answer[i] = product of all elements to the left × product of all elements to the right.' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function productExceptSelf(nums) {\n    // Write your code here\n}', functionName: 'productExceptSelf' },
      { language: 'python', code: 'def product_except_self(nums):\n    # Write your code here\n    pass', functionName: 'product_except_self' }
    ],
    acceptanceRate: 65
  },
  {
    number: 119, title: 'Group Anagrams', slug: 'group-anagrams', difficulty: 'medium',
    category: 'Hash Table', tags: ['Array', 'Hash Table', 'String', 'Sorting'], companies: ['Amazon', 'Facebook', 'Google', 'Uber'],
    description: 'Given an array of strings `strs`, group the anagrams together. You can return the answer in any order.',
    constraints: [{ description: '1 <= strs.length <= 10⁴' }, { description: '0 <= strs[i].length <= 100' }, { description: 'strs[i] consists of lowercase English letters.' }],
    examples: [
      { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]' },
      { input: 'strs = [""]', output: '[[""]]' },
      { input: 'strs = ["a"]', output: '[["a"]]' }
    ],
    testCases: [
      { input: { strs: ['eat','tea','tan','ate','nat','bat'] }, expectedOutput: [['bat'],['nat','tan'],['ate','eat','tea']], isHidden: false },
      { input: { strs: [''] }, expectedOutput: [['']], isHidden: false },
      { input: { strs: ['a'] }, expectedOutput: [['a']], isHidden: false },
      { input: { strs: ['abc','bca','cab','xyz'] }, expectedOutput: [['abc','bca','cab'],['xyz']], isHidden: true }
    ],
    hints: [{ order: 1, text: 'Sort each string to get a canonical key; group by that key.' }],
    starterCode: [
      { language: 'javascript', code: 'function groupAnagrams(strs) {\n    // Write your code here\n}', functionName: 'groupAnagrams' },
      { language: 'python', code: 'def group_anagrams(strs):\n    # Write your code here\n    pass', functionName: 'group_anagrams' }
    ],
    acceptanceRate: 67
  },
  {
    number: 120, title: 'Jump Game', slug: 'jump-game', difficulty: 'medium',
    category: 'Greedy', tags: ['Array', 'Dynamic Programming', 'Greedy'], companies: ['Amazon', 'Microsoft', 'Apple'],
    description: 'You are given an integer array `nums`. You are initially positioned at the first index.\n\nEach element represents your maximum jump length. Return `true` if you can reach the last index.',
    constraints: [{ description: '1 <= nums.length <= 10⁴' }, { description: '0 <= nums[i] <= 10⁵' }],
    examples: [
      { input: 'nums = [2,3,1,1,4]', output: 'true' },
      { input: 'nums = [3,2,1,0,4]', output: 'false', explanation: 'Always reach index 3 with value 0.' }
    ],
    testCases: [
      { input: { nums: [2,3,1,1,4] }, expectedOutput: true, isHidden: false },
      { input: { nums: [3,2,1,0,4] }, expectedOutput: false, isHidden: false },
      { input: { nums: [1] }, expectedOutput: true, isHidden: false },
      { input: { nums: [0] }, expectedOutput: true, isHidden: true },
      { input: { nums: [1,0,2] }, expectedOutput: false, isHidden: true }
    ],
    hints: [{ order: 1, text: 'Track the farthest index you can reach. If current index > farthest, return false.' }],
    starterCode: [
      { language: 'javascript', code: 'function canJump(nums) {\n    // Write your code here\n}', functionName: 'canJump' },
      { language: 'python', code: 'def can_jump(nums):\n    # Write your code here\n    pass', functionName: 'can_jump' }
    ],
    acceptanceRate: 38
  },
  {
    number: 121, title: 'Subarray Sum Equals K', slug: 'subarray-sum-k', difficulty: 'medium',
    category: 'Hash Table', tags: ['Array', 'Hash Table', 'Prefix Sum'], companies: ['Facebook', 'Google', 'Amazon', 'Cisco'],
    description: 'Given an array of integers `nums` and an integer `k`, return the total number of subarrays whose sum equals to `k`.',
    constraints: [{ description: '1 <= nums.length <= 2 * 10⁴' }, { description: '-1000 <= nums[i] <= 1000' }, { description: '-10⁷ <= k <= 10⁷' }],
    examples: [
      { input: 'nums = [1,1,1], k = 2', output: '2' },
      { input: 'nums = [1,2,3], k = 3', output: '2' }
    ],
    testCases: [
      { input: { nums: [1,1,1], k: 2 }, expectedOutput: 2, isHidden: false },
      { input: { nums: [1,2,3], k: 3 }, expectedOutput: 2, isHidden: false },
      { input: { nums: [1], k: 1 }, expectedOutput: 1, isHidden: false },
      { input: { nums: [1,-1,0], k: 0 }, expectedOutput: 3, isHidden: true },
      { input: { nums: [3,4,7,2,-3,1,4,2], k: 7 }, expectedOutput: 4, isHidden: true }
    ],
    hints: [
      { order: 1, text: 'Use prefix sums with a hash map.' },
      { order: 2, text: 'If prefixSum[j] - prefixSum[i] == k, then subarray [i+1..j] has sum k.' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function subarraySum(nums, k) {\n    // Write your code here\n}', functionName: 'subarraySum' },
      { language: 'python', code: 'def subarray_sum(nums, k):\n    # Write your code here\n    pass', functionName: 'subarray_sum' }
    ],
    acceptanceRate: 44
  },
  {
    number: 122, title: 'Merge Intervals', slug: 'merge-intervals', difficulty: 'medium',
    category: 'Array', tags: ['Array', 'Sorting'], companies: ['Facebook', 'Google', 'Twitter', 'Microsoft', 'Bloomberg'],
    description: 'Given an array of `intervals` where `intervals[i] = [starti, endi]`, merge all overlapping intervals, and return an array of the non-overlapping intervals.',
    constraints: [{ description: '1 <= intervals.length <= 10⁴' }, { description: 'intervals[i].length == 2' }, { description: '0 <= starti <= endi <= 10⁴' }],
    examples: [
      { input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]' },
      { input: 'intervals = [[1,4],[4,5]]', output: '[[1,5]]' }
    ],
    testCases: [
      { input: { intervals: [[1,3],[2,6],[8,10],[15,18]] }, expectedOutput: [[1,6],[8,10],[15,18]], isHidden: false },
      { input: { intervals: [[1,4],[4,5]] }, expectedOutput: [[1,5]], isHidden: false },
      { input: { intervals: [[1,4]] }, expectedOutput: [[1,4]], isHidden: false },
      { input: { intervals: [[1,4],[0,4]] }, expectedOutput: [[0,4]], isHidden: true },
      { input: { intervals: [[1,4],[2,3]] }, expectedOutput: [[1,4]], isHidden: true }
    ],
    hints: [{ order: 1, text: 'Sort intervals by start time. Then iterate and merge overlapping ones.' }],
    starterCode: [
      { language: 'javascript', code: 'function merge(intervals) {\n    // Write your code here\n}', functionName: 'merge' },
      { language: 'python', code: 'def merge(intervals):\n    # Write your code here\n    pass', functionName: 'merge' }
    ],
    acceptanceRate: 46
  },
  {
    number: 123, title: 'Unique Paths', slug: 'unique-paths', difficulty: 'medium',
    category: 'Dynamic Programming', tags: ['Math', 'Dynamic Programming', 'Combinatorics'], companies: ['Amazon', 'Google', 'Bloomberg'],
    description: 'A robot is on an `m x n` grid at the top-left corner. It can only move right or down.\n\nReturn the number of unique paths to reach the bottom-right corner.',
    constraints: [{ description: '1 <= m, n <= 100' }],
    examples: [
      { input: 'm = 3, n = 7', output: '28' },
      { input: 'm = 3, n = 2', output: '3' }
    ],
    testCases: [
      { input: { m: 3, n: 7 }, expectedOutput: 28, isHidden: false },
      { input: { m: 3, n: 2 }, expectedOutput: 3, isHidden: false },
      { input: { m: 1, n: 1 }, expectedOutput: 1, isHidden: false },
      { input: { m: 2, n: 2 }, expectedOutput: 2, isHidden: true },
      { input: { m: 5, n: 5 }, expectedOutput: 70, isHidden: true }
    ],
    hints: [{ order: 1, text: 'dp[i][j] = dp[i-1][j] + dp[i][j-1]. Base case: first row/col = 1.' }],
    starterCode: [
      { language: 'javascript', code: 'function uniquePaths(m, n) {\n    // Write your code here\n}', functionName: 'uniquePaths' },
      { language: 'python', code: 'def unique_paths(m, n):\n    # Write your code here\n    pass', functionName: 'unique_paths' }
    ],
    acceptanceRate: 62
  },
  {
    number: 124, title: 'Coin Change', slug: 'coin-change', difficulty: 'medium',
    category: 'Dynamic Programming', tags: ['Array', 'Dynamic Programming', 'BFS'], companies: ['Amazon', 'Microsoft', 'Google', 'Goldman Sachs'],
    description: 'You are given an integer array `coins` representing coins of different denominations and an integer `amount`.\n\nReturn the fewest number of coins needed to make up that amount. If it is impossible, return `-1`.',
    constraints: [{ description: '1 <= coins.length <= 12' }, { description: '1 <= coins[i] <= 2³¹ - 1' }, { description: '0 <= amount <= 10⁴' }],
    examples: [
      { input: 'coins = [1,5,11], amount = 15', output: '3', explanation: '5+5+5' },
      { input: 'coins = [2], amount = 3', output: '-1' },
      { input: 'coins = [1], amount = 0', output: '0' }
    ],
    testCases: [
      { input: { coins: [1,5,11], amount: 15 }, expectedOutput: 3, isHidden: false },
      { input: { coins: [2], amount: 3 }, expectedOutput: -1, isHidden: false },
      { input: { coins: [1], amount: 0 }, expectedOutput: 0, isHidden: false },
      { input: { coins: [1,2,5], amount: 11 }, expectedOutput: 3, isHidden: true },
      { input: { coins: [186,419,83,408], amount: 6249 }, expectedOutput: 20, isHidden: true }
    ],
    hints: [
      { order: 1, text: 'Build a dp array of size amount+1 initialised to Infinity.' },
      { order: 2, text: 'dp[i] = min(dp[i], dp[i - coin] + 1) for each coin.' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function coinChange(coins, amount) {\n    // Write your code here\n}', functionName: 'coinChange' },
      { language: 'python', code: 'def coin_change(coins, amount):\n    # Write your code here\n    pass', functionName: 'coin_change' }
    ],
    acceptanceRate: 42
  },
  {
    number: 125, title: 'Daily Temperatures', slug: 'daily-temperatures', difficulty: 'medium',
    category: 'Stack', tags: ['Array', 'Stack', 'Monotonic Stack'], companies: ['Amazon', 'Facebook', 'Google'],
    description: 'Given an array of integers `temperatures` representing daily temperatures, return an array `answer` where `answer[i]` is the number of days until a warmer temperature. If no warmer day exists, `answer[i] == 0`.',
    constraints: [{ description: '1 <= temperatures.length <= 10⁵' }, { description: '30 <= temperatures[i] <= 100' }],
    examples: [
      { input: 'temperatures = [73,74,75,71,69,72,76,73]', output: '[1,1,4,2,1,1,0,0]' },
      { input: 'temperatures = [30,40,50,60]', output: '[1,1,1,0]' },
      { input: 'temperatures = [30,60,90]', output: '[1,1,0]' }
    ],
    testCases: [
      { input: { temperatures: [73,74,75,71,69,72,76,73] }, expectedOutput: [1,1,4,2,1,1,0,0], isHidden: false },
      { input: { temperatures: [30,40,50,60] }, expectedOutput: [1,1,1,0], isHidden: false },
      { input: { temperatures: [30,60,90] }, expectedOutput: [1,1,0], isHidden: false },
      { input: { temperatures: [90,80,70,60] }, expectedOutput: [0,0,0,0], isHidden: true },
      { input: { temperatures: [70,71,70,71] }, expectedOutput: [1,0,1,0], isHidden: true }
    ],
    hints: [{ order: 1, text: 'Use a monotonic decreasing stack storing indices. Pop when a warmer day is found.' }],
    starterCode: [
      { language: 'javascript', code: 'function dailyTemperatures(temperatures) {\n    // Write your code here\n}', functionName: 'dailyTemperatures' },
      { language: 'python', code: 'def daily_temperatures(temperatures):\n    # Write your code here\n    pass', functionName: 'daily_temperatures' }
    ],
    acceptanceRate: 67
  }
];

mongoose.connect(mongoURI).then(async () => {
  console.log('✅ Connected to MongoDB');
  let added = 0, skipped = 0;
  for (const ch of challenges) {
    const exists = await CodingChallenge.findOne({ slug: ch.slug });
    if (exists) { skipped++; console.log(`  ⏭  Skipped: ${ch.title}`); continue; }
    await CodingChallenge.create({ ...ch, totalSubmissions: 0, totalAccepted: 0 });
    added++;
    console.log(`  ✓ Added #${ch.number}: ${ch.title}`);
  }
  console.log(`\n✅ Batch 1 done! Added: ${added}, Skipped: ${skipped}`);
  mongoose.disconnect();
}).catch(e => { console.error('❌', e.message); process.exit(1); });
