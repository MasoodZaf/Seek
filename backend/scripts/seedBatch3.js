/* eslint-disable */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const CodingChallenge = require('../models/CodingChallenge');
const mongoURI = process.env.MONGODB_URI || 'mongodb://mongo:27017/seek';

const challenges = [
  // ── HARD 146-170 ────────────────────────────────────────────────────────────
  {
    number: 146, title: 'Median of Two Sorted Arrays', slug: 'median-two-sorted-arrays', difficulty: 'hard',
    category: 'Binary Search', tags: ['Array', 'Binary Search', 'Divide and Conquer'], companies: ['Google', 'Amazon', 'Microsoft'],
    description: 'Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the **median** of the two sorted arrays.\n\nThe overall run time complexity should be **O(log(m+n))**.',
    constraints: [{ description: '0 <= m, n <= 1000' }, { description: '1 <= m + n <= 2000' }, { description: '-10^6 <= nums1[i], nums2[i] <= 10^6' }],
    examples: [
      { input: 'nums1 = [1,3], nums2 = [2]', output: '2.00000', explanation: 'Merged = [1,2,3], median = 2.0' },
      { input: 'nums1 = [1,2], nums2 = [3,4]', output: '2.50000', explanation: 'Merged = [1,2,3,4], median = (2+3)/2 = 2.5' }
    ],
    testCases: [
      { input: { nums1: [1,3], nums2: [2] }, expectedOutput: 2.0, isHidden: false },
      { input: { nums1: [1,2], nums2: [3,4] }, expectedOutput: 2.5, isHidden: false },
      { input: { nums1: [0,0], nums2: [0,0] }, expectedOutput: 0.0, isHidden: true },
      { input: { nums1: [], nums2: [1] }, expectedOutput: 1.0, isHidden: true },
      { input: { nums1: [2], nums2: [] }, expectedOutput: 2.0, isHidden: true }
    ],
    hints: [
      { order: 1, text: 'Binary search on the smaller array to find the correct partition.' },
      { order: 2, text: 'Ensure max(left partition) <= min(right partition) on both sides.' },
      { order: 3, text: 'If total length is odd, median is max of left partition.' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function findMedianSortedArrays(nums1, nums2) {\n    // Write your code here\n}', functionName: 'findMedianSortedArrays' },
      { language: 'python', code: 'def find_median_sorted_arrays(nums1, nums2):\n    # Write your code here\n    pass', functionName: 'find_median_sorted_arrays' }
    ],
    acceptanceRate: 38
  },
  {
    number: 147, title: 'Regular Expression Matching', slug: 'regular-expression-matching', difficulty: 'hard',
    category: 'Dynamic Programming', tags: ['String', 'Dynamic Programming', 'Recursion'], companies: ['Google', 'Facebook', 'Amazon'],
    description: 'Given an input string `s` and a pattern `p`, implement regular expression matching with support for `.` and `*`:\n- `.` Matches any single character.\n- `*` Matches zero or more of the preceding element.\n\nThe matching must cover the **entire** input string.',
    constraints: [{ description: '1 <= s.length <= 20' }, { description: '1 <= p.length <= 30' }, { description: "s contains only lowercase English letters." }, { description: "p contains only lowercase letters, '.', and '*'." }],
    examples: [
      { input: 's = "aa", p = "a"', output: 'false', explanation: '"a" does not match the entire string "aa".' },
      { input: 's = "aa", p = "a*"', output: 'true', explanation: '"*" means zero or more \'a\'s. "aa" matches.' },
      { input: 's = "ab", p = ".*"', output: 'true', explanation: '".*" matches any sequence.' }
    ],
    testCases: [
      { input: { s: 'aa', p: 'a' }, expectedOutput: false, isHidden: false },
      { input: { s: 'aa', p: 'a*' }, expectedOutput: true, isHidden: false },
      { input: { s: 'ab', p: '.*' }, expectedOutput: true, isHidden: false },
      { input: { s: 'aab', p: 'c*a*b' }, expectedOutput: true, isHidden: true },
      { input: { s: 'mississippi', p: 'mis*is*p*.' }, expectedOutput: false, isHidden: true }
    ],
    hints: [
      { order: 1, text: 'Use DP where dp[i][j] = does s[0..i-1] match p[0..j-1].' },
      { order: 2, text: "For '*', either skip the pair (0 occurrences) or match one more character." },
      { order: 3, text: 'Base case: empty pattern matches empty string.' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function isMatch(s, p) {\n    // Write your code here\n}', functionName: 'isMatch' },
      { language: 'python', code: 'def is_match(s, p):\n    # Write your code here\n    pass', functionName: 'is_match' }
    ],
    acceptanceRate: 28
  },
  {
    number: 148, title: 'Merge K Sorted Lists', slug: 'merge-k-sorted-lists', difficulty: 'hard',
    category: 'Linked List', tags: ['Linked List', 'Divide and Conquer', 'Heap', 'Merge Sort'], companies: ['Amazon', 'Facebook', 'Microsoft'],
    description: 'You are given an array of `k` sorted arrays. Merge all arrays into one sorted array and return it.',
    constraints: [{ description: '0 <= k <= 10^4' }, { description: '0 <= lists[i].length <= 500' }, { description: '-10^4 <= lists[i][j] <= 10^4' }],
    examples: [
      { input: 'lists = [[1,4,5],[1,3,4],[2,6]]', output: '[1,1,2,3,4,4,5,6]' },
      { input: 'lists = []', output: '[]' }
    ],
    testCases: [
      { input: { lists: [[1,4,5],[1,3,4],[2,6]] }, expectedOutput: [1,1,2,3,4,4,5,6], isHidden: false },
      { input: { lists: [] }, expectedOutput: [], isHidden: false },
      { input: { lists: [[]] }, expectedOutput: [], isHidden: true },
      { input: { lists: [[1,2],[3,4],[5,6]] }, expectedOutput: [1,2,3,4,5,6], isHidden: true }
    ],
    hints: [
      { order: 1, text: 'Use a min-heap to always pick the smallest element.' },
      { order: 2, text: 'Divide and conquer: merge pairs of lists repeatedly.' },
      { order: 3, text: 'Merging two sorted arrays takes O(n) — do this log(k) times.' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function mergeKLists(lists) {\n    // lists is an array of sorted arrays\n    // Write your code here\n}', functionName: 'mergeKLists' },
      { language: 'python', code: 'def merge_k_lists(lists):\n    # lists is an array of sorted arrays\n    # Write your code here\n    pass', functionName: 'merge_k_lists' }
    ],
    acceptanceRate: 49
  },
  {
    number: 149, title: 'Jump Game II', slug: 'jump-game-ii', difficulty: 'hard',
    category: 'Greedy', tags: ['Array', 'Dynamic Programming', 'Greedy'], companies: ['Amazon', 'Microsoft', 'Bloomberg'],
    description: 'You are given a 0-indexed array `nums`. You start at index 0. `nums[i]` is the max jump length from index `i`.\n\nReturn the **minimum number of jumps** to reach the last index. It is guaranteed you can always reach the end.',
    constraints: [{ description: '1 <= nums.length <= 10^4' }, { description: '0 <= nums[i] <= 1000' }],
    examples: [
      { input: 'nums = [2,3,1,1,4]', output: '2', explanation: 'Jump to index 1 (jump 1), then to last (jump 3).' },
      { input: 'nums = [2,3,0,1,4]', output: '2' }
    ],
    testCases: [
      { input: { nums: [2,3,1,1,4] }, expectedOutput: 2, isHidden: false },
      { input: { nums: [2,3,0,1,4] }, expectedOutput: 2, isHidden: false },
      { input: { nums: [1] }, expectedOutput: 0, isHidden: true },
      { input: { nums: [1,2,3] }, expectedOutput: 2, isHidden: true },
      { input: { nums: [1,1,1,1] }, expectedOutput: 3, isHidden: true }
    ],
    hints: [
      { order: 1, text: 'Track the farthest index reachable from the current jump range.' },
      { order: 2, text: 'Increment jump count when you reach the boundary of the current range.' },
      { order: 3, text: 'No need to jump past the last index.' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function jump(nums) {\n    // Write your code here\n}', functionName: 'jump' },
      { language: 'python', code: 'def jump(nums):\n    # Write your code here\n    pass', functionName: 'jump' }
    ],
    acceptanceRate: 40
  },
  {
    number: 150, title: 'N-Queens Count', slug: 'n-queens-count', difficulty: 'hard',
    category: 'Backtracking', tags: ['Array', 'Backtracking'], companies: ['Amazon', 'Apple', 'Uber'],
    description: 'The n-queens puzzle places `n` queens on an `n x n` chessboard so that no two queens attack each other.\n\nGiven an integer `n`, return the **number** of distinct solutions.',
    constraints: [{ description: '1 <= n <= 9' }],
    examples: [
      { input: 'n = 4', output: '2', explanation: 'There are 2 distinct solutions to the 4-queens puzzle.' },
      { input: 'n = 1', output: '1' }
    ],
    testCases: [
      { input: { n: 4 }, expectedOutput: 2, isHidden: false },
      { input: { n: 1 }, expectedOutput: 1, isHidden: false },
      { input: { n: 5 }, expectedOutput: 10, isHidden: true },
      { input: { n: 6 }, expectedOutput: 4, isHidden: true },
      { input: { n: 8 }, expectedOutput: 92, isHidden: true }
    ],
    hints: [
      { order: 1, text: 'Place queens row by row using backtracking.' },
      { order: 2, text: 'Track occupied columns, diagonals (r-c), and anti-diagonals (r+c).' },
      { order: 3, text: 'Use sets for O(1) conflict checks.' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function totalNQueens(n) {\n    // Write your code here\n}', functionName: 'totalNQueens' },
      { language: 'python', code: 'def total_n_queens(n):\n    # Write your code here\n    pass', functionName: 'total_n_queens' }
    ],
    acceptanceRate: 62
  },
  {
    number: 151, title: 'Sliding Window Maximum', slug: 'sliding-window-maximum', difficulty: 'hard',
    category: 'Sliding Window', tags: ['Array', 'Queue', 'Sliding Window', 'Heap', 'Monotonic Queue'], companies: ['Amazon', 'Google', 'Facebook'],
    description: 'You are given an array `nums` and an integer `k`. There is a sliding window of size `k` moving from left to right.\n\nReturn an array of the **maximum value in each window position**.',
    constraints: [{ description: '1 <= nums.length <= 10^5' }, { description: '-10^4 <= nums[i] <= 10^4' }, { description: '1 <= k <= nums.length' }],
    examples: [
      { input: 'nums = [1,3,-1,-3,5,3,6,7], k = 3', output: '[3,3,5,5,6,7]', explanation: 'Windows: [1,3,-1]→3, [3,-1,-3]→3, [-1,-3,5]→5, [-3,5,3]→5, [5,3,6]→6, [3,6,7]→7' },
      { input: 'nums = [1], k = 1', output: '[1]' }
    ],
    testCases: [
      { input: { nums: [1,3,-1,-3,5,3,6,7], k: 3 }, expectedOutput: [3,3,5,5,6,7], isHidden: false },
      { input: { nums: [1], k: 1 }, expectedOutput: [1], isHidden: false },
      { input: { nums: [1,-1], k: 1 }, expectedOutput: [1,-1], isHidden: true },
      { input: { nums: [9,11], k: 2 }, expectedOutput: [11], isHidden: true }
    ],
    hints: [
      { order: 1, text: 'Use a monotonic decreasing deque that stores indices.' },
      { order: 2, text: 'Remove elements from front when they fall outside the window.' },
      { order: 3, text: 'Remove elements from back when they are smaller than the current element.' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function maxSlidingWindow(nums, k) {\n    // Write your code here\n}', functionName: 'maxSlidingWindow' },
      { language: 'python', code: 'def max_sliding_window(nums, k):\n    # Write your code here\n    pass', functionName: 'max_sliding_window' }
    ],
    acceptanceRate: 46
  },
  {
    number: 152, title: 'Minimum Window Substring', slug: 'minimum-window-substring', difficulty: 'hard',
    category: 'Sliding Window', tags: ['Hash Table', 'String', 'Sliding Window'], companies: ['Facebook', 'Amazon', 'Google'],
    description: 'Given strings `s` and `t`, return the **minimum window substring** of `s` that contains every character in `t` (including duplicates). Return `""` if no such window exists.',
    constraints: [{ description: '1 <= s.length, t.length <= 10^5' }, { description: 's and t consist of uppercase and lowercase English letters.' }],
    examples: [
      { input: 's = "ADOBECODEBANC", t = "ABC"', output: '"BANC"' },
      { input: 's = "a", t = "a"', output: '"a"' },
      { input: 's = "a", t = "aa"', output: '""' }
    ],
    testCases: [
      { input: { s: 'ADOBECODEBANC', t: 'ABC' }, expectedOutput: 'BANC', isHidden: false },
      { input: { s: 'a', t: 'a' }, expectedOutput: 'a', isHidden: false },
      { input: { s: 'a', t: 'aa' }, expectedOutput: '', isHidden: false },
      { input: { s: 'aa', t: 'aa' }, expectedOutput: 'aa', isHidden: true },
      { input: { s: 'cabwefgewcwaefgcf', t: 'cae' }, expectedOutput: 'cwae', isHidden: true }
    ],
    hints: [
      { order: 1, text: 'Use two pointers and a frequency map of required characters.' },
      { order: 2, text: 'Expand right pointer until all characters are satisfied.' },
      { order: 3, text: 'Shrink left pointer to minimize the window while still valid.' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function minWindow(s, t) {\n    // Write your code here\n}', functionName: 'minWindow' },
      { language: 'python', code: 'def min_window(s, t):\n    # Write your code here\n    pass', functionName: 'min_window' }
    ],
    acceptanceRate: 41
  },
  {
    number: 153, title: 'LRU Cache', slug: 'lru-cache', difficulty: 'hard',
    category: 'Design', tags: ['Hash Table', 'Linked List', 'Design', 'Doubly-Linked List'], companies: ['Amazon', 'Microsoft', 'Google'],
    description: 'Design a data structure that follows the **Least Recently Used (LRU)** cache policy.\n\nImplement the cache such that both `get(key)` and `put(key, value)` run in **O(1)** average time.\n\nGiven a capacity and a list of operations `["get"/"put", key, value?]`, return the results array (`null` for puts, value or `-1` for gets).',
    constraints: [{ description: '1 <= capacity <= 3000' }, { description: '0 <= key <= 10^4' }, { description: 'At most 2 * 10^5 calls.' }],
    examples: [
      { input: 'capacity=2, ops=[["put",1,1],["put",2,2],["get",1],["put",3,3],["get",2],["put",4,4],["get",1],["get",3],["get",4]]', output: '[null,null,1,null,-1,null,-1,3,4]' }
    ],
    testCases: [
      { input: { capacity: 2, ops: [['put',1,1],['put',2,2],['get',1],['put',3,3],['get',2],['put',4,4],['get',1],['get',3],['get',4]] }, expectedOutput: [null,null,1,null,-1,null,-1,3,4], isHidden: false },
      { input: { capacity: 1, ops: [['put',2,1],['get',2],['put',3,2],['get',2],['get',3]] }, expectedOutput: [null,1,null,-1,2], isHidden: true }
    ],
    hints: [
      { order: 1, text: 'Use a HashMap + Doubly Linked List for O(1) access and order tracking.' },
      { order: 2, text: 'Head = most recently used, Tail = least recently used.' },
      { order: 3, text: 'On get/put: move the node to head. On evict: remove from tail.' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function lruCacheOps(capacity, ops) {\n    // ops: array of ["put", key, val] or ["get", key]\n    // Return results array\n    // Write your code here\n}', functionName: 'lruCacheOps' },
      { language: 'python', code: 'def lru_cache_ops(capacity, ops):\n    # ops: list of ["put", key, val] or ["get", key]\n    # Return results list\n    pass', functionName: 'lru_cache_ops' }
    ],
    acceptanceRate: 42
  },
  {
    number: 154, title: 'Word Ladder', slug: 'word-ladder', difficulty: 'hard',
    category: 'Breadth-First Search', tags: ['Hash Table', 'String', 'Breadth-First Search'], companies: ['Amazon', 'Facebook', 'LinkedIn'],
    description: 'Given `beginWord`, `endWord`, and `wordList`, return the **number of words** in the shortest transformation sequence from `beginWord` to `endWord`, where each adjacent word differs by exactly one letter and every intermediate word is in `wordList`. Return `0` if no sequence exists.',
    constraints: [{ description: '1 <= beginWord.length <= 10' }, { description: 'endWord.length == beginWord.length' }, { description: '1 <= wordList.length <= 5000' }],
    examples: [
      { input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]', output: '5', explanation: '"hit"→"hot"→"dot"→"dog"→"cog" = 5 words' },
      { input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]', output: '0' }
    ],
    testCases: [
      { input: { beginWord: 'hit', endWord: 'cog', wordList: ['hot','dot','dog','lot','log','cog'] }, expectedOutput: 5, isHidden: false },
      { input: { beginWord: 'hit', endWord: 'cog', wordList: ['hot','dot','dog','lot','log'] }, expectedOutput: 0, isHidden: false },
      { input: { beginWord: 'a', endWord: 'c', wordList: ['a','b','c'] }, expectedOutput: 2, isHidden: true }
    ],
    hints: [
      { order: 1, text: 'BFS finds the shortest path in an unweighted graph.' },
      { order: 2, text: 'For each word, try replacing each character with a-z.' },
      { order: 3, text: 'Use a Set for O(1) word lookup and mark visited words.' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function ladderLength(beginWord, endWord, wordList) {\n    // Write your code here\n}', functionName: 'ladderLength' },
      { language: 'python', code: 'def ladder_length(begin_word, end_word, word_list):\n    # Write your code here\n    pass', functionName: 'ladder_length' }
    ],
    acceptanceRate: 36
  },
  {
    number: 155, title: 'Largest Rectangle in Histogram', slug: 'largest-rectangle-histogram', difficulty: 'hard',
    category: 'Stack', tags: ['Array', 'Stack', 'Monotonic Stack'], companies: ['Amazon', 'Microsoft', 'Goldman Sachs'],
    description: 'Given an array of integers `heights` representing a histogram where each bar has width `1`, return the **area of the largest rectangle** in the histogram.',
    constraints: [{ description: '1 <= heights.length <= 10^5' }, { description: '0 <= heights[i] <= 10^4' }],
    examples: [
      { input: 'heights = [2,1,5,6,2,3]', output: '10', explanation: 'Largest rectangle uses bars 5 and 6, area = 2*5 = 10.' },
      { input: 'heights = [2,4]', output: '4' }
    ],
    testCases: [
      { input: { heights: [2,1,5,6,2,3] }, expectedOutput: 10, isHidden: false },
      { input: { heights: [2,4] }, expectedOutput: 4, isHidden: false },
      { input: { heights: [1] }, expectedOutput: 1, isHidden: true },
      { input: { heights: [1,1] }, expectedOutput: 2, isHidden: true },
      { input: { heights: [4,2,0,3,2,5] }, expectedOutput: 6, isHidden: true }
    ],
    hints: [
      { order: 1, text: 'Use a monotonic increasing stack of indices.' },
      { order: 2, text: 'When a shorter bar is found, pop and calculate area using the popped height.' },
      { order: 3, text: 'Width extends from the current index to the new stack top.' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function largestRectangleArea(heights) {\n    // Write your code here\n}', functionName: 'largestRectangleArea' },
      { language: 'python', code: 'def largest_rectangle_area(heights):\n    # Write your code here\n    pass', functionName: 'largest_rectangle_area' }
    ],
    acceptanceRate: 42
  },
  {
    number: 156, title: 'Binary Tree Maximum Path Sum', slug: 'binary-tree-max-path-sum', difficulty: 'hard',
    category: 'Tree', tags: ['Dynamic Programming', 'Tree', 'Depth-First Search', 'Binary Tree'], companies: ['Facebook', 'Amazon', 'Uber'],
    description: 'Given the root of a binary tree (as a level-order array where `null` means missing node), return the **maximum path sum** of any non-empty path. A path is any sequence of nodes connected by edges; it does not need to pass through the root.',
    constraints: [{ description: '1 <= number of nodes <= 3 * 10^4' }, { description: '-1000 <= Node.val <= 1000' }],
    examples: [
      { input: 'root = [1,2,3]', output: '6', explanation: 'Path 2→1→3, sum = 6.' },
      { input: 'root = [-10,9,20,null,null,15,7]', output: '42', explanation: 'Path 15→20→7, sum = 42.' }
    ],
    testCases: [
      { input: { root: [1,2,3] }, expectedOutput: 6, isHidden: false },
      { input: { root: [-10,9,20,null,null,15,7] }, expectedOutput: 42, isHidden: false },
      { input: { root: [-3] }, expectedOutput: -3, isHidden: true },
      { input: { root: [1,-2,-3,1,3,-2,null,-1] }, expectedOutput: 3, isHidden: true }
    ],
    hints: [
      { order: 1, text: 'DFS: for each node, compute the max single-path gain going down.' },
      { order: 2, text: 'Max gain from a subtree = max(0, left gain, right gain).' },
      { order: 3, text: 'Update global max with node.val + leftGain + rightGain at each node.' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function maxPathSum(root) {\n    // root is level-order array (null = missing node)\n    // Write your code here\n}', functionName: 'maxPathSum' },
      { language: 'python', code: 'def max_path_sum(root):\n    # root is level-order list (None = missing node)\n    # Write your code here\n    pass', functionName: 'max_path_sum' }
    ],
    acceptanceRate: 38
  },
  {
    number: 157, title: 'Course Schedule II', slug: 'course-schedule-ii', difficulty: 'hard',
    category: 'Graph', tags: ['Depth-First Search', 'Breadth-First Search', 'Graph', 'Topological Sort'], companies: ['Amazon', 'Facebook', 'Airbnb'],
    description: 'There are `numCourses` courses labeled `0` to `numCourses-1`. `prerequisites[i] = [a, b]` means you must take course `b` before `a`.\n\nReturn a valid course ordering to finish all courses. If impossible (cycle), return `[]`.',
    constraints: [{ description: '1 <= numCourses <= 2000' }, { description: '0 <= prerequisites.length <= numCourses * (numCourses - 1)' }],
    examples: [
      { input: 'numCourses = 2, prerequisites = [[1,0]]', output: '[0,1]' },
      { input: 'numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]', output: '[0,2,1,3]' },
      { input: 'numCourses = 1, prerequisites = []', output: '[0]' }
    ],
    testCases: [
      { input: { numCourses: 2, prerequisites: [[1,0]] }, expectedOutput: [0,1], isHidden: false },
      { input: { numCourses: 1, prerequisites: [] }, expectedOutput: [0], isHidden: false },
      { input: { numCourses: 2, prerequisites: [[1,0],[0,1]] }, expectedOutput: [], isHidden: true },
      { input: { numCourses: 4, prerequisites: [[1,0],[2,0],[3,1],[3,2]] }, expectedOutput: [0,1,2,3], isHidden: true }
    ],
    hints: [
      { order: 1, text: "Topological sort using Kahn's algorithm (BFS with in-degree)." },
      { order: 2, text: 'If result contains all numCourses nodes, a valid ordering exists.' },
      { order: 3, text: 'A cycle means some nodes will never reach in-degree 0.' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function findOrder(numCourses, prerequisites) {\n    // Write your code here\n}', functionName: 'findOrder' },
      { language: 'python', code: 'def find_order(num_courses, prerequisites):\n    # Write your code here\n    pass', functionName: 'find_order' }
    ],
    acceptanceRate: 48
  },
  {
    number: 158, title: 'Find the Duplicate Number', slug: 'find-duplicate-number', difficulty: 'hard',
    category: 'Two Pointers', tags: ['Array', 'Two Pointers', 'Binary Search', 'Bit Manipulation'], companies: ['Amazon', 'Apple', 'Bloomberg'],
    description: 'Given an array `nums` of `n + 1` integers where each integer is in the range `[1, n]`, there is exactly one repeated number. Return it.\n\n**Constraints:** You must not modify the array, and must use only O(1) extra space.',
    constraints: [{ description: '1 <= n <= 10^5' }, { description: 'nums.length == n + 1' }, { description: '1 <= nums[i] <= n' }, { description: 'Only one number is repeated.' }],
    examples: [
      { input: 'nums = [1,3,4,2,2]', output: '2' },
      { input: 'nums = [3,1,3,4,2]', output: '3' }
    ],
    testCases: [
      { input: { nums: [1,3,4,2,2] }, expectedOutput: 2, isHidden: false },
      { input: { nums: [3,1,3,4,2] }, expectedOutput: 3, isHidden: false },
      { input: { nums: [1,1] }, expectedOutput: 1, isHidden: true },
      { input: { nums: [2,2,2,2,2] }, expectedOutput: 2, isHidden: true }
    ],
    hints: [
      { order: 1, text: "Think of the array as a linked list where nums[i] → index nums[i]." },
      { order: 2, text: "Floyd's Cycle Detection: slow moves 1 step, fast moves 2 steps." },
      { order: 3, text: 'Entry point of the cycle is the duplicate number.' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function findDuplicate(nums) {\n    // O(1) space, do not modify array\n    // Write your code here\n}', functionName: 'findDuplicate' },
      { language: 'python', code: 'def find_duplicate(nums):\n    # O(1) space, do not modify array\n    # Write your code here\n    pass', functionName: 'find_duplicate' }
    ],
    acceptanceRate: 58
  },
  {
    number: 159, title: 'Palindrome Partitioning', slug: 'palindrome-partitioning', difficulty: 'hard',
    category: 'Backtracking', tags: ['String', 'Dynamic Programming', 'Backtracking'], companies: ['Amazon', 'Microsoft', 'Uber'],
    description: 'Given a string `s`, partition `s` such that every substring of the partition is a palindrome. Return **all possible palindrome partitioning** of `s`.',
    constraints: [{ description: '1 <= s.length <= 16' }, { description: 's contains only lowercase English letters.' }],
    examples: [
      { input: 's = "aab"', output: '[["a","a","b"],["aa","b"]]' },
      { input: 's = "a"', output: '[["a"]]' }
    ],
    testCases: [
      { input: { s: 'aab' }, expectedOutput: [['a','a','b'],['aa','b']], isHidden: false },
      { input: { s: 'a' }, expectedOutput: [['a']], isHidden: false },
      { input: { s: 'bb' }, expectedOutput: [['b','b'],['bb']], isHidden: true }
    ],
    hints: [
      { order: 1, text: 'Backtrack: at each position, try every substring starting here.' },
      { order: 2, text: 'Check if the substring is a palindrome before recursing.' },
      { order: 3, text: 'DP precomputation for isPalindrome(i,j) avoids repeated checks.' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function partition(s) {\n    // Return array of arrays\n    // Write your code here\n}', functionName: 'partition' },
      { language: 'python', code: 'def partition(s):\n    # Return list of lists\n    # Write your code here\n    pass', functionName: 'partition' }
    ],
    acceptanceRate: 66
  },
  {
    number: 160, title: 'Minimum Cost to Connect Sticks', slug: 'minimum-cost-connect-sticks', difficulty: 'hard',
    category: 'Greedy', tags: ['Array', 'Greedy', 'Heap (Priority Queue)'], companies: ['Amazon', 'Facebook'],
    description: 'You have sticks with lengths in array `sticks`. You can connect any two sticks of lengths `x` and `y` for a cost of `x + y`, producing one stick of length `x + y`.\n\nReturn the **minimum total cost** to connect all sticks into one.',
    constraints: [{ description: '1 <= sticks.length <= 10^4' }, { description: '1 <= sticks[i] <= 10^4' }],
    examples: [
      { input: 'sticks = [2,4,3]', output: '14', explanation: 'Connect 2+3=5 (cost 5), then 5+4=9 (cost 9). Total = 14.' },
      { input: 'sticks = [1,8,3,5]', output: '30' }
    ],
    testCases: [
      { input: { sticks: [2,4,3] }, expectedOutput: 14, isHidden: false },
      { input: { sticks: [1,8,3,5] }, expectedOutput: 30, isHidden: false },
      { input: { sticks: [5] }, expectedOutput: 0, isHidden: true },
      { input: { sticks: [1,2,3,4,5] }, expectedOutput: 33, isHidden: true }
    ],
    hints: [
      { order: 1, text: 'Always merge the two shortest sticks (greedy is optimal here).' },
      { order: 2, text: 'Use a min-heap for efficient minimum extraction.' },
      { order: 3, text: 'This is equivalent to Huffman encoding.' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function connectSticks(sticks) {\n    // Write your code here\n}', functionName: 'connectSticks' },
      { language: 'python', code: 'def connect_sticks(sticks):\n    # Write your code here\n    pass', functionName: 'connect_sticks' }
    ],
    acceptanceRate: 56
  },
  {
    number: 161, title: 'Minimum Number of Arrows to Burst Balloons', slug: 'min-arrows-burst-balloons', difficulty: 'hard',
    category: 'Greedy', tags: ['Array', 'Greedy', 'Sorting'], companies: ['Amazon', 'Microsoft'],
    description: 'Balloons are represented as `points[i] = [xstart, xend]`. An arrow shot at `x` bursts a balloon if `xstart <= x <= xend`.\n\nReturn the **minimum number of arrows** needed to burst all balloons.',
    constraints: [{ description: '1 <= points.length <= 10^5' }, { description: 'points[i].length == 2' }, { description: '-2^31 <= xstart < xend <= 2^31 - 1' }],
    examples: [
      { input: 'points = [[10,16],[2,8],[1,6],[7,12]]', output: '2', explanation: 'Shoot at x=6 and x=11.' },
      { input: 'points = [[1,2],[3,4],[5,6],[7,8]]', output: '4' },
      { input: 'points = [[1,2],[2,3],[3,4],[4,5]]', output: '2' }
    ],
    testCases: [
      { input: { points: [[10,16],[2,8],[1,6],[7,12]] }, expectedOutput: 2, isHidden: false },
      { input: { points: [[1,2],[3,4],[5,6],[7,8]] }, expectedOutput: 4, isHidden: false },
      { input: { points: [[1,2],[2,3],[3,4],[4,5]] }, expectedOutput: 2, isHidden: false },
      { input: { points: [[2,3],[2,3]] }, expectedOutput: 1, isHidden: true }
    ],
    hints: [
      { order: 1, text: 'Sort balloons by their end position.' },
      { order: 2, text: 'Shoot at the end of the current balloon (greedily).' },
      { order: 3, text: 'Skip all subsequent balloons whose start <= current shot position.' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function findMinArrowShots(points) {\n    // Write your code here\n}', functionName: 'findMinArrowShots' },
      { language: 'python', code: 'def find_min_arrow_shots(points):\n    # Write your code here\n    pass', functionName: 'find_min_arrow_shots' }
    ],
    acceptanceRate: 53
  },
  {
    number: 162, title: 'Longest Valid Parentheses', slug: 'longest-valid-parentheses', difficulty: 'hard',
    category: 'Stack', tags: ['String', 'Dynamic Programming', 'Stack'], companies: ['Amazon', 'Facebook', 'Microsoft'],
    description: 'Given a string containing just `\'(\'` and `\')\'`, return the length of the **longest valid (well-formed) parentheses substring**.',
    constraints: [{ description: '0 <= s.length <= 3 * 10^4' }, { description: "s[i] is '(' or ')'" }],
    examples: [
      { input: 's = "(()"', output: '2', explanation: 'Longest valid is "()".' },
      { input: 's = ")()())"', output: '4', explanation: 'Longest valid is "()()".' },
      { input: 's = ""', output: '0' }
    ],
    testCases: [
      { input: { s: '(()' }, expectedOutput: 2, isHidden: false },
      { input: { s: ')()())' }, expectedOutput: 4, isHidden: false },
      { input: { s: '' }, expectedOutput: 0, isHidden: false },
      { input: { s: '()(()' }, expectedOutput: 2, isHidden: true },
      { input: { s: '(()())' }, expectedOutput: 6, isHidden: true }
    ],
    hints: [
      { order: 1, text: "Stack: push -1 as base. Push index on '('. Pop on ')'." },
      { order: 2, text: "After popping, if stack is empty push current index as new base." },
      { order: 3, text: 'Length of valid substring = current index - stack top.' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function longestValidParentheses(s) {\n    // Write your code here\n}', functionName: 'longestValidParentheses' },
      { language: 'python', code: 'def longest_valid_parentheses(s):\n    # Write your code here\n    pass', functionName: 'longest_valid_parentheses' }
    ],
    acceptanceRate: 32
  },
  {
    number: 163, title: 'Maximum Profit in Job Scheduling', slug: 'max-profit-job-scheduling', difficulty: 'hard',
    category: 'Dynamic Programming', tags: ['Array', 'Binary Search', 'Dynamic Programming', 'Sorting'], companies: ['Google', 'DoorDash', 'Amazon'],
    description: 'We have `n` jobs with `startTime[i]`, `endTime[i]`, and `profit[i]`. You can only do one job at a time.\n\nReturn the **maximum profit** achievable. Jobs ending at time X allow starting another at time X.',
    constraints: [{ description: '1 <= startTime.length == endTime.length == profit.length <= 5*10^4' }, { description: '1 <= profit[i] <= 10^4' }],
    examples: [
      { input: 'startTime=[1,2,3,3], endTime=[3,4,5,6], profit=[50,10,40,70]', output: '120', explanation: 'Jobs [1,3,50] and [3,6,70], profit = 120.' },
      { input: 'startTime=[1,2,3,4,6], endTime=[3,5,10,6,9], profit=[20,20,100,70,60]', output: '150' }
    ],
    testCases: [
      { input: { startTime: [1,2,3,3], endTime: [3,4,5,6], profit: [50,10,40,70] }, expectedOutput: 120, isHidden: false },
      { input: { startTime: [1,2,3,4,6], endTime: [3,5,10,6,9], profit: [20,20,100,70,60] }, expectedOutput: 150, isHidden: false },
      { input: { startTime: [1,1,1], endTime: [2,3,4], profit: [5,6,4] }, expectedOutput: 6, isHidden: true }
    ],
    hints: [
      { order: 1, text: 'Sort jobs by end time.' },
      { order: 2, text: 'For each job: either skip it, or take it + dp of latest non-overlapping job.' },
      { order: 3, text: 'Binary search to find the latest job ending <= current job start.' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function jobScheduling(startTime, endTime, profit) {\n    // Write your code here\n}', functionName: 'jobScheduling' },
      { language: 'python', code: 'def job_scheduling(start_time, end_time, profit):\n    # Write your code here\n    pass', functionName: 'job_scheduling' }
    ],
    acceptanceRate: 51
  },
  {
    number: 164, title: 'Reconstruct Itinerary', slug: 'reconstruct-itinerary', difficulty: 'hard',
    category: 'Graph', tags: ['Depth-First Search', 'Graph', 'Eulerian Circuit'], companies: ['Google', 'Amazon', 'Microsoft'],
    description: 'Given a list of airline `tickets = [from, to]`, reconstruct the itinerary starting from `"JFK"`. All tickets must be used once. If multiple valid itineraries exist, return the one with the smallest lexical order.',
    constraints: [{ description: '1 <= tickets.length <= 300' }, { description: 'tickets[i] consists of uppercase English letters.' }],
    examples: [
      { input: 'tickets = [["MUC","LHR"],["JFK","MUC"],["SFO","SJC"],["LHR","SFO"]]', output: '["JFK","MUC","LHR","SFO","SJC"]' },
      { input: 'tickets = [["JFK","SFO"],["JFK","ATL"],["SFO","ATL"],["ATL","JFK"],["ATL","SFO"]]', output: '["JFK","ATL","JFK","SFO","ATL","SFO"]' }
    ],
    testCases: [
      { input: { tickets: [['MUC','LHR'],['JFK','MUC'],['SFO','SJC'],['LHR','SFO']] }, expectedOutput: ['JFK','MUC','LHR','SFO','SJC'], isHidden: false },
      { input: { tickets: [['JFK','SFO'],['JFK','ATL'],['SFO','ATL'],['ATL','JFK'],['ATL','SFO']] }, expectedOutput: ['JFK','ATL','JFK','SFO','ATL','SFO'], isHidden: false }
    ],
    hints: [
      { order: 1, text: "Hierholzer's algorithm finds an Eulerian path." },
      { order: 2, text: 'Sort adjacency lists lexicographically.' },
      { order: 3, text: 'DFS: add airport to result after all outgoing edges are visited, then reverse.' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function findItinerary(tickets) {\n    // Write your code here\n}', functionName: 'findItinerary' },
      { language: 'python', code: 'def find_itinerary(tickets):\n    # Write your code here\n    pass', functionName: 'find_itinerary' }
    ],
    acceptanceRate: 41
  },
  {
    number: 165, title: 'Burst Balloons', slug: 'burst-balloons', difficulty: 'hard',
    category: 'Dynamic Programming', tags: ['Array', 'Dynamic Programming'], companies: ['Google', 'Amazon', 'Microsoft'],
    description: 'You have `n` balloons with values in `nums`. Bursting balloon `i` earns `nums[i-1] * nums[i] * nums[i+1]` coins (treat out-of-bounds as 1).\n\nReturn the **maximum coins** you can collect.',
    constraints: [{ description: 'n == nums.length' }, { description: '1 <= n <= 300' }, { description: '0 <= nums[i] <= 100' }],
    examples: [
      { input: 'nums = [3,1,5,8]', output: '167', explanation: '[3,1,5,8]→[3,5,8]→[3,8]→[8]→[], coins = 15+120+24+8 = 167' },
      { input: 'nums = [1,5]', output: '10' }
    ],
    testCases: [
      { input: { nums: [3,1,5,8] }, expectedOutput: 167, isHidden: false },
      { input: { nums: [1,5] }, expectedOutput: 10, isHidden: false },
      { input: { nums: [1] }, expectedOutput: 1, isHidden: true },
      { input: { nums: [0,0,0,0] }, expectedOutput: 0, isHidden: true }
    ],
    hints: [
      { order: 1, text: 'Think backwards: choose which balloon to burst LAST in range [i,j].' },
      { order: 2, text: 'dp[i][j] = max coins from bursting all balloons strictly between i and j.' },
      { order: 3, text: 'Pad nums with 1s on both ends to simplify boundary handling.' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function maxCoins(nums) {\n    // Write your code here\n}', functionName: 'maxCoins' },
      { language: 'python', code: 'def max_coins(nums):\n    # Write your code here\n    pass', functionName: 'max_coins' }
    ],
    acceptanceRate: 57
  },
  {
    number: 166, title: 'Maximal Rectangle', slug: 'maximal-rectangle', difficulty: 'hard',
    category: 'Stack', tags: ['Array', 'Hash Table', 'Dynamic Programming', 'Stack', 'Matrix', 'Monotonic Stack'], companies: ['Amazon', 'Google', 'Microsoft'],
    description: 'Given a `rows x cols` binary matrix of `"0"`s and `"1"`s, find the **largest rectangle containing only `"1"`s** and return its area.',
    constraints: [{ description: '1 <= rows, cols <= 200' }, { description: "matrix[i][j] is '0' or '1'" }],
    examples: [
      { input: 'matrix = [["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]]', output: '6' },
      { input: 'matrix = [["0"]]', output: '0' },
      { input: 'matrix = [["1"]]', output: '1' }
    ],
    testCases: [
      { input: { matrix: [['1','0','1','0','0'],['1','0','1','1','1'],['1','1','1','1','1'],['1','0','0','1','0']] }, expectedOutput: 6, isHidden: false },
      { input: { matrix: [['0']] }, expectedOutput: 0, isHidden: false },
      { input: { matrix: [['1']] }, expectedOutput: 1, isHidden: false },
      { input: { matrix: [['1','1']] }, expectedOutput: 2, isHidden: true }
    ],
    hints: [
      { order: 1, text: 'Build cumulative height histograms row by row.' },
      { order: 2, text: 'For each row\'s histogram, apply the "Largest Rectangle in Histogram" algorithm.' },
      { order: 3, text: 'Use a monotonic stack for each histogram in O(cols).' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function maximalRectangle(matrix) {\n    // Write your code here\n}', functionName: 'maximalRectangle' },
      { language: 'python', code: 'def maximal_rectangle(matrix):\n    # Write your code here\n    pass', functionName: 'maximal_rectangle' }
    ],
    acceptanceRate: 44
  },
  {
    number: 167, title: 'Strange Printer', slug: 'strange-printer', difficulty: 'hard',
    category: 'Dynamic Programming', tags: ['String', 'Dynamic Programming'], companies: ['Google'],
    description: 'A strange printer can print a sequence of the same character each time, and can overprint existing characters.\n\nGiven string `s`, return the **minimum number of turns** the printer needs to print it.',
    constraints: [{ description: '1 <= s.length <= 100' }, { description: 's consists of lowercase English letters.' }],
    examples: [
      { input: 's = "aaabbb"', output: '2', explanation: 'Print "aaa", then "bbb".' },
      { input: 's = "aba"', output: '2', explanation: 'Print "aaa", then overwrite middle with "b".' }
    ],
    testCases: [
      { input: { s: 'aaabbb' }, expectedOutput: 2, isHidden: false },
      { input: { s: 'aba' }, expectedOutput: 2, isHidden: false },
      { input: { s: 'a' }, expectedOutput: 1, isHidden: true },
      { input: { s: 'abcba' }, expectedOutput: 3, isHidden: true }
    ],
    hints: [
      { order: 1, text: 'Interval DP: dp[i][j] = min turns to print s[i..j].' },
      { order: 2, text: 'If s[i] == s[k] for some k in (i,j], we can merge their prints.' },
      { order: 3, text: 'dp[i][j] = min(dp[i][k-1] + dp[k][j]) when s[i] == s[k].' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function strangePrinter(s) {\n    // Write your code here\n}', functionName: 'strangePrinter' },
      { language: 'python', code: 'def strange_printer(s):\n    # Write your code here\n    pass', functionName: 'strange_printer' }
    ],
    acceptanceRate: 47
  },
  {
    number: 168, title: 'Maximum Frequency Stack', slug: 'maximum-frequency-stack', difficulty: 'hard',
    category: 'Design', tags: ['Hash Table', 'Stack', 'Design', 'Ordered Set'], companies: ['Amazon', 'Google', 'Facebook'],
    description: 'Design a stack-like data structure that pops the most frequently pushed element. If there is a tie, pop the most recently pushed element.\n\nGiven operations `["push"/"pop", val?]`, return results (`null` for push, value for pop).',
    constraints: [{ description: '0 <= val <= 10^9' }, { description: 'At most 2 * 10^4 push and pop calls.' }, { description: 'It is guaranteed that there will be at least one element before pop is called.' }],
    examples: [
      { input: 'ops=[["push",5],["push",7],["push",5],["push",7],["push",4],["push",5],["pop"],["pop"],["pop"],["pop"]]', output: '[null,null,null,null,null,null,5,7,5,4]' }
    ],
    testCases: [
      { input: { ops: [['push',5],['push',7],['push',5],['push',7],['push',4],['push',5],['pop'],['pop'],['pop'],['pop']] }, expectedOutput: [null,null,null,null,null,null,5,7,5,4], isHidden: false }
    ],
    hints: [
      { order: 1, text: 'Map each frequency to a stack of elements with that frequency.' },
      { order: 2, text: 'Track the current maximum frequency.' },
      { order: 3, text: 'On push: increment freq[val], add to group[freq[val]]. On pop: remove from group[maxFreq].' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function freqStackOps(ops) {\n    // ops: ["push", val] or ["pop"]\n    // Return results array\n    // Write your code here\n}', functionName: 'freqStackOps' },
      { language: 'python', code: 'def freq_stack_ops(ops):\n    # ops: ["push", val] or ["pop"]\n    # Return results list\n    pass', functionName: 'freq_stack_ops' }
    ],
    acceptanceRate: 67
  },
  {
    number: 169, title: 'Minimum Window Subsequence', slug: 'minimum-window-subsequence', difficulty: 'hard',
    category: 'Sliding Window', tags: ['String', 'Dynamic Programming', 'Sliding Window'], companies: ['Google', 'Snapchat', 'Airbnb'],
    description: 'Given strings `s1` and `s2`, return the **minimum (shortest) window** in `s1` that contains `s2` as a **subsequence**. If there is no such window, return `""`.',
    constraints: [{ description: '1 <= s1.length <= 2 * 10^4' }, { description: '1 <= s2.length <= 100' }, { description: 's1 and s2 consist of lowercase English letters.' }],
    examples: [
      { input: 's1 = "abcdebdde", s2 = "bde"', output: '"bcde"', explanation: '"bcde" is shorter than "bdde".' },
      { input: 's1 = "jmeqksfrsdcmsiwvaovztaqenprpvnbstl", s2 = "u"', output: '""' }
    ],
    testCases: [
      { input: { s1: 'abcdebdde', s2: 'bde' }, expectedOutput: 'bcde', isHidden: false },
      { input: { s1: 'jmeqksfrsdcmsiwvaovztaqenprpvnbstl', s2: 'u' }, expectedOutput: '', isHidden: false },
      { input: { s1: 'abcde', s2: 'ace' }, expectedOutput: 'abcde', isHidden: true },
      { input: { s1: 'cnhczmccqouqadqtmjjzl', s2: 'mm' }, expectedOutput: 'mccqouqadqtm', isHidden: true }
    ],
    hints: [
      { order: 1, text: 'Two pointers: find the end of a valid window, then shrink from the left.' },
      { order: 2, text: 'Forward scan finds where s2 ends; backward scan from that point finds shortest window.' },
      { order: 3, text: 'Track minimum length window found so far.' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function minWindowSubsequence(s1, s2) {\n    // Write your code here\n}', functionName: 'minWindowSubsequence' },
      { language: 'python', code: 'def min_window_subsequence(s1, s2):\n    # Write your code here\n    pass', functionName: 'min_window_subsequence' }
    ],
    acceptanceRate: 43
  },
  {
    number: 170, title: 'Largest Component Size by Common Factor', slug: 'largest-component-common-factor', difficulty: 'hard',
    category: 'Union Find', tags: ['Array', 'Hash Table', 'Math', 'Union Find'], companies: ['Amazon', 'Google'],
    description: 'Given an integer array `nums`, consider a graph where `nums[i]` and `nums[j]` share an edge if they have a common factor > 1.\n\nReturn the **size of the largest connected component** in this graph.',
    constraints: [{ description: '1 <= nums.length <= 2 * 10^4' }, { description: '1 <= nums[i] <= 10^5' }, { description: 'All values in nums are unique.' }],
    examples: [
      { input: 'nums = [4,6,15,35]', output: '4', explanation: '4-6 (factor 2), 6-15 (factor 3), 15-35 (factor 5) — all connected.' },
      { input: 'nums = [20,50,9,63]', output: '2' },
      { input: 'nums = [2,3,6,7,4,12,21,39]', output: '8' }
    ],
    testCases: [
      { input: { nums: [4,6,15,35] }, expectedOutput: 4, isHidden: false },
      { input: { nums: [20,50,9,63] }, expectedOutput: 2, isHidden: false },
      { input: { nums: [2,3,6,7,4,12,21,39] }, expectedOutput: 8, isHidden: false },
      { input: { nums: [1] }, expectedOutput: 1, isHidden: true }
    ],
    hints: [
      { order: 1, text: 'Union-Find: union a number with each of its prime factors.' },
      { order: 2, text: "Don't union the numbers together directly — union each number to its factors." },
      { order: 3, text: 'The answer is the largest component after all unions.' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function largestComponentSize(nums) {\n    // Write your code here\n}', functionName: 'largestComponentSize' },
      { language: 'python', code: 'def largest_component_size(nums):\n    # Write your code here\n    pass', functionName: 'largest_component_size' }
    ],
    acceptanceRate: 35
  }
];

async function seed() {
  await mongoose.connect(mongoURI);
  console.log('✅ Connected to MongoDB');

  let added = 0, skipped = 0;
  for (const c of challenges) {
    const exists = await CodingChallenge.findOne({ $or: [{ slug: c.slug }, { number: c.number }] });
    if (exists) { console.log(`  ⏭ Skipped #${c.number}: ${c.title}`); skipped++; continue; }
    await CodingChallenge.create(c);
    console.log(`  ✓ Added #${c.number}: ${c.title}`);
    added++;
  }

  console.log(`\n✅ Batch 3 done! Added: ${added}, Skipped: ${skipped}`);
  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
