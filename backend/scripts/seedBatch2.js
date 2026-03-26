require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const CodingChallenge = require('../models/CodingChallenge');
const mongoURI = process.env.MONGODB_URI || 'mongodb://mongo:27017/seek';

const challenges = [
  // MEDIUM 126-139
  {
    number: 126, title: 'Binary Search', slug: 'binary-search', difficulty: 'medium',
    category: 'Binary Search', tags: ['Array', 'Binary Search'], companies: ['Amazon', 'Google', 'Microsoft'],
    description: 'Given a sorted array of integers `nums` and a target value, return the index if found. Otherwise return `-1`.\n\nYou must write an algorithm with `O(log n)` runtime.',
    constraints: [{ description: '1 <= nums.length <= 10⁴' }, { description: 'nums is sorted in ascending order with distinct values.' }, { description: '-10⁴ <= target <= 10⁴' }],
    examples: [
      { input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4' },
      { input: 'nums = [-1,0,3,5,9,12], target = 2', output: '-1' }
    ],
    testCases: [
      { input: { nums: [-1,0,3,5,9,12], target: 9 }, expectedOutput: 4, isHidden: false },
      { input: { nums: [-1,0,3,5,9,12], target: 2 }, expectedOutput: -1, isHidden: false },
      { input: { nums: [5], target: 5 }, expectedOutput: 0, isHidden: false },
      { input: { nums: [1,3,5,7,9], target: 7 }, expectedOutput: 3, isHidden: true },
      { input: { nums: [2,4,6,8], target: 5 }, expectedOutput: -1, isHidden: true }
    ],
    hints: [{ order: 1, text: 'Keep left and right pointers. If nums[mid] < target move left up, else move right down.' }],
    starterCode: [
      { language: 'javascript', code: 'function search(nums, target) {\n    // Write your code here\n}', functionName: 'search' },
      { language: 'python', code: 'def search(nums, target):\n    # Write your code here\n    pass', functionName: 'search' }
    ],
    acceptanceRate: 55
  },
  {
    number: 127, title: 'Maximum Product Subarray', slug: 'max-product-subarray', difficulty: 'medium',
    category: 'Dynamic Programming', tags: ['Array', 'Dynamic Programming'], companies: ['Amazon', 'LinkedIn', 'Google'],
    description: 'Given an integer array `nums`, find a subarray that has the largest product, and return the product.',
    constraints: [{ description: '1 <= nums.length <= 2 * 10⁴' }, { description: '-10 <= nums[i] <= 10' }, { description: 'The product fits in a 32-bit integer.' }],
    examples: [
      { input: 'nums = [2,3,-2,4]', output: '6', explanation: '[2,3] has the largest product 6.' },
      { input: 'nums = [-2,0,-1]', output: '0' }
    ],
    testCases: [
      { input: { nums: [2,3,-2,4] }, expectedOutput: 6, isHidden: false },
      { input: { nums: [-2,0,-1] }, expectedOutput: 0, isHidden: false },
      { input: { nums: [-2] }, expectedOutput: -2, isHidden: false },
      { input: { nums: [2,-5,-2,-4,3] }, expectedOutput: 24, isHidden: true },
      { input: { nums: [-3,0,1,-2] }, expectedOutput: 1, isHidden: true }
    ],
    hints: [
      { order: 1, text: 'Track both max and min product at each position.' },
      { order: 2, text: 'A negative number can flip max and min.' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function maxProduct(nums) {\n    // Write your code here\n}', functionName: 'maxProduct' },
      { language: 'python', code: 'def max_product(nums):\n    # Write your code here\n    pass', functionName: 'max_product' }
    ],
    acceptanceRate: 35
  },
  {
    number: 128, title: 'Find Minimum in Rotated Sorted Array', slug: 'find-min-rotated', difficulty: 'medium',
    category: 'Binary Search', tags: ['Array', 'Binary Search'], companies: ['Microsoft', 'Amazon', 'Facebook'],
    description: 'Given a sorted and rotated array `nums` of unique elements, return the minimum element.\n\nYou must write an algorithm that runs in `O(log n)` time.',
    constraints: [{ description: '1 <= nums.length <= 5000' }, { description: '-5000 <= nums[i] <= 5000' }, { description: 'All integers are unique.' }],
    examples: [
      { input: 'nums = [3,4,5,1,2]', output: '1' },
      { input: 'nums = [4,5,6,7,0,1,2]', output: '0' },
      { input: 'nums = [11,13,15,17]', output: '11' }
    ],
    testCases: [
      { input: { nums: [3,4,5,1,2] }, expectedOutput: 1, isHidden: false },
      { input: { nums: [4,5,6,7,0,1,2] }, expectedOutput: 0, isHidden: false },
      { input: { nums: [11,13,15,17] }, expectedOutput: 11, isHidden: false },
      { input: { nums: [2,1] }, expectedOutput: 1, isHidden: true },
      { input: { nums: [5,1,2,3,4] }, expectedOutput: 1, isHidden: true }
    ],
    hints: [{ order: 1, text: 'If nums[mid] > nums[right], the minimum is in the right half.' }],
    starterCode: [
      { language: 'javascript', code: 'function findMin(nums) {\n    // Write your code here\n}', functionName: 'findMin' },
      { language: 'python', code: 'def find_min(nums):\n    # Write your code here\n    pass', functionName: 'find_min' }
    ],
    acceptanceRate: 49
  },
  {
    number: 129, title: 'Kth Largest Element in Array', slug: 'kth-largest-element', difficulty: 'medium',
    category: 'Array', tags: ['Array', 'Divide and Conquer', 'Sorting', 'Heap'], companies: ['Facebook', 'Amazon', 'Microsoft', 'Apple'],
    description: 'Given an integer array `nums` and an integer `k`, return the `k`th largest element in the array (not the kth distinct element).',
    constraints: [{ description: '1 <= k <= nums.length <= 10⁵' }, { description: '-10⁴ <= nums[i] <= 10⁴' }],
    examples: [
      { input: 'nums = [3,2,1,5,6,4], k = 2', output: '5' },
      { input: 'nums = [3,2,3,1,2,4,5,5,6], k = 4', output: '4' }
    ],
    testCases: [
      { input: { nums: [3,2,1,5,6,4], k: 2 }, expectedOutput: 5, isHidden: false },
      { input: { nums: [3,2,3,1,2,4,5,5,6], k: 4 }, expectedOutput: 4, isHidden: false },
      { input: { nums: [1], k: 1 }, expectedOutput: 1, isHidden: false },
      { input: { nums: [7,6,5,4,3,2,1], k: 5 }, expectedOutput: 3, isHidden: true },
      { input: { nums: [1,2,3,4,5], k: 1 }, expectedOutput: 5, isHidden: true }
    ],
    hints: [{ order: 1, text: 'Sort descending and return index k-1. Or use a min-heap of size k.' }],
    starterCode: [
      { language: 'javascript', code: 'function findKthLargest(nums, k) {\n    // Write your code here\n}', functionName: 'findKthLargest' },
      { language: 'python', code: 'def find_kth_largest(nums, k):\n    # Write your code here\n    pass', functionName: 'find_kth_largest' }
    ],
    acceptanceRate: 65
  },
  {
    number: 130, title: 'Search in Rotated Sorted Array', slug: 'search-rotated-array', difficulty: 'medium',
    category: 'Binary Search', tags: ['Array', 'Binary Search'], companies: ['Amazon', 'Microsoft', 'Facebook', 'Bloomberg'],
    description: 'Given a rotated sorted array `nums` and an integer `target`, return the index if found, or `-1` if not.',
    constraints: [{ description: '1 <= nums.length <= 5000' }, { description: 'All values are unique.' }, { description: '-10⁴ <= nums[i], target <= 10⁴' }],
    examples: [
      { input: 'nums = [4,5,6,7,0,1,2], target = 0', output: '4' },
      { input: 'nums = [4,5,6,7,0,1,2], target = 3', output: '-1' },
      { input: 'nums = [1], target = 0', output: '-1' }
    ],
    testCases: [
      { input: { nums: [4,5,6,7,0,1,2], target: 0 }, expectedOutput: 4, isHidden: false },
      { input: { nums: [4,5,6,7,0,1,2], target: 3 }, expectedOutput: -1, isHidden: false },
      { input: { nums: [1], target: 0 }, expectedOutput: -1, isHidden: false },
      { input: { nums: [3,1], target: 1 }, expectedOutput: 1, isHidden: true },
      { input: { nums: [5,1,2,3,4], target: 5 }, expectedOutput: 0, isHidden: true }
    ],
    hints: [{ order: 1, text: 'Determine which half is sorted. Check if target is in that half, then binary search accordingly.' }],
    starterCode: [
      { language: 'javascript', code: 'function search(nums, target) {\n    // Write your code here\n}', functionName: 'search' },
      { language: 'python', code: 'def search(nums, target):\n    # Write your code here\n    pass', functionName: 'search' }
    ],
    acceptanceRate: 39
  },
  {
    number: 131, title: 'Combination Sum', slug: 'combination-sum', difficulty: 'medium',
    category: 'Backtracking', tags: ['Array', 'Backtracking'], companies: ['Amazon', 'Google', 'Airbnb'],
    description: 'Given an array of distinct integers `candidates` and a target integer `target`, return all unique combinations where the chosen numbers sum to `target`. The same number may be chosen unlimited times.',
    constraints: [{ description: '1 <= candidates.length <= 30' }, { description: '2 <= candidates[i] <= 40' }, { description: '1 <= target <= 40' }],
    examples: [
      { input: 'candidates = [2,3,6,7], target = 7', output: '[[2,2,3],[7]]' },
      { input: 'candidates = [2,3,5], target = 8', output: '[[2,2,2,2],[2,3,3],[3,5]]' }
    ],
    testCases: [
      { input: { candidates: [2,3,6,7], target: 7 }, expectedOutput: [[2,2,3],[7]], isHidden: false },
      { input: { candidates: [2,3,5], target: 8 }, expectedOutput: [[2,2,2,2],[2,3,3],[3,5]], isHidden: false },
      { input: { candidates: [2], target: 1 }, expectedOutput: [], isHidden: false },
      { input: { candidates: [3,5], target: 9 }, expectedOutput: [[3,3,3]], isHidden: true }
    ],
    hints: [{ order: 1, text: 'Use backtracking. At each step either include the current candidate or move to the next.' }],
    starterCode: [
      { language: 'javascript', code: 'function combinationSum(candidates, target) {\n    // Write your code here\n}', functionName: 'combinationSum' },
      { language: 'python', code: 'def combination_sum(candidates, target):\n    # Write your code here\n    pass', functionName: 'combination_sum' }
    ],
    acceptanceRate: 69
  },
  {
    number: 132, title: 'Rotate Image', slug: 'rotate-image', difficulty: 'medium',
    category: 'Array', tags: ['Array', 'Math', 'Matrix'], companies: ['Amazon', 'Microsoft', 'Apple'],
    description: 'Given an `n x n` 2D matrix, rotate it 90 degrees clockwise in-place. Return the rotated matrix.',
    constraints: [{ description: 'n == matrix.length == matrix[i].length' }, { description: '1 <= n <= 20' }, { description: '-1000 <= matrix[i][j] <= 1000' }],
    examples: [
      { input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]', output: '[[7,4,1],[8,5,2],[9,6,3]]' },
      { input: 'matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]', output: '[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]' }
    ],
    testCases: [
      { input: { matrix: [[1,2,3],[4,5,6],[7,8,9]] }, expectedOutput: [[7,4,1],[8,5,2],[9,6,3]], isHidden: false },
      { input: { matrix: [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]] }, expectedOutput: [[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]], isHidden: false },
      { input: { matrix: [[1]] }, expectedOutput: [[1]], isHidden: false },
      { input: { matrix: [[1,2],[3,4]] }, expectedOutput: [[3,1],[4,2]], isHidden: true }
    ],
    hints: [{ order: 1, text: 'Transpose the matrix (swap matrix[i][j] with matrix[j][i]), then reverse each row.' }],
    starterCode: [
      { language: 'javascript', code: 'function rotate(matrix) {\n    // Write your code here\n    return matrix;\n}', functionName: 'rotate' },
      { language: 'python', code: 'def rotate(matrix):\n    # Write your code here\n    return matrix', functionName: 'rotate' }
    ],
    acceptanceRate: 73
  },
  {
    number: 133, title: 'Max Consecutive Ones III', slug: 'max-consecutive-ones-iii', difficulty: 'medium',
    category: 'Sliding Window', tags: ['Array', 'Binary Search', 'Sliding Window', 'Prefix Sum'], companies: ['Google', 'Amazon'],
    description: 'Given a binary array `nums` and an integer `k`, return the maximum number of consecutive `1`s if you can flip at most `k` `0`s.',
    constraints: [{ description: '1 <= nums.length <= 10⁵' }, { description: 'nums[i] is either 0 or 1.' }, { description: '0 <= k <= nums.length' }],
    examples: [
      { input: 'nums = [1,1,1,0,0,0,1,1,1,1,0], k = 2', output: '6' },
      { input: 'nums = [0,0,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,1], k = 3', output: '10' }
    ],
    testCases: [
      { input: { nums: [1,1,1,0,0,0,1,1,1,1,0], k: 2 }, expectedOutput: 6, isHidden: false },
      { input: { nums: [0,0,1,1,0,0,1,1,1,0,1,1,0,0,0,1,1,1,1], k: 3 }, expectedOutput: 10, isHidden: false },
      { input: { nums: [1,1,1], k: 0 }, expectedOutput: 3, isHidden: false },
      { input: { nums: [0,0,0], k: 1 }, expectedOutput: 1, isHidden: true },
      { input: { nums: [1,0,1,0,1], k: 1 }, expectedOutput: 3, isHidden: true }
    ],
    hints: [{ order: 1, text: 'Sliding window: expand right, contract left when zeros in window exceed k.' }],
    starterCode: [
      { language: 'javascript', code: 'function longestOnes(nums, k) {\n    // Write your code here\n}', functionName: 'longestOnes' },
      { language: 'python', code: 'def longest_ones(nums, k):\n    # Write your code here\n    pass', functionName: 'longest_ones' }
    ],
    acceptanceRate: 64
  },
  {
    number: 134, title: 'Sort Colors', slug: 'sort-colors', difficulty: 'medium',
    category: 'Array', tags: ['Array', 'Two Pointers', 'Sorting'], companies: ['Microsoft', 'Facebook', 'Amazon'],
    description: 'Given an array `nums` with values `0` (red), `1` (white), and `2` (blue), sort it in-place so colors are grouped together. Return the sorted array.\n\nYou must solve it without using the library sort function.',
    constraints: [{ description: 'n == nums.length' }, { description: '1 <= n <= 300' }, { description: 'nums[i] is 0, 1, or 2.' }],
    examples: [
      { input: 'nums = [2,0,2,1,1,0]', output: '[0,0,1,1,2,2]' },
      { input: 'nums = [2,0,1]', output: '[0,1,2]' }
    ],
    testCases: [
      { input: { nums: [2,0,2,1,1,0] }, expectedOutput: [0,0,1,1,2,2], isHidden: false },
      { input: { nums: [2,0,1] }, expectedOutput: [0,1,2], isHidden: false },
      { input: { nums: [0] }, expectedOutput: [0], isHidden: false },
      { input: { nums: [1,2,0] }, expectedOutput: [0,1,2], isHidden: true },
      { input: { nums: [2,2,1,1,0,0] }, expectedOutput: [0,0,1,1,2,2], isHidden: true }
    ],
    hints: [{ order: 1, text: 'Dutch National Flag: use three pointers — low, mid, high.' }],
    starterCode: [
      { language: 'javascript', code: 'function sortColors(nums) {\n    // Write your code here\n    return nums;\n}', functionName: 'sortColors' },
      { language: 'python', code: 'def sort_colors(nums):\n    # Write your code here\n    return nums', functionName: 'sort_colors' }
    ],
    acceptanceRate: 61
  },
  {
    number: 135, title: 'Container With Most Water', slug: 'container-most-water', difficulty: 'medium',
    category: 'Two Pointers', tags: ['Array', 'Two Pointers', 'Greedy'], companies: ['Amazon', 'Google', 'Bloomberg', 'Adobe'],
    description: 'Given an integer array `height` of `n` values, find two lines that together with the x-axis form a container with the most water. Return the maximum amount of water a container can store.',
    constraints: [{ description: 'n == height.length' }, { description: '2 <= n <= 10⁵' }, { description: '0 <= height[i] <= 10⁴' }],
    examples: [
      { input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49' },
      { input: 'height = [1,1]', output: '1' }
    ],
    testCases: [
      { input: { height: [1,8,6,2,5,4,8,3,7] }, expectedOutput: 49, isHidden: false },
      { input: { height: [1,1] }, expectedOutput: 1, isHidden: false },
      { input: { height: [4,3,2,1,4] }, expectedOutput: 16, isHidden: false },
      { input: { height: [1,2,1] }, expectedOutput: 2, isHidden: true },
      { input: { height: [2,3,4,5,18,17,6] }, expectedOutput: 17, isHidden: true }
    ],
    hints: [{ order: 1, text: 'Use two pointers. Always move the pointer with the shorter height inward.' }],
    starterCode: [
      { language: 'javascript', code: 'function maxArea(height) {\n    // Write your code here\n}', functionName: 'maxArea' },
      { language: 'python', code: 'def max_area(height):\n    # Write your code here\n    pass', functionName: 'max_area' }
    ],
    acceptanceRate: 54
  },
  {
    number: 136, title: 'Gas Station', slug: 'gas-station', difficulty: 'medium',
    category: 'Greedy', tags: ['Array', 'Greedy'], companies: ['Amazon', 'Google', 'Bloomberg'],
    description: 'There are `n` gas stations in a circuit. Given `gas[i]` and `cost[i]` arrays, return the starting station index to complete the circuit once. If impossible, return `-1`.',
    constraints: [{ description: 'n == gas.length == cost.length' }, { description: '1 <= n <= 10⁵' }, { description: '0 <= gas[i], cost[i] <= 10⁴' }],
    examples: [
      { input: 'gas = [1,2,3,4,5], cost = [3,4,5,1,2]', output: '3' },
      { input: 'gas = [2,3,4], cost = [3,4,3]', output: '-1' }
    ],
    testCases: [
      { input: { gas: [1,2,3,4,5], cost: [3,4,5,1,2] }, expectedOutput: 3, isHidden: false },
      { input: { gas: [2,3,4], cost: [3,4,3] }, expectedOutput: -1, isHidden: false },
      { input: { gas: [5,1,2,3,4], cost: [4,4,1,5,1] }, expectedOutput: 4, isHidden: false },
      { input: { gas: [3,1,1], cost: [1,2,2] }, expectedOutput: 0, isHidden: true },
      { input: { gas: [1,2], cost: [2,1] }, expectedOutput: 1, isHidden: true }
    ],
    hints: [
      { order: 1, text: 'If total gas >= total cost, a solution exists.' },
      { order: 2, text: 'When tank goes negative, reset start to next station.' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function canCompleteCircuit(gas, cost) {\n    // Write your code here\n}', functionName: 'canCompleteCircuit' },
      { language: 'python', code: 'def can_complete_circuit(gas, cost):\n    # Write your code here\n    pass', functionName: 'can_complete_circuit' }
    ],
    acceptanceRate: 45
  },
  {
    number: 137, title: 'Letter Combinations of Phone Number', slug: 'letter-combinations-phone', difficulty: 'medium',
    category: 'Backtracking', tags: ['Hash Table', 'String', 'Backtracking'], companies: ['Amazon', 'Facebook', 'Google', 'Uber'],
    description: 'Given a string `digits` containing digits from 2-9, return all possible letter combinations they could represent (like a phone keypad). Return in any order.',
    constraints: [{ description: '0 <= digits.length <= 4' }, { description: 'digits[i] is a digit in [2,9].' }],
    examples: [
      { input: 'digits = "23"', output: '["ad","ae","af","bd","be","bf","cd","ce","cf"]' },
      { input: 'digits = ""', output: '[]' },
      { input: 'digits = "2"', output: '["a","b","c"]' }
    ],
    testCases: [
      { input: { digits: '23' }, expectedOutput: ['ad','ae','af','bd','be','bf','cd','ce','cf'], isHidden: false },
      { input: { digits: '' }, expectedOutput: [], isHidden: false },
      { input: { digits: '2' }, expectedOutput: ['a','b','c'], isHidden: false },
      { input: { digits: '7' }, expectedOutput: ['p','q','r','s'], isHidden: true }
    ],
    hints: [{ order: 1, text: 'Use a map of digit → letters. Backtrack building the combination character by character.' }],
    starterCode: [
      { language: 'javascript', code: 'function letterCombinations(digits) {\n    // Write your code here\n}', functionName: 'letterCombinations' },
      { language: 'python', code: 'def letter_combinations(digits):\n    # Write your code here\n    pass', functionName: 'letter_combinations' }
    ],
    acceptanceRate: 56
  },
  {
    number: 138, title: 'Decode String', slug: 'decode-string', difficulty: 'medium',
    category: 'Stack', tags: ['String', 'Stack', 'Recursion'], companies: ['Google', 'Amazon', 'Bloomberg'],
    description: 'Given an encoded string, return its decoded string.\n\nThe format is `k[encoded_string]` where the string inside brackets is repeated `k` times.',
    constraints: [{ description: '1 <= s.length <= 30' }, { description: 's consists of lowercase letters, digits, and square brackets.' }, { description: 'k is guaranteed to be a positive integer.' }],
    examples: [
      { input: 's = "3[a]2[bc]"', output: '"aaabcbc"' },
      { input: 's = "3[a2[c]]"', output: '"accaccacc"' },
      { input: 's = "2[abc]3[cd]ef"', output: '"abcabccdcdcdef"' }
    ],
    testCases: [
      { input: { s: '3[a]2[bc]' }, expectedOutput: 'aaabcbc', isHidden: false },
      { input: { s: '3[a2[c]]' }, expectedOutput: 'accaccacc', isHidden: false },
      { input: { s: '2[abc]3[cd]ef' }, expectedOutput: 'abcabccdcdcdef', isHidden: false },
      { input: { s: '10[a]' }, expectedOutput: 'aaaaaaaaaa', isHidden: true },
      { input: { s: '2[2[b]]' }, expectedOutput: 'bbbb', isHidden: true }
    ],
    hints: [{ order: 1, text: 'Use a stack. Push current string and count when you see `[`, pop and expand when you see `]`.' }],
    starterCode: [
      { language: 'javascript', code: 'function decodeString(s) {\n    // Write your code here\n}', functionName: 'decodeString' },
      { language: 'python', code: 'def decode_string(s):\n    # Write your code here\n    pass', functionName: 'decode_string' }
    ],
    acceptanceRate: 57
  },
  {
    number: 139, title: 'Number of Islands', slug: 'number-of-islands', difficulty: 'medium',
    category: 'Graph', tags: ['Array', 'DFS', 'BFS', 'Union Find', 'Matrix'], companies: ['Amazon', 'Google', 'Facebook', 'Microsoft'],
    description: 'Given an `m x n` 2D binary grid (of `"1"` land and `"0"` water), return the number of islands.\n\nAn island is surrounded by water and formed by connecting adjacent lands horizontally or vertically.',
    constraints: [{ description: 'm == grid.length' }, { description: 'n == grid[i].length' }, { description: '1 <= m, n <= 300' }, { description: 'grid[i][j] is "0" or "1".' }],
    examples: [
      { input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', output: '1' },
      { input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', output: '3' }
    ],
    testCases: [
      { input: { grid: [['1','1','1'],['0','1','0'],['1','1','1']] }, expectedOutput: 1, isHidden: false },
      { input: { grid: [['1','1','0','0'],['1','1','0','0'],['0','0','1','0'],['0','0','0','1']] }, expectedOutput: 3, isHidden: false },
      { input: { grid: [['1']] }, expectedOutput: 1, isHidden: false },
      { input: { grid: [['0']] }, expectedOutput: 0, isHidden: true },
      { input: { grid: [['1','0','1'],['0','0','0'],['1','0','1']] }, expectedOutput: 4, isHidden: true }
    ],
    hints: [{ order: 1, text: 'DFS/BFS from each unvisited land cell, marking all connected cells as visited.' }],
    starterCode: [
      { language: 'javascript', code: 'function numIslands(grid) {\n    // Write your code here\n}', functionName: 'numIslands' },
      { language: 'python', code: 'def num_islands(grid):\n    # Write your code here\n    pass', functionName: 'num_islands' }
    ],
    acceptanceRate: 56
  },

  // HARD 140-150
  {
    number: 140, title: 'Trapping Rain Water', slug: 'trapping-rain-water', difficulty: 'hard',
    category: 'Two Pointers', tags: ['Array', 'Two Pointers', 'Dynamic Programming', 'Stack'], companies: ['Amazon', 'Google', 'Facebook', 'Microsoft', 'Apple'],
    description: 'Given `n` non-negative integers representing an elevation map, compute how much water it can trap after raining.',
    constraints: [{ description: 'n == height.length' }, { description: '1 <= n <= 2 * 10⁴' }, { description: '0 <= height[i] <= 10⁵' }],
    examples: [
      { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6' },
      { input: 'height = [4,2,0,3,2,5]', output: '9' }
    ],
    testCases: [
      { input: { height: [0,1,0,2,1,0,1,3,2,1,2,1] }, expectedOutput: 6, isHidden: false },
      { input: { height: [4,2,0,3,2,5] }, expectedOutput: 9, isHidden: false },
      { input: { height: [1,0,1] }, expectedOutput: 1, isHidden: false },
      { input: { height: [3,0,2,0,4] }, expectedOutput: 7, isHidden: true },
      { input: { height: [0,0,0] }, expectedOutput: 0, isHidden: true }
    ],
    hints: [
      { order: 1, text: 'Water at each index = min(maxLeft, maxRight) - height[i].' },
      { order: 2, text: 'Optimize with two pointers moving inward.' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function trap(height) {\n    // Write your code here\n}', functionName: 'trap' },
      { language: 'python', code: 'def trap(height):\n    # Write your code here\n    pass', functionName: 'trap' }
    ],
    acceptanceRate: 60
  },
  {
    number: 141, title: 'First Missing Positive', slug: 'first-missing-positive', difficulty: 'hard',
    category: 'Array', tags: ['Array', 'Hash Table'], companies: ['Amazon', 'Microsoft', 'Bloomberg'],
    description: 'Given an unsorted integer array `nums`, return the smallest missing positive integer.\n\nYou must implement an algorithm that runs in `O(n)` time and uses `O(1)` auxiliary space.',
    constraints: [{ description: '1 <= nums.length <= 10⁵' }, { description: '-2³¹ <= nums[i] <= 2³¹ - 1' }],
    examples: [
      { input: 'nums = [1,2,0]', output: '3' },
      { input: 'nums = [3,4,-1,1]', output: '2' },
      { input: 'nums = [7,8,9,11,12]', output: '1' }
    ],
    testCases: [
      { input: { nums: [1,2,0] }, expectedOutput: 3, isHidden: false },
      { input: { nums: [3,4,-1,1] }, expectedOutput: 2, isHidden: false },
      { input: { nums: [7,8,9,11,12] }, expectedOutput: 1, isHidden: false },
      { input: { nums: [1] }, expectedOutput: 2, isHidden: true },
      { input: { nums: [1,2,3,4,5] }, expectedOutput: 6, isHidden: true }
    ],
    hints: [
      { order: 1, text: 'Place each number in its "correct" position: nums[i] = i+1.' },
      { order: 2, text: 'After rearranging, the first index where nums[i] != i+1 is the answer.' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function firstMissingPositive(nums) {\n    // Write your code here\n}', functionName: 'firstMissingPositive' },
      { language: 'python', code: 'def first_missing_positive(nums):\n    # Write your code here\n    pass', functionName: 'first_missing_positive' }
    ],
    acceptanceRate: 37
  },
  {
    number: 142, title: 'Edit Distance', slug: 'edit-distance', difficulty: 'hard',
    category: 'Dynamic Programming', tags: ['String', 'Dynamic Programming'], companies: ['Amazon', 'Google', 'Microsoft', 'Uber'],
    description: 'Given two strings `word1` and `word2`, return the minimum number of operations (insert, delete, replace) required to convert `word1` to `word2`.',
    constraints: [{ description: '0 <= word1.length, word2.length <= 500' }, { description: 'Strings consist of lowercase English letters.' }],
    examples: [
      { input: 'word1 = "horse", word2 = "ros"', output: '3' },
      { input: 'word1 = "intention", word2 = "execution"', output: '5' }
    ],
    testCases: [
      { input: { word1: 'horse', word2: 'ros' }, expectedOutput: 3, isHidden: false },
      { input: { word1: 'intention', word2: 'execution' }, expectedOutput: 5, isHidden: false },
      { input: { word1: '', word2: 'a' }, expectedOutput: 1, isHidden: false },
      { input: { word1: 'abc', word2: 'abc' }, expectedOutput: 0, isHidden: true },
      { input: { word1: 'kitten', word2: 'sitting' }, expectedOutput: 3, isHidden: true }
    ],
    hints: [
      { order: 1, text: 'dp[i][j] = edit distance between word1[0..i] and word2[0..j].' },
      { order: 2, text: 'If chars match: dp[i][j] = dp[i-1][j-1]. Otherwise: 1 + min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]).' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function minDistance(word1, word2) {\n    // Write your code here\n}', functionName: 'minDistance' },
      { language: 'python', code: 'def min_distance(word1, word2):\n    # Write your code here\n    pass', functionName: 'min_distance' }
    ],
    acceptanceRate: 53
  },
  {
    number: 143, title: 'Longest Consecutive Sequence', slug: 'longest-consecutive-sequence', difficulty: 'hard',
    category: 'Hash Table', tags: ['Array', 'Hash Table', 'Union Find'], companies: ['Amazon', 'Google', 'Facebook'],
    description: 'Given an unsorted array of integers `nums`, return the length of the longest consecutive sequence.\n\nYou must write an algorithm that runs in `O(n)` time.',
    constraints: [{ description: '0 <= nums.length <= 10⁵' }, { description: '-10⁹ <= nums[i] <= 10⁹' }],
    examples: [
      { input: 'nums = [100,4,200,1,3,2]', output: '4', explanation: '[1,2,3,4]' },
      { input: 'nums = [0,3,7,2,5,8,4,6,0,1]', output: '9' }
    ],
    testCases: [
      { input: { nums: [100,4,200,1,3,2] }, expectedOutput: 4, isHidden: false },
      { input: { nums: [0,3,7,2,5,8,4,6,0,1] }, expectedOutput: 9, isHidden: false },
      { input: { nums: [] }, expectedOutput: 0, isHidden: false },
      { input: { nums: [1,2,3,4,5] }, expectedOutput: 5, isHidden: true },
      { input: { nums: [5,4,3,-1,0,1,2] }, expectedOutput: 7, isHidden: true }
    ],
    hints: [
      { order: 1, text: 'Put all numbers in a Set.' },
      { order: 2, text: 'For each number that is the start of a sequence (n-1 not in Set), count upward.' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function longestConsecutive(nums) {\n    // Write your code here\n}', functionName: 'longestConsecutive' },
      { language: 'python', code: 'def longest_consecutive(nums):\n    # Write your code here\n    pass', functionName: 'longest_consecutive' }
    ],
    acceptanceRate: 47
  },
  {
    number: 144, title: 'Word Break', slug: 'word-break', difficulty: 'hard',
    category: 'Dynamic Programming', tags: ['Array', 'Hash Table', 'String', 'Dynamic Programming', 'Trie'], companies: ['Amazon', 'Google', 'Facebook', 'Bloomberg'],
    description: 'Given a string `s` and a dictionary of strings `wordDict`, return `true` if `s` can be segmented into a space-separated sequence of one or more dictionary words.',
    constraints: [{ description: '1 <= s.length <= 300' }, { description: '1 <= wordDict.length <= 1000' }, { description: '1 <= wordDict[i].length <= 20' }],
    examples: [
      { input: 's = "leetcode", wordDict = ["leet","code"]', output: 'true' },
      { input: 's = "applepenapple", wordDict = ["apple","pen"]', output: 'true' },
      { input: 's = "catsandog", wordDict = ["cats","dog","sand","and","cat"]', output: 'false' }
    ],
    testCases: [
      { input: { s: 'leetcode', wordDict: ['leet','code'] }, expectedOutput: true, isHidden: false },
      { input: { s: 'applepenapple', wordDict: ['apple','pen'] }, expectedOutput: true, isHidden: false },
      { input: { s: 'catsandog', wordDict: ['cats','dog','sand','and','cat'] }, expectedOutput: false, isHidden: false },
      { input: { s: 'a', wordDict: ['a'] }, expectedOutput: true, isHidden: true },
      { input: { s: 'goalspecial', wordDict: ['go','goal','goals','special'] }, expectedOutput: true, isHidden: true }
    ],
    hints: [
      { order: 1, text: 'dp[i] = true if s[0..i] can be segmented.' },
      { order: 2, text: 'For each i, check all j < i where dp[j] is true and s[j..i] is in dict.' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function wordBreak(s, wordDict) {\n    // Write your code here\n}', functionName: 'wordBreak' },
      { language: 'python', code: 'def word_break(s, word_dict):\n    # Write your code here\n    pass', functionName: 'word_break' }
    ],
    acceptanceRate: 46
  },
  {
    number: 145, title: 'Longest Increasing Subsequence', slug: 'longest-increasing-subsequence', difficulty: 'hard',
    category: 'Dynamic Programming', tags: ['Array', 'Binary Search', 'Dynamic Programming'], companies: ['Amazon', 'Microsoft', 'Google', 'Apple'],
    description: 'Given an integer array `nums`, return the length of the longest strictly increasing subsequence.',
    constraints: [{ description: '1 <= nums.length <= 2500' }, { description: '-10⁴ <= nums[i] <= 10⁴' }],
    examples: [
      { input: 'nums = [10,9,2,5,3,7,101,18]', output: '4', explanation: '[2,3,7,101]' },
      { input: 'nums = [0,1,0,3,2,3]', output: '4' },
      { input: 'nums = [7,7,7,7,7,7,7]', output: '1' }
    ],
    testCases: [
      { input: { nums: [10,9,2,5,3,7,101,18] }, expectedOutput: 4, isHidden: false },
      { input: { nums: [0,1,0,3,2,3] }, expectedOutput: 4, isHidden: false },
      { input: { nums: [7,7,7,7] }, expectedOutput: 1, isHidden: false },
      { input: { nums: [1,3,6,7,9,4,10,5,6] }, expectedOutput: 6, isHidden: true },
      { input: { nums: [1,2,3,4,5] }, expectedOutput: 5, isHidden: true }
    ],
    hints: [
      { order: 1, text: 'dp[i] = length of LIS ending at index i.' },
      { order: 2, text: 'Optimize to O(n log n) using binary search with a patience sorting approach.' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function lengthOfLIS(nums) {\n    // Write your code here\n}', functionName: 'lengthOfLIS' },
      { language: 'python', code: 'def length_of_lis(nums):\n    # Write your code here\n    pass', functionName: 'length_of_lis' }
    ],
    acceptanceRate: 53
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
  console.log(`\n✅ Batch 2 done! Added: ${added}, Skipped: ${skipped}`);
  mongoose.disconnect();
}).catch(e => { console.error('❌', e.message); process.exit(1); });
