require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const CodingChallenge = require('../models/CodingChallenge');

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/seek_platform';
mongoose.connect(mongoURI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

const challenges = [
  // ==================== EASY CHALLENGES (30 problems) ====================
  {
    number: 1,
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'easy',
    category: 'Array',
    tags: ['Array', 'Hash Table'],
    companies: ['Google', 'Amazon', 'Facebook', 'Microsoft'],
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have **exactly one solution**, and you may not use the same element twice.

You can return the answer in any order.`,
    constraints: [
      { description: '2 <= nums.length <= 10⁴' },
      { description: '-10⁹ <= nums[i] <= 10⁹' },
      { description: '-10⁹ <= target <= 10⁹' },
      { description: 'Only one valid answer exists.' }
    ],
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
      }
    ],
    testCases: [
      { input: { nums: [2, 7, 11, 15], target: 9 }, expectedOutput: [0, 1], isHidden: false },
      { input: { nums: [3, 2, 4], target: 6 }, expectedOutput: [1, 2], isHidden: false },
      { input: { nums: [3, 3], target: 6 }, expectedOutput: [0, 1], isHidden: true }
    ],
    hints: [
      { order: 1, text: 'Use a hash map to store numbers and their indices.' },
      { order: 2, text: 'For each number, check if target - number exists in the hash map.' }
    ],
    starterCode: [
      { language: 'javascript', code: `function twoSum(nums, target) {\n    // Write your code here\n\n}`, functionName: 'twoSum' },
      { language: 'python', code: `def two_sum(nums, target):\n    # Write your code here\n    pass`, functionName: 'two_sum' }
    ],
    acceptanceRate: 49.2,
    likes: 42500,
    dislikes: 1350
  },

  {
    number: 2,
    title: 'Palindrome Number',
    slug: 'palindrome-number',
    difficulty: 'easy',
    category: 'Math',
    tags: ['Math'],
    companies: ['Amazon', 'Google', 'Bloomberg'],
    description: `Given an integer \`x\`, return \`true\` if \`x\` is a palindrome, and \`false\` otherwise.`,
    constraints: [
      { description: '-2³¹ <= x <= 2³¹ - 1' }
    ],
    examples: [
      { input: 'x = 121', output: 'true', explanation: '121 reads the same backward as forward.' }
    ],
    testCases: [
      { input: { x: 121 }, expectedOutput: true, isHidden: false },
      { input: { x: -121 }, expectedOutput: false, isHidden: false },
      { input: { x: 10 }, expectedOutput: false, isHidden: true }
    ],
    hints: [
      { order: 1, text: 'Negative numbers are not palindromes.' }
    ],
    starterCode: [
      { language: 'javascript', code: `function isPalindrome(x) {\n    // Write your code here\n\n}`, functionName: 'isPalindrome' }
    ],
    acceptanceRate: 53.8,
    likes: 9200,
    dislikes: 2100
  },

  {
    number: 3,
    title: 'Roman to Integer',
    slug: 'roman-to-integer',
    difficulty: 'easy',
    category: 'String',
    tags: ['Hash Table', 'Math', 'String'],
    companies: ['Amazon', 'Microsoft', 'Facebook'],
    description: `Roman numerals are represented by seven different symbols: I, V, X, L, C, D and M.

| Symbol | Value |
|--------|-------|
| I      | 1     |
| V      | 5     |
| X      | 10    |
| L      | 50    |
| C      | 100   |
| D      | 500   |
| M      | 1000  |

For example, 2 is written as II, just two ones added together. 12 is written as XII, which is X + II. The number 27 is written as XXVII, which is XX + V + II.

Roman numerals are usually written largest to smallest from left to right. However, the numeral for four is not IIII. Instead, the number four is written as IV. Because the one is before the five we subtract it making four. The same principle applies to the number nine, which is written as IX.

Given a roman numeral, convert it to an integer.`,
    constraints: [
      { description: '1 <= s.length <= 15' },
      { description: 's contains only the characters (\'I\', \'V\', \'X\', \'L\', \'C\', \'D\', \'M\').' },
      { description: 'It is guaranteed that s is a valid roman numeral in the range [1, 3999].' }
    ],
    examples: [
      { input: 's = "III"', output: '3', explanation: 'III = 3.' },
      { input: 's = "LVIII"', output: '58', explanation: 'L = 50, V = 5, III = 3.' },
      { input: 's = "MCMXCIV"', output: '1994', explanation: 'M = 1000, CM = 900, XC = 90, IV = 4.' }
    ],
    testCases: [
      { input: { s: 'III' }, expectedOutput: 3, isHidden: false },
      { input: { s: 'LVIII' }, expectedOutput: 58, isHidden: false },
      { input: { s: 'MCMXCIV' }, expectedOutput: 1994, isHidden: true }
    ],
    hints: [
      { order: 1, text: 'Use a map to store the roman numeral values.' },
      { order: 2, text: 'If current value is less than next value, subtract it; otherwise, add it.' }
    ],
    starterCode: [
      { language: 'javascript', code: `function romanToInt(s) {\n    // Write your code here\n\n}`, functionName: 'romanToInt' }
    ],
    acceptanceRate: 58.5,
    likes: 12300,
    dislikes: 780
  },

  {
    number: 4,
    title: 'Longest Common Prefix',
    slug: 'longest-common-prefix',
    difficulty: 'easy',
    category: 'String',
    tags: ['String', 'Trie'],
    companies: ['Google', 'Amazon'],
    description: `Write a function to find the longest common prefix string amongst an array of strings.

If there is no common prefix, return an empty string \`""\`.`,
    constraints: [
      { description: '1 <= strs.length <= 200' },
      { description: '0 <= strs[i].length <= 200' },
      { description: 'strs[i] consists of only lowercase English letters.' }
    ],
    examples: [
      { input: 'strs = ["flower","flow","flight"]', output: '"fl"' },
      { input: 'strs = ["dog","racecar","car"]', output: '""', explanation: 'There is no common prefix.' }
    ],
    testCases: [
      { input: { strs: ['flower', 'flow', 'flight'] }, expectedOutput: 'fl', isHidden: false },
      { input: { strs: ['dog', 'racecar', 'car'] }, expectedOutput: '', isHidden: false },
      { input: { strs: ['a'] }, expectedOutput: 'a', isHidden: true }
    ],
    hints: [
      { order: 1, text: 'Compare characters of the first string with all other strings.' }
    ],
    starterCode: [
      { language: 'javascript', code: `function longestCommonPrefix(strs) {\n    // Write your code here\n\n}`, functionName: 'longestCommonPrefix' }
    ],
    acceptanceRate: 41.2,
    likes: 14200,
    dislikes: 3870
  },

  {
    number: 5,
    title: 'Valid Parentheses',
    slug: 'valid-parentheses',
    difficulty: 'easy',
    category: 'Stack',
    tags: ['String', 'Stack'],
    companies: ['Amazon', 'Google', 'Facebook', 'Microsoft'],
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    constraints: [
      { description: '1 <= s.length <= 10⁴' },
      { description: 's consists of parentheses only \'()[]{}\'.' }
    ],
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' }
    ],
    testCases: [
      { input: { s: '()' }, expectedOutput: true, isHidden: false },
      { input: { s: '()[]{}' }, expectedOutput: true, isHidden: false },
      { input: { s: '(]' }, expectedOutput: false, isHidden: true }
    ],
    hints: [
      { order: 1, text: 'Use a stack to track opening brackets.' }
    ],
    starterCode: [
      { language: 'javascript', code: `function isValid(s) {\n    // Write your code here\n\n}`, functionName: 'isValid' }
    ],
    acceptanceRate: 40.5,
    likes: 19200,
    dislikes: 1180
  },

  {
    number: 6,
    title: 'Merge Two Sorted Lists',
    slug: 'merge-two-sorted-lists',
    difficulty: 'easy',
    category: 'Linked List',
    tags: ['Linked List', 'Recursion'],
    companies: ['Amazon', 'Microsoft', 'Apple'],
    description: `You are given the heads of two sorted linked lists \`list1\` and \`list2\`.

Merge the two lists into one **sorted** list. The list should be made by splicing together the nodes of the first two lists.

Return *the head of the merged linked list*.`,
    constraints: [
      { description: 'The number of nodes in both lists is in the range [0, 50].' },
      { description: '-100 <= Node.val <= 100' }
    ],
    examples: [
      { input: 'list1 = [1,2,4], list2 = [1,3,4]', output: '[1,1,2,3,4,4]' }
    ],
    testCases: [
      { input: { list1: [1, 2, 4], list2: [1, 3, 4] }, expectedOutput: [1, 1, 2, 3, 4, 4], isHidden: false }
    ],
    hints: [
      { order: 1, text: 'Use a dummy node to simplify merge logic.' }
    ],
    starterCode: [
      { language: 'javascript', code: `function mergeTwoLists(list1, list2) {\n    // Write your code here\n\n}`, functionName: 'mergeTwoLists' }
    ],
    acceptanceRate: 61.8,
    likes: 18500,
    dislikes: 1520
  },

  {
    number: 7,
    title: 'Remove Duplicates from Sorted Array',
    slug: 'remove-duplicates-from-sorted-array',
    difficulty: 'easy',
    category: 'Array',
    tags: ['Array', 'Two Pointers'],
    companies: ['Facebook', 'Microsoft', 'Amazon'],
    description: `Given an integer array \`nums\` sorted in **non-decreasing order**, remove the duplicates in-place such that each unique element appears only **once**. The **relative order** of the elements should be kept the **same**.

Return \`k\` after placing the final result in the first \`k\` slots of \`nums\`.`,
    constraints: [
      { description: '1 <= nums.length <= 3 * 10⁴' },
      { description: '-100 <= nums[i] <= 100' },
      { description: 'nums is sorted in non-decreasing order.' }
    ],
    examples: [
      { input: 'nums = [1,1,2]', output: '2, nums = [1,2,_]' },
      { input: 'nums = [0,0,1,1,1,2,2,3,3,4]', output: '5, nums = [0,1,2,3,4,_,_,_,_,_]' }
    ],
    testCases: [
      { input: { nums: [1, 1, 2] }, expectedOutput: 2, isHidden: false },
      { input: { nums: [0, 0, 1, 1, 1, 2, 2, 3, 3, 4] }, expectedOutput: 5, isHidden: false }
    ],
    hints: [
      { order: 1, text: 'Use two pointers: one for iterating and one for unique elements.' }
    ],
    starterCode: [
      { language: 'javascript', code: `function removeDuplicates(nums) {\n    // Write your code here\n\n}`, functionName: 'removeDuplicates' }
    ],
    acceptanceRate: 51.3,
    likes: 10800,
    dislikes: 14200
  },

  {
    number: 8,
    title: 'Search Insert Position',
    slug: 'search-insert-position',
    difficulty: 'easy',
    category: 'Binary Search',
    tags: ['Array', 'Binary Search'],
    companies: ['Amazon', 'LinkedIn'],
    description: `Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.

You must write an algorithm with \`O(log n)\` runtime complexity.`,
    constraints: [
      { description: '1 <= nums.length <= 10⁴' },
      { description: '-10⁴ <= nums[i] <= 10⁴' },
      { description: 'nums contains distinct values sorted in ascending order.' }
    ],
    examples: [
      { input: 'nums = [1,3,5,6], target = 5', output: '2' },
      { input: 'nums = [1,3,5,6], target = 2', output: '1' }
    ],
    testCases: [
      { input: { nums: [1, 3, 5, 6], target: 5 }, expectedOutput: 2, isHidden: false },
      { input: { nums: [1, 3, 5, 6], target: 2 }, expectedOutput: 1, isHidden: false }
    ],
    hints: [
      { order: 1, text: 'Use binary search to find the position.' }
    ],
    starterCode: [
      { language: 'javascript', code: `function searchInsert(nums, target) {\n    // Write your code here\n\n}`, functionName: 'searchInsert' }
    ],
    acceptanceRate: 43.7,
    likes: 13400,
    dislikes: 620
  },

  {
    number: 9,
    title: 'Maximum Subarray',
    slug: 'maximum-subarray',
    difficulty: 'easy',
    category: 'Dynamic Programming',
    tags: ['Array', 'Divide and Conquer', 'Dynamic Programming'],
    companies: ['Amazon', 'Microsoft', 'LinkedIn', 'Bloomberg'],
    description: `Given an integer array \`nums\`, find the contiguous subarray (containing at least one number) which has the largest sum and return its sum.

A **subarray** is a **contiguous** part of an array.`,
    constraints: [
      { description: '1 <= nums.length <= 10⁵' },
      { description: '-10⁴ <= nums[i] <= 10⁴' }
    ],
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: '[4,-1,2,1] has the largest sum = 6.' }
    ],
    testCases: [
      { input: { nums: [-2, 1, -3, 4, -1, 2, 1, -5, 4] }, expectedOutput: 6, isHidden: false },
      { input: { nums: [1] }, expectedOutput: 1, isHidden: false },
      { input: { nums: [5, 4, -1, 7, 8] }, expectedOutput: 23, isHidden: true }
    ],
    hints: [
      { order: 1, text: 'Use Kadane\'s algorithm: keep track of current sum and maximum sum.' }
    ],
    starterCode: [
      { language: 'javascript', code: `function maxSubArray(nums) {\n    // Write your code here\n\n}`, functionName: 'maxSubArray' }
    ],
    acceptanceRate: 50.1,
    likes: 27800,
    dislikes: 1250
  },

  {
    number: 10,
    title: 'Climbing Stairs',
    slug: 'climbing-stairs',
    difficulty: 'easy',
    category: 'Dynamic Programming',
    tags: ['Math', 'Dynamic Programming', 'Memoization'],
    companies: ['Amazon', 'Google', 'Adobe'],
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top.

Each time you can either climb \`1\` or \`2\` steps. In how many distinct ways can you climb to the top?`,
    constraints: [
      { description: '1 <= n <= 45' }
    ],
    examples: [
      { input: 'n = 2', output: '2', explanation: '1. 1 step + 1 step\n2. 2 steps' },
      { input: 'n = 3', output: '3', explanation: '1. 1 + 1 + 1\n2. 1 + 2\n3. 2 + 1' }
    ],
    testCases: [
      { input: { n: 2 }, expectedOutput: 2, isHidden: false },
      { input: { n: 3 }, expectedOutput: 3, isHidden: false },
      { input: { n: 5 }, expectedOutput: 8, isHidden: true }
    ],
    hints: [
      { order: 1, text: 'This is a Fibonacci sequence problem.' }
    ],
    starterCode: [
      { language: 'javascript', code: `function climbStairs(n) {\n    // Write your code here\n\n}`, functionName: 'climbStairs' }
    ],
    acceptanceRate: 51.8,
    likes: 18200,
    dislikes: 560
  },

  {
    number: 11,
    title: 'Best Time to Buy and Sell Stock',
    slug: 'best-time-to-buy-and-sell-stock',
    difficulty: 'easy',
    category: 'Array',
    tags: ['Array', 'Dynamic Programming'],
    companies: ['Amazon', 'Microsoft', 'Facebook', 'Bloomberg'],
    description: `You are given an array \`prices\` where \`prices[i]\` is the price of a given stock on the \`ith\` day.

You want to maximize your profit by choosing a **single day** to buy one stock and choosing a **different day in the future** to sell that stock.

Return *the maximum profit*. If you cannot achieve any profit, return \`0\`.`,
    constraints: [
      { description: '1 <= prices.length <= 10⁵' },
      { description: '0 <= prices[i] <= 10⁴' }
    ],
    examples: [
      { input: 'prices = [7,1,5,3,6,4]', output: '5', explanation: 'Buy on day 2 (1) and sell on day 5 (6), profit = 5.' }
    ],
    testCases: [
      { input: { prices: [7, 1, 5, 3, 6, 4] }, expectedOutput: 5, isHidden: false },
      { input: { prices: [7, 6, 4, 3, 1] }, expectedOutput: 0, isHidden: false }
    ],
    hints: [
      { order: 1, text: 'Track minimum price and maximum profit.' }
    ],
    starterCode: [
      { language: 'javascript', code: `function maxProfit(prices) {\n    // Write your code here\n\n}`, functionName: 'maxProfit' }
    ],
    acceptanceRate: 54.2,
    likes: 25300,
    dislikes: 820
  },

  {
    number: 12,
    title: 'Single Number',
    slug: 'single-number',
    difficulty: 'easy',
    category: 'Bit Manipulation',
    tags: ['Array', 'Bit Manipulation'],
    companies: ['Amazon', 'Google', 'Airbnb'],
    description: `Given a **non-empty** array of integers \`nums\`, every element appears *twice* except for one. Find that single one.

You must implement a solution with a linear runtime complexity and use only constant extra space.`,
    constraints: [
      { description: '1 <= nums.length <= 3 * 10⁴' },
      { description: '-3 * 10⁴ <= nums[i] <= 3 * 10⁴' },
      { description: 'Each element in the array appears twice except for one element which appears only once.' }
    ],
    examples: [
      { input: 'nums = [2,2,1]', output: '1' },
      { input: 'nums = [4,1,2,1,2]', output: '4' }
    ],
    testCases: [
      { input: { nums: [2, 2, 1] }, expectedOutput: 1, isHidden: false },
      { input: { nums: [4, 1, 2, 1, 2] }, expectedOutput: 4, isHidden: false }
    ],
    hints: [
      { order: 1, text: 'Use XOR operation: a ^ a = 0, a ^ 0 = a' }
    ],
    starterCode: [
      { language: 'javascript', code: `function singleNumber(nums) {\n    // Write your code here\n\n}`, functionName: 'singleNumber' }
    ],
    acceptanceRate: 70.3,
    likes: 13700,
    dislikes: 540
  },

  {
    number: 13,
    title: 'Reverse Linked List',
    slug: 'reverse-linked-list',
    difficulty: 'easy',
    category: 'Linked List',
    tags: ['Linked List', 'Recursion'],
    companies: ['Amazon', 'Microsoft', 'Facebook', 'Apple'],
    description: `Given the \`head\` of a singly linked list, reverse the list, and return *the reversed list*.`,
    constraints: [
      { description: 'The number of nodes in the list is the range [0, 5000].' },
      { description: '-5000 <= Node.val <= 5000' }
    ],
    examples: [
      { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' }
    ],
    testCases: [
      { input: { head: [1, 2, 3, 4, 5] }, expectedOutput: [5, 4, 3, 2, 1], isHidden: false },
      { input: { head: [1, 2] }, expectedOutput: [2, 1], isHidden: false }
    ],
    hints: [
      { order: 1, text: 'Use three pointers: prev, current, and next.' }
    ],
    starterCode: [
      { language: 'javascript', code: `function reverseList(head) {\n    // Write your code here\n\n}`, functionName: 'reverseList' }
    ],
    acceptanceRate: 72.5,
    likes: 18200,
    dislikes: 310
  },

  {
    number: 14,
    title: 'Contains Duplicate',
    slug: 'contains-duplicate',
    difficulty: 'easy',
    category: 'Array',
    tags: ['Array', 'Hash Table', 'Sorting'],
    companies: ['Amazon', 'Apple', 'Adobe'],
    description: `Given an integer array \`nums\`, return \`true\` if any value appears **at least twice** in the array, and return \`false\` if every element is distinct.`,
    constraints: [
      { description: '1 <= nums.length <= 10⁵' },
      { description: '-10⁹ <= nums[i] <= 10⁹' }
    ],
    examples: [
      { input: 'nums = [1,2,3,1]', output: 'true' },
      { input: 'nums = [1,2,3,4]', output: 'false' }
    ],
    testCases: [
      { input: { nums: [1, 2, 3, 1] }, expectedOutput: true, isHidden: false },
      { input: { nums: [1, 2, 3, 4] }, expectedOutput: false, isHidden: false }
    ],
    hints: [
      { order: 1, text: 'Use a hash set to track seen numbers.' }
    ],
    starterCode: [
      { language: 'javascript', code: `function containsDuplicate(nums) {\n    // Write your code here\n\n}`, functionName: 'containsDuplicate' }
    ],
    acceptanceRate: 60.9,
    likes: 9600,
    dislikes: 1050
  },

  {
    number: 15,
    title: 'Valid Anagram',
    slug: 'valid-anagram',
    difficulty: 'easy',
    category: 'String',
    tags: ['Hash Table', 'String', 'Sorting'],
    companies: ['Amazon', 'Bloomberg', 'Facebook'],
    description: `Given two strings \`s\` and \`t\`, return \`true\` if \`t\` is an anagram of \`s\`, and \`false\` otherwise.

An **Anagram** is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.`,
    constraints: [
      { description: '1 <= s.length, t.length <= 5 * 10⁴' },
      { description: 's and t consist of lowercase English letters.' }
    ],
    examples: [
      { input: 's = "anagram", t = "nagaram"', output: 'true' },
      { input: 's = "rat", t = "car"', output: 'false' }
    ],
    testCases: [
      { input: { s: 'anagram', t: 'nagaram' }, expectedOutput: true, isHidden: false },
      { input: { s: 'rat', t: 'car' }, expectedOutput: false, isHidden: false }
    ],
    hints: [
      { order: 1, text: 'Count character frequencies in both strings.' }
    ],
    starterCode: [
      { language: 'javascript', code: `function isAnagram(s, t) {\n    // Write your code here\n\n}`, functionName: 'isAnagram' }
    ],
    acceptanceRate: 63.2,
    likes: 10500,
    dislikes: 340
  },

  {
    number: 16,
    title: 'Missing Number',
    slug: 'missing-number',
    difficulty: 'easy',
    category: 'Math',
    tags: ['Array', 'Hash Table', 'Math', 'Binary Search', 'Bit Manipulation', 'Sorting'],
    companies: ['Amazon', 'Microsoft'],
    description: `Given an array \`nums\` containing \`n\` distinct numbers in the range \`[0, n]\`, return *the only number in the range that is missing from the array*.`,
    constraints: [
      { description: 'n == nums.length' },
      { description: '1 <= n <= 10⁴' },
      { description: '0 <= nums[i] <= n' },
      { description: 'All the numbers of nums are unique.' }
    ],
    examples: [
      { input: 'nums = [3,0,1]', output: '2' },
      { input: 'nums = [0,1]', output: '2' },
      { input: 'nums = [9,6,4,2,3,5,7,0,1]', output: '8' }
    ],
    testCases: [
      { input: { nums: [3, 0, 1] }, expectedOutput: 2, isHidden: false },
      { input: { nums: [0, 1] }, expectedOutput: 2, isHidden: false }
    ],
    hints: [
      { order: 1, text: 'Use the formula: sum of n numbers = n*(n+1)/2' }
    ],
    starterCode: [
      { language: 'javascript', code: `function missingNumber(nums) {\n    // Write your code here\n\n}`, functionName: 'missingNumber' }
    ],
    acceptanceRate: 61.8,
    likes: 10200,
    dislikes: 3140
  },

  {
    number: 17,
    title: 'Move Zeroes',
    slug: 'move-zeroes',
    difficulty: 'easy',
    category: 'Array',
    tags: ['Array', 'Two Pointers'],
    companies: ['Facebook', 'Bloomberg', 'Amazon'],
    description: `Given an integer array \`nums\`, move all \`0\`'s to the end of it while maintaining the relative order of the non-zero elements.

**Note** that you must do this in-place without making a copy of the array.`,
    constraints: [
      { description: '1 <= nums.length <= 10⁴' },
      { description: '-2³¹ <= nums[i] <= 2³¹ - 1' }
    ],
    examples: [
      { input: 'nums = [0,1,0,3,12]', output: '[1,3,12,0,0]' },
      { input: 'nums = [0]', output: '[0]' }
    ],
    testCases: [
      { input: { nums: [0, 1, 0, 3, 12] }, expectedOutput: [1, 3, 12, 0, 0], isHidden: false },
      { input: { nums: [0] }, expectedOutput: [0], isHidden: false }
    ],
    hints: [
      { order: 1, text: 'Use two pointers: one for iteration, one for non-zero position.' }
    ],
    starterCode: [
      { language: 'javascript', code: `function moveZeroes(nums) {\n    // Write your code here\n\n}`, functionName: 'moveZeroes' }
    ],
    acceptanceRate: 61.5,
    likes: 13800,
    dislikes: 360
  },

  {
    number: 18,
    title: 'Intersection of Two Arrays II',
    slug: 'intersection-of-two-arrays-ii',
    difficulty: 'easy',
    category: 'Array',
    tags: ['Array', 'Hash Table', 'Two Pointers', 'Binary Search', 'Sorting'],
    companies: ['Facebook', 'Amazon'],
    description: `Given two integer arrays \`nums1\` and \`nums2\`, return *an array of their intersection*. Each element in the result must appear as many times as it shows in both arrays and you may return the result in **any order**.`,
    constraints: [
      { description: '1 <= nums1.length, nums2.length <= 1000' },
      { description: '0 <= nums1[i], nums2[i] <= 1000' }
    ],
    examples: [
      { input: 'nums1 = [1,2,2,1], nums2 = [2,2]', output: '[2,2]' },
      { input: 'nums1 = [4,9,5], nums2 = [9,4,9,8,4]', output: '[4,9]' }
    ],
    testCases: [
      { input: { nums1: [1, 2, 2, 1], nums2: [2, 2] }, expectedOutput: [2, 2], isHidden: false },
      { input: { nums1: [4, 9, 5], nums2: [9, 4, 9, 8, 4] }, expectedOutput: [4, 9], isHidden: false }
    ],
    hints: [
      { order: 1, text: 'Use a hash map to count occurrences in one array.' }
    ],
    starterCode: [
      { language: 'javascript', code: `function intersect(nums1, nums2) {\n    // Write your code here\n\n}`, functionName: 'intersect' }
    ],
    acceptanceRate: 55.3,
    likes: 6800,
    dislikes: 910
  },

  {
    number: 19,
    title: 'Plus One',
    slug: 'plus-one',
    difficulty: 'easy',
    category: 'Array',
    tags: ['Array', 'Math'],
    companies: ['Google', 'Amazon'],
    description: `You are given a **large integer** represented as an integer array \`digits\`, where each \`digits[i]\` is the \`ith\` digit of the integer. The digits are ordered from most significant to least significant in left-to-right order. The large integer does not contain any leading \`0\`'s.

Increment the large integer by one and return *the resulting array of digits*.`,
    constraints: [
      { description: '1 <= digits.length <= 100' },
      { description: '0 <= digits[i] <= 9' },
      { description: 'digits does not contain any leading 0\'s.' }
    ],
    examples: [
      { input: 'digits = [1,2,3]', output: '[1,2,4]', explanation: 'The array represents 123. 123 + 1 = 124.' },
      { input: 'digits = [9]', output: '[1,0]', explanation: 'The array represents 9. 9 + 1 = 10.' }
    ],
    testCases: [
      { input: { digits: [1, 2, 3] }, expectedOutput: [1, 2, 4], isHidden: false },
      { input: { digits: [9] }, expectedOutput: [1, 0], isHidden: false }
    ],
    hints: [
      { order: 1, text: 'Handle carry from right to left.' }
    ],
    starterCode: [
      { language: 'javascript', code: `function plusOne(digits) {\n    // Write your code here\n\n}`, functionName: 'plusOne' }
    ],
    acceptanceRate: 43.8,
    likes: 6800,
    dislikes: 4900
  },

  {
    number: 20,
    title: 'Majority Element',
    slug: 'majority-element',
    difficulty: 'easy',
    category: 'Array',
    tags: ['Array', 'Hash Table', 'Divide and Conquer', 'Sorting', 'Counting'],
    companies: ['Amazon', 'Adobe', 'Zenefits'],
    description: `Given an array \`nums\` of size \`n\`, return *the majority element*.

The majority element is the element that appears more than \`⌊n / 2⌋\` times. You may assume that the majority element always exists in the array.`,
    constraints: [
      { description: 'n == nums.length' },
      { description: '1 <= n <= 5 * 10⁴' },
      { description: '-10⁹ <= nums[i] <= 10⁹' }
    ],
    examples: [
      { input: 'nums = [3,2,3]', output: '3' },
      { input: 'nums = [2,2,1,1,1,2,2]', output: '2' }
    ],
    testCases: [
      { input: { nums: [3, 2, 3] }, expectedOutput: 3, isHidden: false },
      { input: { nums: [2, 2, 1, 1, 1, 2, 2] }, expectedOutput: 2, isHidden: false }
    ],
    hints: [
      { order: 1, text: 'Use Boyer-Moore Voting Algorithm.' }
    ],
    starterCode: [
      { language: 'javascript', code: `function majorityElement(nums) {\n    // Write your code here\n\n}`, functionName: 'majorityElement' }
    ],
    acceptanceRate: 64.2,
    likes: 15800,
    dislikes: 480
  },

  // ==================== MEDIUM CHALLENGES (15 problems) ====================
  {
    number: 21,
    title: 'Add Two Numbers',
    slug: 'add-two-numbers',
    difficulty: 'medium',
    category: 'Linked List',
    tags: ['Linked List', 'Math', 'Recursion'],
    companies: ['Amazon', 'Microsoft', 'Adobe'],
    description: `You are given two **non-empty** linked lists representing two non-negative integers. The digits are stored in **reverse order**, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.`,
    constraints: [
      { description: 'The number of nodes in each linked list is in the range [1, 100].' },
      { description: '0 <= Node.val <= 9' }
    ],
    examples: [
      { input: 'l1 = [2,4,3], l2 = [5,6,4]', output: '[7,0,8]', explanation: '342 + 465 = 807.' }
    ],
    testCases: [
      { input: { l1: [2, 4, 3], l2: [5, 6, 4] }, expectedOutput: [7, 0, 8], isHidden: false }
    ],
    hints: [
      { order: 1, text: 'Remember to handle carry.' }
    ],
    starterCode: [
      { language: 'javascript', code: `function addTwoNumbers(l1, l2) {\n    // Write your code here\n\n}`, functionName: 'addTwoNumbers' }
    ],
    acceptanceRate: 40.2,
    likes: 25800,
    dislikes: 5100
  },

  {
    number: 22,
    title: 'Longest Substring Without Repeating Characters',
    slug: 'longest-substring-without-repeating-characters',
    difficulty: 'medium',
    category: 'String',
    tags: ['Hash Table', 'String', 'Sliding Window'],
    companies: ['Amazon', 'Adobe', 'Google', 'Bloomberg'],
    description: `Given a string \`s\`, find the length of the longest substring without repeating characters.`,
    constraints: [
      { description: '0 <= s.length <= 5 * 10⁴' },
      { description: 's consists of English letters, digits, symbols and spaces.' }
    ],
    examples: [
      { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with length 3.' }
    ],
    testCases: [
      { input: { s: 'abcabcbb' }, expectedOutput: 3, isHidden: false },
      { input: { s: 'bbbbb' }, expectedOutput: 1, isHidden: false }
    ],
    hints: [
      { order: 1, text: 'Use sliding window with hash set.' }
    ],
    starterCode: [
      { language: 'javascript', code: `function lengthOfLongestSubstring(s) {\n    // Write your code here\n\n}`, functionName: 'lengthOfLongestSubstring' }
    ],
    acceptanceRate: 33.5,
    likes: 32500,
    dislikes: 1420
  },

  {
    number: 23,
    title: 'Container With Most Water',
    slug: 'container-with-most-water',
    difficulty: 'medium',
    category: 'Array',
    tags: ['Array', 'Two Pointers', 'Greedy'],
    companies: ['Amazon', 'Facebook', 'Adobe', 'Bloomberg'],
    description: `You are given an integer array \`height\` of length \`n\`. There are \`n\` vertical lines drawn such that the two endpoints of the \`ith\` line are \`(i, 0)\` and \`(i, height[i])\`.

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return *the maximum amount of water a container can store*.`,
    constraints: [
      { description: 'n == height.length' },
      { description: '2 <= n <= 10⁵' },
      { description: '0 <= height[i] <= 10⁴' }
    ],
    examples: [
      { input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49', explanation: 'Max area between heights 8 and 7.' }
    ],
    testCases: [
      { input: { height: [1, 8, 6, 2, 5, 4, 8, 3, 7] }, expectedOutput: 49, isHidden: false },
      { input: { height: [1, 1] }, expectedOutput: 1, isHidden: false }
    ],
    hints: [
      { order: 1, text: 'Use two pointers from both ends.' }
    ],
    starterCode: [
      { language: 'javascript', code: `function maxArea(height) {\n    // Write your code here\n\n}`, functionName: 'maxArea' }
    ],
    acceptanceRate: 54.3,
    likes: 24500,
    dislikes: 1480
  },

  {
    number: 24,
    title: '3Sum',
    slug: '3sum',
    difficulty: 'medium',
    category: 'Array',
    tags: ['Array', 'Two Pointers', 'Sorting'],
    companies: ['Amazon', 'Facebook', 'Microsoft', 'Adobe'],
    description: `Given an integer array \`nums\`, return all the triplets \`[nums[i], nums[j], nums[k]]\` such that \`i != j\`, \`i != k\`, and \`j != k\`, and \`nums[i] + nums[j] + nums[k] == 0\`.

Notice that the solution set must not contain duplicate triplets.`,
    constraints: [
      { description: '3 <= nums.length <= 3000' },
      { description: '-10⁵ <= nums[i] <= 10⁵' }
    ],
    examples: [
      { input: 'nums = [-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]' }
    ],
    testCases: [
      { input: { nums: [-1, 0, 1, 2, -1, -4] }, expectedOutput: [[-1, -1, 2], [-1, 0, 1]], isHidden: false }
    ],
    hints: [
      { order: 1, text: 'Sort the array and use two pointers.' }
    ],
    starterCode: [
      { language: 'javascript', code: `function threeSum(nums) {\n    // Write your code here\n\n}`, functionName: 'threeSum' }
    ],
    acceptanceRate: 32.5,
    likes: 26800,
    dislikes: 2450
  },

  {
    number: 25,
    title: 'Letter Combinations of a Phone Number',
    slug: 'letter-combinations-of-a-phone-number',
    difficulty: 'medium',
    category: 'Backtracking',
    tags: ['Hash Table', 'String', 'Backtracking'],
    companies: ['Amazon', 'Google', 'Uber', 'Facebook'],
    description: `Given a string containing digits from \`2-9\` inclusive, return all possible letter combinations that the number could represent. Return the answer in **any order**.

A mapping of digits to letters (just like on the telephone buttons) is given below. Note that 1 does not map to any letters.`,
    constraints: [
      { description: '0 <= digits.length <= 4' },
      { description: 'digits[i] is a digit in the range [\'2\', \'9\'].' }
    ],
    examples: [
      { input: 'digits = "23"', output: '["ad","ae","af","bd","be","bf","cd","ce","cf"]' }
    ],
    testCases: [
      { input: { digits: '23' }, expectedOutput: ['ad', 'ae', 'af', 'bd', 'be', 'bf', 'cd', 'ce', 'cf'], isHidden: false }
    ],
    hints: [
      { order: 1, text: 'Use backtracking to generate all combinations.' }
    ],
    starterCode: [
      { language: 'javascript', code: `function letterCombinations(digits) {\n    // Write your code here\n\n}`, functionName: 'letterCombinations' }
    ],
    acceptanceRate: 56.8,
    likes: 16200,
    dislikes: 920
  },

  {
    number: 26,
    title: 'Generate Parentheses',
    slug: 'generate-parentheses',
    difficulty: 'medium',
    category: 'Backtracking',
    tags: ['String', 'Dynamic Programming', 'Backtracking'],
    companies: ['Amazon', 'Google', 'Microsoft', 'Facebook'],
    description: `Given \`n\` pairs of parentheses, write a function to *generate all combinations of well-formed parentheses*.`,
    constraints: [
      { description: '1 <= n <= 8' }
    ],
    examples: [
      { input: 'n = 3', output: '["((()))","(()())","(())()","()(())","()()()"]' },
      { input: 'n = 1', output: '["()"]' }
    ],
    testCases: [
      { input: { n: 3 }, expectedOutput: ['((()))', '(()())', '(())()', '()(())', '()()()'], isHidden: false }
    ],
    hints: [
      { order: 1, text: 'Use backtracking: track count of open and close parentheses.' }
    ],
    starterCode: [
      { language: 'javascript', code: `function generateParenthesis(n) {\n    // Write your code here\n\n}`, functionName: 'generateParenthesis' }
    ],
    acceptanceRate: 73.5,
    likes: 18700,
    dislikes: 740
  },

  {
    number: 27,
    title: 'Group Anagrams',
    slug: 'group-anagrams',
    difficulty: 'medium',
    category: 'Hash Table',
    tags: ['Array', 'Hash Table', 'String', 'Sorting'],
    companies: ['Amazon', 'Bloomberg', 'Facebook', 'Uber'],
    description: `Given an array of strings \`strs\`, group **the anagrams** together. You can return the answer in **any order**.

An **Anagram** is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.`,
    constraints: [
      { description: '1 <= strs.length <= 10⁴' },
      { description: '0 <= strs[i].length <= 100' },
      { description: 'strs[i] consists of lowercase English letters.' }
    ],
    examples: [
      { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]' }
    ],
    testCases: [
      { input: { strs: ['eat', 'tea', 'tan', 'ate', 'nat', 'bat'] }, expectedOutput: [['bat'], ['nat', 'tan'], ['ate', 'eat', 'tea']], isHidden: false }
    ],
    hints: [
      { order: 1, text: 'Sort each string and use it as a key in hash map.' }
    ],
    starterCode: [
      { language: 'javascript', code: `function groupAnagrams(strs) {\n    // Write your code here\n\n}`, functionName: 'groupAnagrams' }
    ],
    acceptanceRate: 66.8,
    likes: 16800,
    dislikes: 510
  },

  {
    number: 28,
    title: 'Permutations',
    slug: 'permutations',
    difficulty: 'medium',
    category: 'Backtracking',
    tags: ['Array', 'Backtracking'],
    companies: ['Amazon', 'LinkedIn', 'Microsoft'],
    description: `Given an array \`nums\` of distinct integers, return *all the possible permutations*. You can return the answer in **any order**.`,
    constraints: [
      { description: '1 <= nums.length <= 6' },
      { description: '-10 <= nums[i] <= 10' },
      { description: 'All the integers of nums are unique.' }
    ],
    examples: [
      { input: 'nums = [1,2,3]', output: '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]' }
    ],
    testCases: [
      { input: { nums: [1, 2, 3] }, expectedOutput: [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]], isHidden: false }
    ],
    hints: [
      { order: 1, text: 'Use backtracking with a visited array.' }
    ],
    starterCode: [
      { language: 'javascript', code: `function permute(nums) {\n    // Write your code here\n\n}`, functionName: 'permute' }
    ],
    acceptanceRate: 75.2,
    likes: 16300,
    dislikes: 270
  },

  {
    number: 29,
    title: 'Rotate Image',
    slug: 'rotate-image',
    difficulty: 'medium',
    category: 'Array',
    tags: ['Array', 'Math', 'Matrix'],
    companies: ['Amazon', 'Microsoft', 'Apple'],
    description: `You are given an \`n x n\` 2D \`matrix\` representing an image, rotate the image by **90 degrees (clockwise)**.

You have to rotate the image **in-place**, which means you have to modify the input 2D matrix directly. **DO NOT** allocate another 2D matrix and do the rotation.`,
    constraints: [
      { description: 'n == matrix.length == matrix[i].length' },
      { description: '1 <= n <= 20' },
      { description: '-1000 <= matrix[i][j] <= 1000' }
    ],
    examples: [
      { input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]', output: '[[7,4,1],[8,5,2],[9,6,3]]' }
    ],
    testCases: [
      { input: { matrix: [[1, 2, 3], [4, 5, 6], [7, 8, 9]] }, expectedOutput: [[7, 4, 1], [8, 5, 2], [9, 6, 3]], isHidden: false }
    ],
    hints: [
      { order: 1, text: 'Transpose the matrix, then reverse each row.' }
    ],
    starterCode: [
      { language: 'javascript', code: `function rotate(matrix) {\n    // Write your code here\n\n}`, functionName: 'rotate' }
    ],
    acceptanceRate: 70.5,
    likes: 15200,
    dislikes: 680
  },

  {
    number: 30,
    title: 'Jump Game',
    slug: 'jump-game',
    difficulty: 'medium',
    category: 'Greedy',
    tags: ['Array', 'Dynamic Programming', 'Greedy'],
    companies: ['Amazon', 'Microsoft', 'Google'],
    description: `You are given an integer array \`nums\`. You are initially positioned at the array's **first index**, and each element in the array represents your maximum jump length at that position.

Return \`true\` *if you can reach the last index*, or \`false\` otherwise.`,
    constraints: [
      { description: '1 <= nums.length <= 10⁴' },
      { description: '0 <= nums[i] <= 10⁵' }
    ],
    examples: [
      { input: 'nums = [2,3,1,1,4]', output: 'true', explanation: 'Jump 1 step from index 0 to 1, then 3 steps to the last index.' },
      { input: 'nums = [3,2,1,0,4]', output: 'false' }
    ],
    testCases: [
      { input: { nums: [2, 3, 1, 1, 4] }, expectedOutput: true, isHidden: false },
      { input: { nums: [3, 2, 1, 0, 4] }, expectedOutput: false, isHidden: false }
    ],
    hints: [
      { order: 1, text: 'Track the maximum reachable position.' }
    ],
    starterCode: [
      { language: 'javascript', code: `function canJump(nums) {\n    // Write your code here\n\n}`, functionName: 'canJump' }
    ],
    acceptanceRate: 38.5,
    likes: 17300,
    dislikes: 980
  },

  {
    number: 31,
    title: 'Unique Paths',
    slug: 'unique-paths',
    difficulty: 'medium',
    category: 'Dynamic Programming',
    tags: ['Math', 'Dynamic Programming', 'Combinatorics'],
    companies: ['Amazon', 'Google', 'Microsoft'],
    description: `There is a robot on an \`m x n\` grid. The robot is initially located at the **top-left corner** (i.e., \`grid[0][0]\`). The robot tries to move to the **bottom-right corner** (i.e., \`grid[m - 1][n - 1]\`). The robot can only move either down or right at any point in time.

Given the two integers \`m\` and \`n\`, return *the number of possible unique paths* that the robot can take to reach the bottom-right corner.`,
    constraints: [
      { description: '1 <= m, n <= 100' }
    ],
    examples: [
      { input: 'm = 3, n = 7', output: '28' },
      { input: 'm = 3, n = 2', output: '3' }
    ],
    testCases: [
      { input: { m: 3, n: 7 }, expectedOutput: 28, isHidden: false },
      { input: { m: 3, n: 2 }, expectedOutput: 3, isHidden: false }
    ],
    hints: [
      { order: 1, text: 'Use 2D DP array: dp[i][j] = dp[i-1][j] + dp[i][j-1]' }
    ],
    starterCode: [
      { language: 'javascript', code: `function uniquePaths(m, n) {\n    // Write your code here\n\n}`, functionName: 'uniquePaths' }
    ],
    acceptanceRate: 63.2,
    likes: 14800,
    dislikes: 410
  },

  {
    number: 32,
    title: 'Coin Change',
    slug: 'coin-change',
    difficulty: 'medium',
    category: 'Dynamic Programming',
    tags: ['Array', 'Dynamic Programming', 'Breadth-First Search'],
    companies: ['Amazon', 'Google', 'Facebook'],
    description: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.

Return *the fewest number of coins that you need to make up that amount*. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.

You may assume that you have an infinite number of each kind of coin.`,
    constraints: [
      { description: '1 <= coins.length <= 12' },
      { description: '1 <= coins[i] <= 2³¹ - 1' },
      { description: '0 <= amount <= 10⁴' }
    ],
    examples: [
      { input: 'coins = [1,2,5], amount = 11', output: '3', explanation: '11 = 5 + 5 + 1' },
      { input: 'coins = [2], amount = 3', output: '-1' }
    ],
    testCases: [
      { input: { coins: [1, 2, 5], amount: 11 }, expectedOutput: 3, isHidden: false },
      { input: { coins: [2], amount: 3 }, expectedOutput: -1, isHidden: false }
    ],
    hints: [
      { order: 1, text: 'Use DP: dp[i] = min coins to make amount i.' }
    ],
    starterCode: [
      { language: 'javascript', code: `function coinChange(coins, amount) {\n    // Write your code here\n\n}`, functionName: 'coinChange' }
    ],
    acceptanceRate: 42.3,
    likes: 18600,
    dislikes: 430
  },

  {
    number: 33,
    title: 'Longest Palindromic Substring',
    slug: 'longest-palindromic-substring',
    difficulty: 'medium',
    category: 'String',
    tags: ['String', 'Dynamic Programming'],
    companies: ['Amazon', 'Microsoft', 'Adobe'],
    description: `Given a string \`s\`, return *the longest palindromic substring* in \`s\`.`,
    constraints: [
      { description: '1 <= s.length <= 1000' },
      { description: 's consist of only digits and English letters.' }
    ],
    examples: [
      { input: 's = "babad"', output: '"bab"', explanation: '"aba" is also a valid answer.' },
      { input: 's = "cbbd"', output: '"bb"' }
    ],
    testCases: [
      { input: { s: 'babad' }, expectedOutput: 'bab', isHidden: false },
      { input: { s: 'cbbd' }, expectedOutput: 'bb', isHidden: false }
    ],
    hints: [
      { order: 1, text: 'Expand around center for each character.' }
    ],
    starterCode: [
      { language: 'javascript', code: `function longestPalindrome(s) {\n    // Write your code here\n\n}`, functionName: 'longestPalindrome' }
    ],
    acceptanceRate: 32.8,
    likes: 26500,
    dislikes: 1580
  },

  {
    number: 34,
    title: 'Product of Array Except Self',
    slug: 'product-of-array-except-self',
    difficulty: 'medium',
    category: 'Array',
    tags: ['Array', 'Prefix Sum'],
    companies: ['Amazon', 'Microsoft', 'Facebook', 'Apple'],
    description: `Given an integer array \`nums\`, return *an array \`answer\` such that \`answer[i]\` is equal to the product of all the elements of \`nums\` except \`nums[i]\`*.

The product of any prefix or suffix of \`nums\` is **guaranteed** to fit in a **32-bit** integer.

You must write an algorithm that runs in \`O(n)\` time and without using the division operation.`,
    constraints: [
      { description: '2 <= nums.length <= 10⁵' },
      { description: '-30 <= nums[i] <= 30' }
    ],
    examples: [
      { input: 'nums = [1,2,3,4]', output: '[24,12,8,6]' },
      { input: 'nums = [-1,1,0,-3,3]', output: '[0,0,9,0,0]' }
    ],
    testCases: [
      { input: { nums: [1, 2, 3, 4] }, expectedOutput: [24, 12, 8, 6], isHidden: false },
      { input: { nums: [-1, 1, 0, -3, 3] }, expectedOutput: [0, 0, 9, 0, 0], isHidden: false }
    ],
    hints: [
      { order: 1, text: 'Calculate left and right products separately.' }
    ],
    starterCode: [
      { language: 'javascript', code: `function productExceptSelf(nums) {\n    // Write your code here\n\n}`, functionName: 'productExceptSelf' }
    ],
    acceptanceRate: 65.8,
    likes: 19400,
    dislikes: 1120
  },

  {
    number: 35,
    title: 'Search in Rotated Sorted Array',
    slug: 'search-in-rotated-sorted-array',
    difficulty: 'medium',
    category: 'Binary Search',
    tags: ['Array', 'Binary Search'],
    companies: ['Amazon', 'LinkedIn', 'Microsoft', 'Facebook'],
    description: `There is an integer array \`nums\` sorted in ascending order (with **distinct** values).

Prior to being passed to your function, \`nums\` is **possibly rotated** at an unknown pivot index \`k\` (\`1 <= k < nums.length\`) such that the resulting array is \`[nums[k], nums[k+1], ..., nums[n-1], nums[0], nums[1], ..., nums[k-1]]\` (**0-indexed**).

Given the array \`nums\` **after** the possible rotation and an integer \`target\`, return *the index of \`target\` if it is in \`nums\`, or \`-1\` if it is not in \`nums\`*.

You must write an algorithm with \`O(log n)\` runtime complexity.`,
    constraints: [
      { description: '1 <= nums.length <= 5000' },
      { description: '-10⁴ <= nums[i] <= 10⁴' },
      { description: 'All values of nums are unique.' }
    ],
    examples: [
      { input: 'nums = [4,5,6,7,0,1,2], target = 0', output: '4' },
      { input: 'nums = [4,5,6,7,0,1,2], target = 3', output: '-1' }
    ],
    testCases: [
      { input: { nums: [4, 5, 6, 7, 0, 1, 2], target: 0 }, expectedOutput: 4, isHidden: false },
      { input: { nums: [4, 5, 6, 7, 0, 1, 2], target: 3 }, expectedOutput: -1, isHidden: false }
    ],
    hints: [
      { order: 1, text: 'Use binary search, determine which half is sorted.' }
    ],
    starterCode: [
      { language: 'javascript', code: `function search(nums, target) {\n    // Write your code here\n\n}`, functionName: 'search' }
    ],
    acceptanceRate: 39.2,
    likes: 23100,
    dislikes: 1320
  },

  // ==================== HARD CHALLENGES (5 problems) ====================
  {
    number: 36,
    title: 'Median of Two Sorted Arrays',
    slug: 'median-of-two-sorted-arrays',
    difficulty: 'hard',
    category: 'Binary Search',
    tags: ['Array', 'Binary Search', 'Divide and Conquer'],
    companies: ['Google', 'Amazon', 'Microsoft', 'Apple'],
    description: `Given two sorted arrays \`nums1\` and \`nums2\` of size \`m\` and \`n\` respectively, return **the median** of the two sorted arrays.

The overall run time complexity should be O(log (m+n)).`,
    constraints: [
      { description: 'nums1.length == m' },
      { description: 'nums2.length == n' },
      { description: '0 <= m <= 1000' },
      { description: '0 <= n <= 1000' },
      { description: '1 <= m + n <= 2000' }
    ],
    examples: [
      { input: 'nums1 = [1,3], nums2 = [2]', output: '2.00000', explanation: 'merged array = [1,2,3] and median is 2.' }
    ],
    testCases: [
      { input: { nums1: [1, 3], nums2: [2] }, expectedOutput: 2.0, isHidden: false },
      { input: { nums1: [1, 2], nums2: [3, 4] }, expectedOutput: 2.5, isHidden: false }
    ],
    hints: [
      { order: 1, text: 'Use binary search to partition arrays.' }
    ],
    starterCode: [
      { language: 'javascript', code: `function findMedianSortedArrays(nums1, nums2) {\n    // Write your code here\n\n}`, functionName: 'findMedianSortedArrays' }
    ],
    acceptanceRate: 36.3,
    likes: 22100,
    dislikes: 2450
  },

  {
    number: 37,
    title: 'Trapping Rain Water',
    slug: 'trapping-rain-water',
    difficulty: 'hard',
    category: 'Two Pointers',
    tags: ['Array', 'Two Pointers', 'Dynamic Programming', 'Stack', 'Monotonic Stack'],
    companies: ['Amazon', 'Google', 'Microsoft', 'Facebook'],
    description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is \`1\`, compute how much water it can trap after raining.`,
    constraints: [
      { description: 'n == height.length' },
      { description: '1 <= n <= 2 * 10⁴' },
      { description: '0 <= height[i] <= 10⁵' }
    ],
    examples: [
      { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6' }
    ],
    testCases: [
      { input: { height: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1] }, expectedOutput: 6, isHidden: false },
      { input: { height: [4, 2, 0, 3, 2, 5] }, expectedOutput: 9, isHidden: false }
    ],
    hints: [
      { order: 1, text: 'Use two pointers from both ends, track max heights.' }
    ],
    starterCode: [
      { language: 'javascript', code: `function trap(height) {\n    // Write your code here\n\n}`, functionName: 'trap' }
    ],
    acceptanceRate: 58.7,
    likes: 27800,
    dislikes: 390
  },

  {
    number: 38,
    title: 'Merge k Sorted Lists',
    slug: 'merge-k-sorted-lists',
    difficulty: 'hard',
    category: 'Linked List',
    tags: ['Linked List', 'Divide and Conquer', 'Heap (Priority Queue)', 'Merge Sort'],
    companies: ['Amazon', 'Microsoft', 'Facebook', 'Google'],
    description: `You are given an array of \`k\` linked-lists \`lists\`, each linked-list is sorted in ascending order.

*Merge all the linked-lists into one sorted linked-list and return it*.`,
    constraints: [
      { description: 'k == lists.length' },
      { description: '0 <= k <= 10⁴' },
      { description: '0 <= lists[i].length <= 500' }
    ],
    examples: [
      { input: 'lists = [[1,4,5],[1,3,4],[2,6]]', output: '[1,1,2,3,4,4,5,6]' }
    ],
    testCases: [
      { input: { lists: [[1, 4, 5], [1, 3, 4], [2, 6]] }, expectedOutput: [1, 1, 2, 3, 4, 4, 5, 6], isHidden: false }
    ],
    hints: [
      { order: 1, text: 'Use a min heap or merge lists pair by pair.' }
    ],
    starterCode: [
      { language: 'javascript', code: `function mergeKLists(lists) {\n    // Write your code here\n\n}`, functionName: 'mergeKLists' }
    ],
    acceptanceRate: 49.8,
    likes: 17300,
    dislikes: 610
  },

  {
    number: 39,
    title: 'Regular Expression Matching',
    slug: 'regular-expression-matching',
    difficulty: 'hard',
    category: 'Dynamic Programming',
    tags: ['String', 'Dynamic Programming', 'Recursion'],
    companies: ['Amazon', 'Google', 'Facebook'],
    description: `Given an input string \`s\` and a pattern \`p\`, implement regular expression matching with support for \`'.'\` and \`'*'\` where:

- \`'.'\` Matches any single character.
- \`'*'\` Matches zero or more of the preceding element.

The matching should cover the **entire** input string (not partial).`,
    constraints: [
      { description: '1 <= s.length <= 20' },
      { description: '1 <= p.length <= 20' },
      { description: 's contains only lowercase English letters.' }
    ],
    examples: [
      { input: 's = "aa", p = "a"', output: 'false' },
      { input: 's = "aa", p = "a*"', output: 'true' },
      { input: 's = "ab", p = ".*"', output: 'true' }
    ],
    testCases: [
      { input: { s: 'aa', p: 'a' }, expectedOutput: false, isHidden: false },
      { input: { s: 'aa', p: 'a*' }, expectedOutput: true, isHidden: false }
    ],
    hints: [
      { order: 1, text: 'Use 2D DP: dp[i][j] = match for s[0..i] and p[0..j]' }
    ],
    starterCode: [
      { language: 'javascript', code: `function isMatch(s, p) {\n    // Write your code here\n\n}`, functionName: 'isMatch' }
    ],
    acceptanceRate: 28.5,
    likes: 11200,
    dislikes: 1870
  },

  {
    number: 40,
    title: 'Longest Valid Parentheses',
    slug: 'longest-valid-parentheses',
    difficulty: 'hard',
    category: 'Stack',
    tags: ['String', 'Dynamic Programming', 'Stack'],
    companies: ['Amazon', 'Google', 'Microsoft'],
    description: `Given a string containing just the characters \`'('\` and \`')'\`, return *the length of the longest valid (well-formed) parentheses substring*.`,
    constraints: [
      { description: '0 <= s.length <= 3 * 10⁴' },
      { description: 's[i] is \'(\', or \')\'.' }
    ],
    examples: [
      { input: 's = "(()"', output: '2', explanation: 'The longest valid parentheses substring is "()".'},
      { input: 's = ")()())"', output: '4', explanation: 'The longest valid parentheses substring is "()()".'}
    ],
    testCases: [
      { input: { s: '(()' }, expectedOutput: 2, isHidden: false },
      { input: { s: ')()())' }, expectedOutput: 4, isHidden: false }
    ],
    hints: [
      { order: 1, text: 'Use a stack to track indices of parentheses.' }
    ],
    starterCode: [
      { language: 'javascript', code: `function longestValidParentheses(s) {\n    // Write your code here\n\n}`, functionName: 'longestValidParentheses' }
    ],
    acceptanceRate: 32.1,
    likes: 11600,
    dislikes: 360
  }
];

// Seed function
const seedChallenges = async () => {
  try {
    console.log('🚀 Starting expanded challenge seeding...');
    console.log(`📝 Preparing to seed ${challenges.length} coding challenges`);

    // Clear existing challenges
    await CodingChallenge.deleteMany({});
    console.log('🧹 Cleared existing challenges');

    // Insert challenges
    await CodingChallenge.insertMany(challenges);
    console.log(`✅ Successfully seeded ${challenges.length} challenges`);

    // Print stats
    const stats = await CodingChallenge.aggregate([
      {
        $group: {
          _id: '$difficulty',
          count: { $sum: 1 }
        }
      }
    ]);

    console.log('\n📊 Challenges by Difficulty:');
    stats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} challenges`);
    });

    const categoryStats = await CodingChallenge.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    console.log('\n📚 Challenges by Category:');
    categoryStats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} challenges`);
    });

    console.log('\n🎉 Challenge seeding completed successfully!');
    console.log('🔗 Users can now practice 40 LeetCode-style problems on your platform!');
    console.log('\n📈 Difficulty Breakdown:');
    console.log('   - Easy: 20 problems (perfect for beginners)');
    console.log('   - Medium: 15 problems (intermediate practice)');
    console.log('   - Hard: 5 problems (advanced challenges)');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding challenges:', error);
    process.exit(1);
  }
};

// Run seeding
seedChallenges();
