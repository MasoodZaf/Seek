/* eslint-disable */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const CodingChallenge = require('../models/CodingChallenge');
const mongoURI = process.env.MONGODB_URI || 'mongodb://mongo:27017/seek';

// Note: 'expert' is not in the difficulty enum, so we use 'hard' for all.
// These are the hardest problems in the set (skill level 8-10).
const challenges = [
  {
    number: 171, title: 'Longest Substring with At Most K Distinct Characters', slug: 'longest-substring-k-distinct', difficulty: 'hard',
    category: 'Sliding Window', tags: ['Hash Table', 'String', 'Sliding Window'], companies: ['Amazon', 'Google', 'Microsoft'],
    skillLevel: 8, topicDepth: 'advanced',
    description: 'Given a string `s` and an integer `k`, return the length of the **longest substring** that contains at most `k` distinct characters.',
    constraints: [{ description: '1 <= s.length <= 5 * 10^4' }, { description: '0 <= k <= 50' }],
    examples: [
      { input: 's = "eceba", k = 2', output: '3', explanation: '"ece" has 2 distinct characters.' },
      { input: 's = "aa", k = 1', output: '2' }
    ],
    testCases: [
      { input: { s: 'eceba', k: 2 }, expectedOutput: 3, isHidden: false },
      { input: { s: 'aa', k: 1 }, expectedOutput: 2, isHidden: false },
      { input: { s: 'a', k: 0 }, expectedOutput: 0, isHidden: true },
      { input: { s: 'aabbcc', k: 2 }, expectedOutput: 4, isHidden: true }
    ],
    hints: [
      { order: 1, text: 'Use a sliding window with a frequency map.' },
      { order: 2, text: 'Shrink window from left when distinct char count exceeds k.' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function lengthOfLongestSubstringKDistinct(s, k) {\n    // Write your code here\n}', functionName: 'lengthOfLongestSubstringKDistinct' },
      { language: 'python', code: 'def length_of_longest_substring_k_distinct(s, k):\n    # Write your code here\n    pass', functionName: 'length_of_longest_substring_k_distinct' }
    ],
    acceptanceRate: 45
  },
  {
    number: 172, title: 'Count of Smaller Numbers After Self', slug: 'count-smaller-numbers-after-self', difficulty: 'hard',
    category: 'Sorting', tags: ['Array', 'Binary Search', 'Divide and Conquer', 'Binary Indexed Tree', 'Merge Sort'], companies: ['Google', 'Amazon', 'Facebook'],
    skillLevel: 9, topicDepth: 'advanced',
    description: 'Given an integer array `nums`, return an integer array `counts` where `counts[i]` is the number of smaller elements to the right of `nums[i]`.',
    constraints: [{ description: '1 <= nums.length <= 10^5' }, { description: '-10^4 <= nums[i] <= 10^4' }],
    examples: [
      { input: 'nums = [5,2,6,1]', output: '[2,1,1,0]', explanation: '5→[2,1] (2 smaller), 2→[1] (1 smaller), 6→[1] (1 smaller), 1→[] (0 smaller).' },
      { input: 'nums = [-1]', output: '[0]' },
      { input: 'nums = [-1,-1]', output: '[0,0]' }
    ],
    testCases: [
      { input: { nums: [5,2,6,1] }, expectedOutput: [2,1,1,0], isHidden: false },
      { input: { nums: [-1] }, expectedOutput: [0], isHidden: false },
      { input: { nums: [-1,-1] }, expectedOutput: [0,0], isHidden: true },
      { input: { nums: [2,0,1] }, expectedOutput: [2,0,0], isHidden: true }
    ],
    hints: [
      { order: 1, text: 'Merge sort: count inversions during the merge step.' },
      { order: 2, text: 'Binary Indexed Tree (Fenwick Tree) with coordinate compression.' },
      { order: 3, text: 'Process from right to left; query prefix sum for smaller values.' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function countSmaller(nums) {\n    // Write your code here\n}', functionName: 'countSmaller' },
      { language: 'python', code: 'def count_smaller(nums):\n    # Write your code here\n    pass', functionName: 'count_smaller' }
    ],
    acceptanceRate: 43
  },
  {
    number: 173, title: 'Shortest Path in a Grid with Obstacles Elimination', slug: 'shortest-path-obstacles-elimination', difficulty: 'hard',
    category: 'Breadth-First Search', tags: ['Array', 'Breadth-First Search', 'Matrix'], companies: ['Google', 'Amazon', 'DoorDash'],
    skillLevel: 8, topicDepth: 'advanced',
    description: 'You are given an `m x n` grid where each cell is `0` (empty) or `1` (obstacle). You can eliminate at most `k` obstacles.\n\nReturn the minimum number of steps to walk from `(0,0)` to `(m-1,n-1)`. Return `-1` if impossible.',
    constraints: [{ description: '1 <= m, n <= 40' }, { description: '1 <= k <= m*n' }, { description: "grid[i][j] is 0 or 1" }],
    examples: [
      { input: 'grid = [[0,0,0],[1,1,0],[0,0,0],[0,1,1],[0,0,0]], k = 1', output: '6', explanation: 'Go around the obstacles in 6 steps.' },
      { input: 'grid = [[0,1,1],[1,1,1],[1,0,0]], k = 1', output: '-1' }
    ],
    testCases: [
      { input: { grid: [[0,0,0],[1,1,0],[0,0,0],[0,1,1],[0,0,0]], k: 1 }, expectedOutput: 6, isHidden: false },
      { input: { grid: [[0,1,1],[1,1,1],[1,0,0]], k: 1 }, expectedOutput: -1, isHidden: false },
      { input: { grid: [[0,0],[0,0]], k: 0 }, expectedOutput: 2, isHidden: true }
    ],
    hints: [
      { order: 1, text: 'BFS where state = (row, col, remaining eliminations).' },
      { order: 2, text: 'Visited set must include the elimination count to avoid revisiting with more eliminations.' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function shortestPath(grid, k) {\n    // Write your code here\n}', functionName: 'shortestPath' },
      { language: 'python', code: 'def shortest_path(grid, k):\n    # Write your code here\n    pass', functionName: 'shortest_path' }
    ],
    acceptanceRate: 44
  },
  {
    number: 174, title: 'Russian Doll Envelopes', slug: 'russian-doll-envelopes', difficulty: 'hard',
    category: 'Sorting', tags: ['Array', 'Binary Search', 'Dynamic Programming', 'Sorting'], companies: ['Google', 'Uber', 'Amazon'],
    skillLevel: 9, topicDepth: 'advanced',
    description: 'You have envelopes represented as `envelopes[i] = [w, h]`. One envelope can fit inside another if and only if both width AND height of one is strictly greater than the other.\n\nReturn the **maximum number of envelopes** you can Russian doll (put one inside another).',
    constraints: [{ description: '1 <= envelopes.length <= 10^5' }, { description: 'envelopes[i].length == 2' }, { description: '1 <= wi, hi <= 10^5' }],
    examples: [
      { input: 'envelopes = [[5,4],[6,4],[6,7],[2,3]]', output: '3', explanation: '[2,3] → [5,4] → [6,7]' },
      { input: 'envelopes = [[1,1],[1,1],[1,1]]', output: '1' }
    ],
    testCases: [
      { input: { envelopes: [[5,4],[6,4],[6,7],[2,3]] }, expectedOutput: 3, isHidden: false },
      { input: { envelopes: [[1,1],[1,1],[1,1]] }, expectedOutput: 1, isHidden: false },
      { input: { envelopes: [[1,2],[2,3],[3,4]] }, expectedOutput: 3, isHidden: true }
    ],
    hints: [
      { order: 1, text: 'Sort by width ascending; for same width, sort by height DESCENDING.' },
      { order: 2, text: 'Then find LIS on heights — descending order for same width prevents fitting same-width envelopes.' },
      { order: 3, text: 'Use binary search (patience sorting) for O(n log n) LIS.' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function maxEnvelopes(envelopes) {\n    // Write your code here\n}', functionName: 'maxEnvelopes' },
      { language: 'python', code: 'def max_envelopes(envelopes):\n    # Write your code here\n    pass', functionName: 'max_envelopes' }
    ],
    acceptanceRate: 39
  },
  {
    number: 175, title: 'Remove Boxes', slug: 'remove-boxes', difficulty: 'hard',
    category: 'Dynamic Programming', tags: ['Array', 'Dynamic Programming', 'Memoization'], companies: ['Google', 'Amazon'],
    skillLevel: 10, topicDepth: 'expert',
    description: 'You are given several `boxes` with different colors represented by different positive numbers. Each time you can choose some continuous boxes with the same color (composed of `k` boxes, `k >= 1`), remove them and get `k * k` points.\n\nReturn the **maximum points** you can get.',
    constraints: [{ description: '1 <= boxes.length <= 100' }, { description: '1 <= boxes[i] <= 100' }],
    examples: [
      { input: 'boxes = [1,3,2,2,2,3,4,3,1]', output: '23', explanation: '...3+3+3 removed together for 9 points, etc.' },
      { input: 'boxes = [1,1,1]', output: '9' },
      { input: 'boxes = [1]', output: '1' }
    ],
    testCases: [
      { input: { boxes: [1,3,2,2,2,3,4,3,1] }, expectedOutput: 23, isHidden: false },
      { input: { boxes: [1,1,1] }, expectedOutput: 9, isHidden: false },
      { input: { boxes: [1] }, expectedOutput: 1, isHidden: true },
      { input: { boxes: [1,2,1] }, expectedOutput: 5, isHidden: true }
    ],
    hints: [
      { order: 1, text: 'dp[l][r][k] = max points from boxes[l..r] with k boxes identical to boxes[l] attached on the left.' },
      { order: 2, text: 'Either remove the k+1 identical boxes first, or find a matching box at index m and group them.' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function removeBoxes(boxes) {\n    // Write your code here\n}', functionName: 'removeBoxes' },
      { language: 'python', code: 'def remove_boxes(boxes):\n    # Write your code here\n    pass', functionName: 'remove_boxes' }
    ],
    acceptanceRate: 47
  },
  {
    number: 176, title: 'Minimum Number of Refueling Stops', slug: 'minimum-refueling-stops', difficulty: 'hard',
    category: 'Greedy', tags: ['Array', 'Dynamic Programming', 'Greedy', 'Heap (Priority Queue)'], companies: ['Amazon', 'Google'],
    skillLevel: 8, topicDepth: 'advanced',
    description: 'A car starts at `startFuel` and needs to reach `target` miles. Gas stations are at `stations[i] = [position, fuel]`.\n\nReturn the minimum number of refueling stops needed to reach `target`. Return `-1` if impossible.',
    constraints: [{ description: '1 <= target, startFuel <= 10^9' }, { description: '0 <= stations.length <= 500' }],
    examples: [
      { input: 'target=1, startFuel=1, stations=[]', output: '0' },
      { input: 'target=100, startFuel=1, stations=[[10,100]]', output: '-1' },
      { input: 'target=100, startFuel=10, stations=[[10,60],[20,30],[30,30],[60,40]]', output: '2' }
    ],
    testCases: [
      { input: { target: 1, startFuel: 1, stations: [] }, expectedOutput: 0, isHidden: false },
      { input: { target: 100, startFuel: 1, stations: [[10,100]] }, expectedOutput: -1, isHidden: false },
      { input: { target: 100, startFuel: 10, stations: [[10,60],[20,30],[30,30],[60,40]] }, expectedOutput: 2, isHidden: false },
      { input: { target: 100, startFuel: 100, stations: [] }, expectedOutput: 0, isHidden: true }
    ],
    hints: [
      { order: 1, text: 'Greedy with max-heap: when you run out of fuel, refuel at the largest previously passed station.' },
      { order: 2, text: 'Track all stations you\'ve passed but haven\'t refueled at.' },
      { order: 3, text: 'If heap is empty and you can\'t reach next station, return -1.' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function minRefuelStops(target, startFuel, stations) {\n    // Write your code here\n}', functionName: 'minRefuelStops' },
      { language: 'python', code: 'def min_refuel_stops(target, start_fuel, stations):\n    # Write your code here\n    pass', functionName: 'min_refuel_stops' }
    ],
    acceptanceRate: 38
  },
  {
    number: 177, title: 'Swim in Rising Water', slug: 'swim-rising-water', difficulty: 'hard',
    category: 'Graph', tags: ['Array', 'Binary Search', 'Depth-First Search', 'Breadth-First Search', 'Union Find', 'Heap', 'Matrix'], companies: ['Google', 'Amazon'],
    skillLevel: 8, topicDepth: 'advanced',
    description: 'You are given an `n x n` integer matrix `grid`. At time `t`, the water level is `t`. You can swim from cell `(r,c)` to adjacent cells if they have value <= current water level.\n\nReturn the **minimum time** to swim from top-left to bottom-right.',
    constraints: [{ description: 'n == grid.length == grid[i].length' }, { description: '1 <= n <= 50' }, { description: '0 <= grid[i][j] < n^2' }, { description: 'All values are unique.' }],
    examples: [
      { input: 'grid = [[0,2],[1,3]]', output: '3', explanation: 'At t=3, all cells are accessible.' },
      { input: 'grid = [[0,1,2,3,4],[24,23,22,21,5],[12,13,14,15,16],[11,17,18,19,20],[10,9,8,7,6]]', output: '16' }
    ],
    testCases: [
      { input: { grid: [[0,2],[1,3]] }, expectedOutput: 3, isHidden: false },
      { input: { grid: [[0,1,2,3,4],[24,23,22,21,5],[12,13,14,15,16],[11,17,18,19,20],[10,9,8,7,6]] }, expectedOutput: 16, isHidden: false },
      { input: { grid: [[0]] }, expectedOutput: 0, isHidden: true }
    ],
    hints: [
      { order: 1, text: 'Dijkstra\'s with min-heap: minimize the maximum value on the path.' },
      { order: 2, text: 'Binary search on t + BFS/DFS to check if path exists at water level t.' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function swimInWater(grid) {\n    // Write your code here\n}', functionName: 'swimInWater' },
      { language: 'python', code: 'def swim_in_water(grid):\n    # Write your code here\n    pass', functionName: 'swim_in_water' }
    ],
    acceptanceRate: 59
  },
  {
    number: 178, title: 'Longest Arithmetic Subsequence', slug: 'longest-arithmetic-subsequence', difficulty: 'hard',
    category: 'Dynamic Programming', tags: ['Array', 'Hash Table', 'Binary Search', 'Dynamic Programming'], companies: ['Amazon', 'Google', 'Adobe'],
    skillLevel: 8, topicDepth: 'advanced',
    description: 'Given an array `nums` of integers, return the **length of the longest arithmetic subsequence** in `nums`.\n\nA sequence is arithmetic if consecutive terms have a constant difference.',
    constraints: [{ description: '2 <= nums.length <= 1000' }, { description: '0 <= nums[i] <= 500' }],
    examples: [
      { input: 'nums = [3,6,9,12]', output: '4', explanation: 'The whole array is arithmetic with diff 3.' },
      { input: 'nums = [9,4,7,2,10]', output: '3', explanation: '[4,7,10] with diff 3.' },
      { input: 'nums = [20,1,15,3,10,5,8]', output: '4', explanation: '[20,15,10,5] with diff -5.' }
    ],
    testCases: [
      { input: { nums: [3,6,9,12] }, expectedOutput: 4, isHidden: false },
      { input: { nums: [9,4,7,2,10] }, expectedOutput: 3, isHidden: false },
      { input: { nums: [20,1,15,3,10,5,8] }, expectedOutput: 4, isHidden: false },
      { input: { nums: [1,2] }, expectedOutput: 2, isHidden: true }
    ],
    hints: [
      { order: 1, text: 'dp[i][diff] = length of longest AP ending at index i with given difference.' },
      { order: 2, text: 'Use a map per index to store differences seen.' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function longestArithSeqLength(nums) {\n    // Write your code here\n}', functionName: 'longestArithSeqLength' },
      { language: 'python', code: 'def longest_arith_seq_length(nums):\n    # Write your code here\n    pass', functionName: 'longest_arith_seq_length' }
    ],
    acceptanceRate: 52
  },
  {
    number: 179, title: 'Minimum Interval to Include Each Query', slug: 'minimum-interval-include-query', difficulty: 'hard',
    category: 'Sorting', tags: ['Array', 'Binary Search', 'Sorting', 'Heap (Priority Queue)'], companies: ['Google', 'Amazon'],
    skillLevel: 9, topicDepth: 'advanced',
    description: 'You are given a 2D integer array `intervals` where `intervals[i] = [left, right]` and an integer array `queries`.\n\nFor each query `q`, find the **smallest interval size** (right-left+1) among all intervals that contain `q`. Return -1 if no interval contains `q`.',
    constraints: [{ description: '1 <= intervals.length <= 10^5' }, { description: '1 <= queries.length <= 10^5' }, { description: '1 <= left <= right <= 10^7' }],
    examples: [
      { input: 'intervals = [[1,4],[2,4],[3,6],[4,4]], queries = [2,3,4,5]', output: '[3,3,1,4]', explanation: 'Query 2→[1,4] size 4 or [2,4] size 3 → min=3. Query 4→[4,4] size 1.' },
      { input: 'intervals = [[2,3],[2,5],[1,8],[20,25]], queries = [2,19,5,22]', output: '[2,-1,4,6]' }
    ],
    testCases: [
      { input: { intervals: [[1,4],[2,4],[3,6],[4,4]], queries: [2,3,4,5] }, expectedOutput: [3,3,1,4], isHidden: false },
      { input: { intervals: [[2,3],[2,5],[1,8],[20,25]], queries: [2,19,5,22] }, expectedOutput: [2,-1,4,6], isHidden: false }
    ],
    hints: [
      { order: 1, text: 'Sort intervals by left endpoint, sort queries too (keeping original indices).' },
      { order: 2, text: 'Use a min-heap sorted by interval size; add intervals whose left <= query.' },
      { order: 3, text: 'Remove intervals from heap whose right < query.' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function minInterval(intervals, queries) {\n    // Write your code here\n}', functionName: 'minInterval' },
      { language: 'python', code: 'def min_interval(intervals, queries):\n    # Write your code here\n    pass', functionName: 'min_interval' }
    ],
    acceptanceRate: 54
  },
  {
    number: 180, title: 'Stickers to Spell Word', slug: 'stickers-to-spell-word', difficulty: 'hard',
    category: 'Dynamic Programming', tags: ['Array', 'Hash Table', 'String', 'Dynamic Programming', 'Backtracking'], companies: ['Amazon', 'Google'],
    skillLevel: 9, topicDepth: 'advanced',
    description: 'We are given `n` different stickers. Each sticker has a lowercase English word on it. You can use each sticker more than once, and you may cut and rearrange letters.\n\nReturn the **minimum number of stickers** needed to spell the target string. Return -1 if impossible.',
    constraints: [{ description: '1 <= stickers.length <= 50' }, { description: '1 <= stickers[i].length <= 10' }, { description: '1 <= target.length <= 15' }],
    examples: [
      { input: 'stickers = ["with","example","science"], target = "thehat"', output: '3', explanation: 'Use "with" + "example" + "science".' },
      { input: 'stickers = ["notice","possible"], target = "basicbasic"', output: '-1' }
    ],
    testCases: [
      { input: { stickers: ['with','example','science'], target: 'thehat' }, expectedOutput: 3, isHidden: false },
      { input: { stickers: ['notice','possible'], target: 'basicbasic' }, expectedOutput: -1, isHidden: false },
      { input: { stickers: ['ab','bc'], target: 'abc' }, expectedOutput: 2, isHidden: true }
    ],
    hints: [
      { order: 1, text: 'Bitmask DP: dp[mask] = min stickers to cover characters represented by mask.' },
      { order: 2, text: 'State = bitmask of which target characters have been covered.' },
      { order: 3, text: 'For each sticker, apply it to the current state to get a new state.' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function minStickers(stickers, target) {\n    // Write your code here\n}', functionName: 'minStickers' },
      { language: 'python', code: 'def min_stickers(stickers, target):\n    # Write your code here\n    pass', functionName: 'min_stickers' }
    ],
    acceptanceRate: 48
  },
  {
    number: 181, title: 'Maximum Sum of 3 Non-Overlapping Subarrays', slug: 'max-sum-3-non-overlapping-subarrays', difficulty: 'hard',
    category: 'Dynamic Programming', tags: ['Array', 'Dynamic Programming'], companies: ['Google', 'Facebook'],
    skillLevel: 9, topicDepth: 'advanced',
    description: 'Given an integer array `nums` and integer `k`, find three non-overlapping subarrays of length `k` with maximum sum, and return their starting indices. If there are multiple answers, return the lexicographically smallest one.',
    constraints: [{ description: '1 <= nums.length <= 2 * 10^4' }, { description: '1 <= nums[i] < 2^16' }, { description: '1 <= k <= floor(nums.length/3)' }],
    examples: [
      { input: 'nums = [1,2,1,2,6,7,5,1], k = 2', output: '[0,3,5]', explanation: 'Subarrays [1,2], [2,6], [7,5] with sum 15.' },
      { input: 'nums = [1,2,1,2,1,2,1,2,1], k = 2', output: '[0,2,4]' }
    ],
    testCases: [
      { input: { nums: [1,2,1,2,6,7,5,1], k: 2 }, expectedOutput: [0,3,5], isHidden: false },
      { input: { nums: [1,2,1,2,1,2,1,2,1], k: 2 }, expectedOutput: [0,2,4], isHidden: false }
    ],
    hints: [
      { order: 1, text: 'Precompute sliding window sums of length k.' },
      { order: 2, text: 'Build left[i] = index of max sum window in nums[0..i].' },
      { order: 3, text: 'Build right[i] = index of max sum window in nums[i..end]. Enumerate middle window.' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function maxSumOfThreeSubarrays(nums, k) {\n    // Write your code here\n}', functionName: 'maxSumOfThreeSubarrays' },
      { language: 'python', code: 'def max_sum_of_three_subarrays(nums, k):\n    # Write your code here\n    pass', functionName: 'max_sum_of_three_subarrays' }
    ],
    acceptanceRate: 51
  },
  {
    number: 182, title: 'Minimum Difficulty of a Job Schedule', slug: 'minimum-difficulty-job-schedule', difficulty: 'hard',
    category: 'Dynamic Programming', tags: ['Array', 'Dynamic Programming'], companies: ['Amazon', 'Google'],
    skillLevel: 8, topicDepth: 'advanced',
    description: 'You want to schedule a list of jobs in `d` days. Jobs must be done in order. Each day you must do at least one job. The difficulty of a day = max difficulty job done that day. Total difficulty = sum of each day\'s difficulty.\n\nReturn minimum total difficulty, or -1 if impossible.',
    constraints: [{ description: '1 <= jobDifficulty.length <= 300' }, { description: '0 <= jobDifficulty[i] <= 1000' }, { description: '1 <= d <= 10' }],
    examples: [
      { input: 'jobDifficulty = [6,5,4,3,2,1], d = 2', output: '7', explanation: 'Day1:[6,5,4,3,2] (max=6), Day2:[1] (max=1). Total=7.' },
      { input: 'jobDifficulty = [9,9,9], d = 4', output: '-1' },
      { input: 'jobDifficulty = [1,1,1], d = 3', output: '3' }
    ],
    testCases: [
      { input: { jobDifficulty: [6,5,4,3,2,1], d: 2 }, expectedOutput: 7, isHidden: false },
      { input: { jobDifficulty: [9,9,9], d: 4 }, expectedOutput: -1, isHidden: false },
      { input: { jobDifficulty: [1,1,1], d: 3 }, expectedOutput: 3, isHidden: false },
      { input: { jobDifficulty: [11,111,22,222,33,333,44,444], d: 6 }, expectedOutput: 843, isHidden: true }
    ],
    hints: [
      { order: 1, text: 'dp[i][j] = min difficulty doing first i jobs in j days.' },
      { order: 2, text: 'Transition: choose a cut point k where day j ends, max of jobs[k..i] is that day\'s difficulty.' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function minDifficulty(jobDifficulty, d) {\n    // Write your code here\n}', functionName: 'minDifficulty' },
      { language: 'python', code: 'def min_difficulty(job_difficulty, d):\n    # Write your code here\n    pass', functionName: 'min_difficulty' }
    ],
    acceptanceRate: 58
  },
  {
    number: 183, title: 'Frog Jump', slug: 'frog-jump', difficulty: 'hard',
    category: 'Dynamic Programming', tags: ['Array', 'Dynamic Programming'], companies: ['Google', 'Amazon', 'Microsoft'],
    skillLevel: 8, topicDepth: 'advanced',
    description: 'A frog is at stone index 0 and wants to reach the last stone. It can jump `k-1`, `k`, or `k+1` units (where `k` is the previous jump). First jump is always 1.\n\nReturn whether the frog can reach the last stone.',
    constraints: [{ description: '2 <= stones.length <= 2000' }, { description: '0 <= stones[i] <= 2^31 - 1' }, { description: 'stones[0] == 0' }],
    examples: [
      { input: 'stones = [0,1,3,5,6,8,12,17]', output: 'true', explanation: 'The frog can jump: 1,2,2,3,3,4,5.' },
      { input: 'stones = [0,1,2,3,4,8,9,11]', output: 'false', explanation: 'Cannot cross the gap from 4 to 8.' }
    ],
    testCases: [
      { input: { stones: [0,1,3,5,6,8,12,17] }, expectedOutput: true, isHidden: false },
      { input: { stones: [0,1,2,3,4,8,9,11] }, expectedOutput: false, isHidden: false },
      { input: { stones: [0,1] }, expectedOutput: true, isHidden: true }
    ],
    hints: [
      { order: 1, text: 'Use a HashMap: stone → set of possible jump sizes to reach it.' },
      { order: 2, text: 'For each stone and each possible jump k, try reaching stone + k-1/k/k+1.' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function canCross(stones) {\n    // Write your code here\n}', functionName: 'canCross' },
      { language: 'python', code: 'def can_cross(stones):\n    # Write your code here\n    pass', functionName: 'can_cross' }
    ],
    acceptanceRate: 44
  },
  {
    number: 184, title: 'Zuma Game', slug: 'zuma-game', difficulty: 'hard',
    category: 'Dynamic Programming', tags: ['String', 'Dynamic Programming', 'Memoization'], companies: ['Google'],
    skillLevel: 10, topicDepth: 'expert',
    description: 'You have a row of colored `board` balls and `hand` balls. You can insert hand balls anywhere. When 3+ consecutive balls of the same color appear, they disappear.\n\nReturn the minimum number of hand balls to clear the board. Return -1 if impossible.',
    constraints: [{ description: '1 <= board.length <= 16' }, { description: '1 <= hand.length <= 5' }, { description: 'board and hand consist of characters R, Y, B, G, W.' }],
    examples: [
      { input: 'board = "WRRBBW", hand = "RB"', output: '-1' },
      { input: 'board = "WWRRBBWW", hand = "WRBRW"', output: '2' },
      { input: 'board = "G", hand = "GGGGG"', output: '2' }
    ],
    testCases: [
      { input: { board: 'WRRBBW', hand: 'RB' }, expectedOutput: -1, isHidden: false },
      { input: { board: 'WWRRBBWW', hand: 'WRBRW' }, expectedOutput: 2, isHidden: false },
      { input: { board: 'G', hand: 'GGGGG' }, expectedOutput: 2, isHidden: false }
    ],
    hints: [
      { order: 1, text: 'DFS + memoization on (board_state, hand_state).' },
      { order: 2, text: 'Try inserting each hand ball at each position in the board.' },
      { order: 3, text: 'After each insertion, collapse groups of 3+ immediately.' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function findMinStep(board, hand) {\n    // Write your code here\n}', functionName: 'findMinStep' },
      { language: 'python', code: 'def find_min_step(board, hand):\n    # Write your code here\n    pass', functionName: 'find_min_step' }
    ],
    acceptanceRate: 32
  },
  {
    number: 185, title: 'Palindrome Pairs', slug: 'palindrome-pairs', difficulty: 'hard',
    category: 'Hash Table', tags: ['Array', 'Hash Table', 'String', 'Trie'], companies: ['Google', 'Airbnb', 'Amazon'],
    skillLevel: 9, topicDepth: 'advanced',
    description: 'Given a list of unique strings `words`, return all pairs of **distinct indices** `(i, j)` such that the concatenation `words[i] + words[j]` is a palindrome.',
    constraints: [{ description: '1 <= words.length <= 5000' }, { description: '0 <= words[i].length <= 300' }, { description: 'words[i] consists of lowercase English letters.' }],
    examples: [
      { input: 'words = ["abcd","dcba","lls","s","sssll"]', output: '[[0,1],[1,0],[3,2],[2,4]]' },
      { input: 'words = ["bat","tab","cat"]', output: '[[0,1],[1,0]]' }
    ],
    testCases: [
      { input: { words: ['abcd','dcba','lls','s','sssll'] }, expectedOutput: [[0,1],[1,0],[3,2],[2,4]], isHidden: false },
      { input: { words: ['bat','tab','cat'] }, expectedOutput: [[0,1],[1,0]], isHidden: false },
      { input: { words: ['a',''] }, expectedOutput: [[0,1],[1,0]], isHidden: true }
    ],
    hints: [
      { order: 1, text: 'For each word, check if reverse exists in a hashmap.' },
      { order: 2, text: 'Case 1: if reverse(word) exists and is different, it\'s a pair.' },
      { order: 3, text: 'Case 2: if a prefix of word is palindrome and reverse of suffix exists, form a pair. Vice versa for suffix.' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function palindromePairs(words) {\n    // Write your code here\n}', functionName: 'palindromePairs' },
      { language: 'python', code: 'def palindrome_pairs(words):\n    # Write your code here\n    pass', functionName: 'palindrome_pairs' }
    ],
    acceptanceRate: 35
  },
  {
    number: 186, title: 'Concatenated Words', slug: 'concatenated-words', difficulty: 'hard',
    category: 'Dynamic Programming', tags: ['Array', 'String', 'Dynamic Programming', 'Depth-First Search', 'Trie'], companies: ['Google', 'Amazon'],
    skillLevel: 8, topicDepth: 'advanced',
    description: 'Given an array of strings `words` (without duplicates), return all the **concatenated words** in the given list of words. A concatenated word is defined as a string that is comprised entirely of at least two shorter words in the given array.',
    constraints: [{ description: '1 <= words.length <= 10^4' }, { description: '1 <= words[i].length <= 30' }, { description: 'words[i] consists of lowercase letters only.' }],
    examples: [
      { input: 'words = ["cat","cats","catsdogcats","dog","dogcatsdog","hippopotamuses","rat","ratcatdogcat"]', output: '["catsdogcats","dogcatsdog","ratcatdogcat"]' },
      { input: 'words = ["cat","dog","catdog"]', output: '["catdog"]' }
    ],
    testCases: [
      { input: { words: ['cat','cats','catsdogcats','dog','dogcatsdog','hippopotamuses','rat','ratcatdogcat'] }, expectedOutput: ['catsdogcats','dogcatsdog','ratcatdogcat'], isHidden: false },
      { input: { words: ['cat','dog','catdog'] }, expectedOutput: ['catdog'], isHidden: false }
    ],
    hints: [
      { order: 1, text: 'Sort words by length. For each word, check if it can be formed from shorter words.' },
      { order: 2, text: 'Use DP (similar to Word Break) for each word against the word set.' },
      { order: 3, text: 'Must use at least 2 words (word cannot form itself).' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function findAllConcatenatedWordsInADict(words) {\n    // Write your code here\n}', functionName: 'findAllConcatenatedWordsInADict' },
      { language: 'python', code: 'def find_all_concatenated_words_in_a_dict(words):\n    # Write your code here\n    pass', functionName: 'find_all_concatenated_words_in_a_dict' }
    ],
    acceptanceRate: 60
  },
  {
    number: 187, title: 'Minimum Cost to Hire K Workers', slug: 'minimum-cost-hire-k-workers', difficulty: 'hard',
    category: 'Greedy', tags: ['Array', 'Greedy', 'Sorting', 'Heap (Priority Queue)'], companies: ['Google', 'Amazon', 'Uber'],
    skillLevel: 9, topicDepth: 'advanced',
    description: 'There are `n` workers. `quality[i]` is the worker\'s quality and `wage[i]` is the minimum wage. To hire a group of `k` workers:\n1. Every worker must be paid at least their minimum wage.\n2. Pay must be proportional to quality (same wage/quality ratio for all).\n\nReturn the minimum cost to hire exactly `k` workers.',
    constraints: [{ description: 'n == quality.length == wage.length' }, { description: '1 <= k <= n <= 10^4' }, { description: '1 <= quality[i], wage[i] <= 10^4' }],
    examples: [
      { input: 'quality = [10,20,5], wage = [70,50,30], k = 2', output: '105.00000', explanation: 'Hire workers 0 and 2 at ratio 7: pay 70 and 35.' },
      { input: 'quality = [3,1,10,10,1], wage = [4,8,2,2,7], k = 3', output: '30.66667' }
    ],
    testCases: [
      { input: { quality: [10,20,5], wage: [70,50,30], k: 2 }, expectedOutput: 105.0, isHidden: false },
      { input: { quality: [3,1,10,10,1], wage: [4,8,2,2,7], k: 3 }, expectedOutput: 30.66667, isHidden: false }
    ],
    hints: [
      { order: 1, text: 'Key insight: when paying group at ratio r, total cost = r * sum(qualities).' },
      { order: 2, text: 'Sort by wage/quality ratio. For each worker as the highest-ratio worker, pick k-1 others with smallest quality.' },
      { order: 3, text: 'Use a max-heap of size k to maintain k smallest qualities seen so far.' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function mincostToHireWorkers(quality, wage, k) {\n    // Write your code here\n}', functionName: 'mincostToHireWorkers' },
      { language: 'python', code: 'def mincost_to_hire_workers(quality, wage, k):\n    # Write your code here\n    pass', functionName: 'mincost_to_hire_workers' }
    ],
    acceptanceRate: 52
  },
  {
    number: 188, title: 'Minimum Number of Days to Disconnect Island', slug: 'min-days-disconnect-island', difficulty: 'hard',
    category: 'Depth-First Search', tags: ['Array', 'Depth-First Search', 'Breadth-First Search', 'Matrix', 'Strongly Connected Component'], companies: ['Google', 'Amazon'],
    skillLevel: 9, topicDepth: 'advanced',
    description: 'Given a binary grid `grid` (0=water, 1=land), return the minimum number of days to disconnect the island (have more than 1 island or 0 islands).\n\nEach day you can change any land cell to water.',
    constraints: [{ description: '1 <= grid.length, grid[i].length <= 30' }, { description: "grid[i][j] is 0 or 1." }],
    examples: [
      { input: 'grid = [[0,1,1,0],[0,1,1,0],[0,0,0,0]]', output: '2' },
      { input: 'grid = [[1,1]]', output: '2' }
    ],
    testCases: [
      { input: { grid: [[0,1,1,0],[0,1,1,0],[0,0,0,0]] }, expectedOutput: 2, isHidden: false },
      { input: { grid: [[1,1]] }, expectedOutput: 2, isHidden: false },
      { input: { grid: [[1,0,1,0]] }, expectedOutput: 0, isHidden: true }
    ],
    hints: [
      { order: 1, text: 'Answer is always 0, 1, or 2. Check these in order.' },
      { order: 2, text: '0 days: already disconnected (count islands != 1).' },
      { order: 3, text: '1 day: find an articulation point. 2 days: always works if 1 day doesn\'t.' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function minDays(grid) {\n    // Write your code here\n}', functionName: 'minDays' },
      { language: 'python', code: 'def min_days(grid):\n    # Write your code here\n    pass', functionName: 'min_days' }
    ],
    acceptanceRate: 55
  },
  {
    number: 189, title: 'Count Different Palindromic Subsequences', slug: 'count-palindromic-subsequences', difficulty: 'hard',
    category: 'Dynamic Programming', tags: ['String', 'Dynamic Programming'], companies: ['Google', 'Amazon'],
    skillLevel: 10, topicDepth: 'expert',
    description: 'Given a string `s`, return the number of different non-empty palindromic subsequences in `s`. Since the answer may be very large, return it modulo `10^9 + 7`.\n\nA subsequence can be non-contiguous. Two palindromes are different if they have different characters at some position.',
    constraints: [{ description: '1 <= s.length <= 1000' }, { description: 's consists of only \'a\', \'b\', \'c\', \'d\'.' }],
    examples: [
      { input: 's = "bccb"', output: '6', explanation: '"b", "c", "bb", "cc", "bcb", "bccb" — 6 palindromes.' },
      { input: 's = "abcdabcdabcdabcdabcdabcdabcdabcddcbadcbadcbadcbadcbadcbadcbadcba"', output: '104860361' }
    ],
    testCases: [
      { input: { s: 'bccb' }, expectedOutput: 6, isHidden: false },
      { input: { s: 'a' }, expectedOutput: 1, isHidden: true },
      { input: { s: 'aab' }, expectedOutput: 4, isHidden: true }
    ],
    hints: [
      { order: 1, text: 'dp[i][j] = number of distinct palindromic subsequences in s[i..j].' },
      { order: 2, text: 'For each character c in {a,b,c,d}, find its leftmost and rightmost occurrence in [i,j].' },
      { order: 3, text: 'dp[i][j] = sum over chars of: dp[l+1][r-1] + 2 (or +1 or +1 if l==r or not found).' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function countPalindromicSubsequences(s) {\n    // Write your code here\n}', functionName: 'countPalindromicSubsequences' },
      { language: 'python', code: 'def count_palindromic_subsequences(s):\n    # Write your code here\n    pass', functionName: 'count_palindromic_subsequences' }
    ],
    acceptanceRate: 45
  },
  {
    number: 190, title: 'Race Car', slug: 'race-car', difficulty: 'hard',
    category: 'Dynamic Programming', tags: ['Dynamic Programming'], companies: ['Google', 'Amazon'],
    skillLevel: 9, topicDepth: 'advanced',
    description: 'Your car starts at position 0 and speed +1 on an infinite number line. Instructions:\n- `A` (Accelerate): position += speed, speed *= 2.\n- `R` (Reverse): speed = -1 if speed > 0, else speed = 1 (position unchanged).\n\nReturn the **length of the shortest sequence** of instructions to reach target.',
    constraints: [{ description: '1 <= target <= 10^4' }],
    examples: [
      { input: 'target = 3', output: '2', explanation: '"AA": pos 0→1→3.' },
      { input: 'target = 6', output: '5', explanation: '"AAARA": pos 0→1→3→7→7→6.' }
    ],
    testCases: [
      { input: { target: 3 }, expectedOutput: 2, isHidden: false },
      { input: { target: 6 }, expectedOutput: 5, isHidden: false },
      { input: { target: 1 }, expectedOutput: 1, isHidden: true },
      { input: { target: 5 }, expectedOutput: 7, isHidden: true }
    ],
    hints: [
      { order: 1, text: 'BFS on (position, speed) state.' },
      { order: 2, text: 'DP: dp[t] = min instructions to reach t. dp[t] = dp[t - (2^k - 1)] + k + 1 (reverse).' },
      { order: 3, text: 'Also consider overshooting: reach 2^k-1 > t, then reverse and work back.' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function racecar(target) {\n    // Write your code here\n}', functionName: 'racecar' },
      { language: 'python', code: 'def racecar(target):\n    # Write your code here\n    pass', functionName: 'racecar' }
    ],
    acceptanceRate: 42
  },
  {
    number: 191, title: 'Number of Music Playlists', slug: 'number-music-playlists', difficulty: 'hard',
    category: 'Dynamic Programming', tags: ['Math', 'Dynamic Programming', 'Combinatorics'], companies: ['Google', 'Spotify'],
    skillLevel: 9, topicDepth: 'advanced',
    description: 'Your music app has `n` unique songs. You want a playlist of exactly `goal` songs such that:\n1. Every song is played at least once.\n2. A song can only be played again if `k` other songs have been played.\n\nReturn the number of possible playlists modulo `10^9 + 7`.',
    constraints: [{ description: '0 <= k < n <= goal <= 100' }],
    examples: [
      { input: 'goal=3, n=3, k=1', output: '6' },
      { input: 'goal=3, n=2, k=1', output: '6' },
      { input: 'goal=2, n=3, k=0', output: '6' }
    ],
    testCases: [
      { input: { goal: 3, n: 3, k: 1 }, expectedOutput: 6, isHidden: false },
      { input: { goal: 3, n: 2, k: 1 }, expectedOutput: 6, isHidden: false },
      { input: { goal: 2, n: 3, k: 0 }, expectedOutput: 6, isHidden: false }
    ],
    hints: [
      { order: 1, text: 'dp[i][j] = ways to make a playlist of i songs using exactly j unique songs.' },
      { order: 2, text: 'Add a new song: dp[i][j] = dp[i-1][j-1] * (n - (j-1)).' },
      { order: 3, text: 'Replay an old song: dp[i][j] += dp[i-1][j] * max(0, j - k).' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function numMusicPlaylists(goal, n, k) {\n    // Write your code here\n}', functionName: 'numMusicPlaylists' },
      { language: 'python', code: 'def num_music_playlists(goal, n, k):\n    # Write your code here\n    pass', functionName: 'num_music_playlists' }
    ],
    acceptanceRate: 53
  },
  {
    number: 192, title: 'Maximize Score After N Operations', slug: 'maximize-score-n-operations', difficulty: 'hard',
    category: 'Dynamic Programming', tags: ['Array', 'Math', 'Dynamic Programming', 'Backtracking', 'Bit Manipulation', 'Number Theory'], companies: ['Google', 'Amazon'],
    skillLevel: 9, topicDepth: 'advanced',
    description: 'You have `nums` which contains `2n` integers. In the `i`th operation (1-indexed), choose any 2 elements and get `i * gcd(a, b)` score.\n\nReturn the **maximum score** you can receive after performing `n` operations.',
    constraints: [{ description: '1 <= n <= 7' }, { description: 'nums.length == 2 * n' }, { description: '1 <= nums[i] <= 10^6' }],
    examples: [
      { input: 'nums = [1,2]', output: '1', explanation: '1 op: 1*gcd(1,2)=1.' },
      { input: 'nums = [3,4,6,8]', output: '11', explanation: 'Op1: 1*gcd(3,6)=3. Op2: 2*gcd(4,8)=8. Total=11.' },
      { input: 'nums = [1,2,3,4,5,6]', output: '14' }
    ],
    testCases: [
      { input: { nums: [1,2] }, expectedOutput: 1, isHidden: false },
      { input: { nums: [3,4,6,8] }, expectedOutput: 11, isHidden: false },
      { input: { nums: [1,2,3,4,5,6] }, expectedOutput: 14, isHidden: false }
    ],
    hints: [
      { order: 1, text: 'Bitmask DP: dp[mask] = max score using the elements indicated by mask.' },
      { order: 2, text: 'The operation number = popcount(mask)/2 + 1.' },
      { order: 3, text: 'Precompute GCDs for all pairs.' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function maxScore(nums) {\n    // Write your code here\n}', functionName: 'maxScore' },
      { language: 'python', code: 'def max_score(nums):\n    # Write your code here\n    pass', functionName: 'max_score' }
    ],
    acceptanceRate: 62
  },
  {
    number: 193, title: 'Minimum Operations to Make Array Continuous', slug: 'min-ops-array-continuous', difficulty: 'hard',
    category: 'Binary Search', tags: ['Array', 'Binary Search'], companies: ['Google', 'Amazon'],
    skillLevel: 8, topicDepth: 'advanced',
    description: 'You are given an integer array `nums`. In one operation, you can replace any element with any integer.\n\nAn array is **continuous** if all values are distinct and the difference between max and min is `n - 1`.\n\nReturn the minimum number of operations to make `nums` continuous.',
    constraints: [{ description: '1 <= nums.length <= 10^5' }, { description: '1 <= nums[i] <= 10^9' }],
    examples: [
      { input: 'nums = [4,2,5,3]', output: '0', explanation: 'Already [2,3,4,5] when sorted.' },
      { input: 'nums = [1,2,3,5,6]', output: '1', explanation: 'Change 6 to 4.' },
      { input: 'nums = [1,10,100,1000]', output: '3' }
    ],
    testCases: [
      { input: { nums: [4,2,5,3] }, expectedOutput: 0, isHidden: false },
      { input: { nums: [1,2,3,5,6] }, expectedOutput: 1, isHidden: false },
      { input: { nums: [1,10,100,1000] }, expectedOutput: 3, isHidden: false },
      { input: { nums: [8,5,9,9,8,4] }, expectedOutput: 2, isHidden: true }
    ],
    hints: [
      { order: 1, text: 'Sort and deduplicate. For each element as the start, binary search for how many existing elements fit in [start, start+n-1].' },
      { order: 2, text: 'Answer = n - (max elements that can stay in some window of size n).' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function minOperations(nums) {\n    // Write your code here\n}', functionName: 'minOperations' },
      { language: 'python', code: 'def min_operations(nums):\n    # Write your code here\n    pass', functionName: 'min_operations' }
    ],
    acceptanceRate: 52
  },
  {
    number: 194, title: 'Minimum Number of Taps to Open to Water a Garden', slug: 'min-taps-water-garden', difficulty: 'hard',
    category: 'Greedy', tags: ['Array', 'Dynamic Programming', 'Greedy'], companies: ['Google', 'Amazon'],
    skillLevel: 8, topicDepth: 'advanced',
    description: 'There is a garden from position 0 to position `n`. There are `n+1` taps at positions `0, 1, ..., n`. `ranges[i]` means tap `i` can water `[i-ranges[i], i+ranges[i]]`.\n\nReturn the minimum number of taps needed to water the whole garden. Return -1 if impossible.',
    constraints: [{ description: '1 <= n <= 10^4' }, { description: 'ranges.length == n + 1' }, { description: '0 <= ranges[i] <= 100' }],
    examples: [
      { input: 'n=5, ranges=[3,4,1,1,0,0]', output: '1', explanation: 'Tap 1 with range 4 covers [−3,5] → whole garden [0,5].' },
      { input: 'n=3, ranges=[0,0,0,0]', output: '-1' }
    ],
    testCases: [
      { input: { n: 5, ranges: [3,4,1,1,0,0] }, expectedOutput: 1, isHidden: false },
      { input: { n: 3, ranges: [0,0,0,0] }, expectedOutput: -1, isHidden: false },
      { input: { n: 7, ranges: [1,2,1,0,2,1,0,1] }, expectedOutput: 3, isHidden: true }
    ],
    hints: [
      { order: 1, text: 'Convert each tap to interval [i-ranges[i], i+ranges[i]], clamped to [0,n].' },
      { order: 2, text: 'This reduces to "Minimum Number of Intervals to Cover [0,n]" — a classic greedy.' },
      { order: 3, text: 'Sort by start, greedily pick the interval that extends farthest.' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function minTaps(n, ranges) {\n    // Write your code here\n}', functionName: 'minTaps' },
      { language: 'python', code: 'def min_taps(n, ranges):\n    # Write your code here\n    pass', functionName: 'min_taps' }
    ],
    acceptanceRate: 48
  },
  {
    number: 195, title: 'Find K-th Smallest Pair Distance', slug: 'kth-smallest-pair-distance', difficulty: 'hard',
    category: 'Binary Search', tags: ['Array', 'Two Pointers', 'Binary Search', 'Sorting'], companies: ['Google', 'Amazon', 'Uber'],
    skillLevel: 9, topicDepth: 'advanced',
    description: 'Given an integer array `nums` and an integer `k`, return the `k`th smallest distance among all pairs `(nums[i], nums[j])` where `0 <= i < j < nums.length`. The distance of a pair is `|nums[i] - nums[j]|`.',
    constraints: [{ description: 'n == nums.length' }, { description: '2 <= n <= 10^4' }, { description: '0 <= nums[i] <= 10^6' }, { description: '1 <= k <= n*(n-1)/2' }],
    examples: [
      { input: 'nums = [1,3,1], k = 1', output: '0', explanation: 'Distances: |1-3|=2, |1-1|=0, |3-1|=2. Smallest is 0.' },
      { input: 'nums = [1,1,1], k = 2', output: '0' },
      { input: 'nums = [1,6,1], k = 3', output: '5' }
    ],
    testCases: [
      { input: { nums: [1,3,1], k: 1 }, expectedOutput: 0, isHidden: false },
      { input: { nums: [1,1,1], k: 2 }, expectedOutput: 0, isHidden: false },
      { input: { nums: [1,6,1], k: 3 }, expectedOutput: 5, isHidden: false },
      { input: { nums: [1,2,3,4], k: 4 }, expectedOutput: 2, isHidden: true }
    ],
    hints: [
      { order: 1, text: 'Binary search on the answer (distance value).' },
      { order: 2, text: 'For a given mid distance, count pairs with distance <= mid using two pointers on sorted array.' },
      { order: 3, text: 'Find the smallest distance where count >= k.' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function smallestDistancePair(nums, k) {\n    // Write your code here\n}', functionName: 'smallestDistancePair' },
      { language: 'python', code: 'def smallest_distance_pair(nums, k):\n    # Write your code here\n    pass', functionName: 'smallest_distance_pair' }
    ],
    acceptanceRate: 36
  },
  {
    number: 196, title: 'Campus Bikes II', slug: 'campus-bikes-ii', difficulty: 'hard',
    category: 'Dynamic Programming', tags: ['Array', 'Dynamic Programming', 'Backtracking', 'Bit Manipulation'], companies: ['Google', 'Lyft'],
    skillLevel: 9, topicDepth: 'advanced',
    description: 'On a campus represented as a 2D grid, there are `n` workers and `m` bikes. The Manhattan distance between worker `i` and bike `j` is `|xi-xj| + |yi-yj|`.\n\nAssign each worker one bike such that the **sum of Manhattan distances** is minimized. Return the minimum sum.',
    constraints: [{ description: '0 <= workers.length <= 1024' }, { description: '0 <= bikes.length <= 1024' }, { description: 'workers.length <= bikes.length' }],
    examples: [
      { input: 'workers = [[0,0],[2,1]], bikes = [[1,2],[3,3]]', output: '6', explanation: 'Worker 0 → Bike 0 (dist 3), Worker 1 → Bike 1 (dist 3). Total = 6.' },
      { input: 'workers = [[0,0],[1,1],[2,0]], bikes = [[1,0],[2,2],[2,1]]', output: '4' }
    ],
    testCases: [
      { input: { workers: [[0,0],[2,1]], bikes: [[1,2],[3,3]] }, expectedOutput: 6, isHidden: false },
      { input: { workers: [[0,0],[1,1],[2,0]], bikes: [[1,0],[2,2],[2,1]] }, expectedOutput: 4, isHidden: false }
    ],
    hints: [
      { order: 1, text: 'Bitmask DP: dp[mask] = min distance when bikes indicated by mask are assigned.' },
      { order: 2, text: 'Worker index = popcount(mask) (next worker to assign).' },
      { order: 3, text: 'For each unassigned bike in mask, try assigning it to current worker.' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function assignBikes(workers, bikes) {\n    // Write your code here\n}', functionName: 'assignBikes' },
      { language: 'python', code: 'def assign_bikes(workers, bikes):\n    # Write your code here\n    pass', functionName: 'assign_bikes' }
    ],
    acceptanceRate: 59
  },
  {
    number: 197, title: 'Maximum Gap', slug: 'maximum-gap', difficulty: 'hard',
    category: 'Sorting', tags: ['Array', 'Sorting', 'Bucket Sort'], companies: ['Amazon', 'Google'],
    skillLevel: 8, topicDepth: 'advanced',
    description: 'Given an integer array `nums`, return the **maximum difference between two successive elements** in its sorted form. If the array contains less than two elements, return 0.\n\nYou must write an algorithm that runs in linear time and uses linear extra space.',
    constraints: [{ description: '1 <= nums.length <= 10^5' }, { description: '0 <= nums[i] <= 10^9' }],
    examples: [
      { input: 'nums = [3,6,9,1]', output: '3', explanation: 'Sorted: [1,3,6,9]. Max gap = max(3-1,6-3,9-6) = 3.' },
      { input: 'nums = [10]', output: '0' }
    ],
    testCases: [
      { input: { nums: [3,6,9,1] }, expectedOutput: 3, isHidden: false },
      { input: { nums: [10] }, expectedOutput: 0, isHidden: false },
      { input: { nums: [1,1000000000] }, expectedOutput: 999999999, isHidden: true },
      { input: { nums: [1,3,6,9,1] }, expectedOutput: 3, isHidden: true }
    ],
    hints: [
      { order: 1, text: 'Bucket sort / radix sort for O(n) time.' },
      { order: 2, text: 'Key insight: with n elements over range [min,max], max gap >= (max-min)/(n-1) by pigeonhole.' },
      { order: 3, text: 'Create n-1 buckets; the max gap must cross a bucket boundary.' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function maximumGap(nums) {\n    // Write your code here\n}', functionName: 'maximumGap' },
      { language: 'python', code: 'def maximum_gap(nums):\n    # Write your code here\n    pass', functionName: 'maximum_gap' }
    ],
    acceptanceRate: 43
  },
  {
    number: 198, title: 'Minimum Moves to Reach Target with Rotations', slug: 'min-moves-reach-target-rotations', difficulty: 'hard',
    category: 'Breadth-First Search', tags: ['Array', 'Breadth-First Search', 'Matrix'], companies: ['Google', 'Amazon'],
    skillLevel: 9, topicDepth: 'advanced',
    description: 'In an `n x n` grid (0=empty, 1=blocked), a snake starts at `(0,0)-(0,1)` horizontal and wants to reach `(n-1,n-2)-(n-1,n-1)`. Each move: slide right, down, or rotate 90°.\n\nReturn the minimum number of moves. Return -1 if impossible.',
    constraints: [{ description: '2 <= n <= 100' }, { description: "grid[i][j] is 0 or 1" }, { description: 'grid[0][0] = grid[0][1] = 0' }, { description: 'grid[n-1][n-2] = grid[n-1][n-1] = 0' }],
    examples: [
      { input: 'grid = [[0,0,0,0,0,1],[1,1,0,0,1,0],[0,0,0,0,1,1],[0,0,1,0,1,0],[0,1,1,0,0,0],[0,1,1,0,0,0]]', output: '11' },
      { input: 'grid = [[0,0,1,1,1,1],[0,0,0,0,1,1],[1,1,0,0,0,1],[1,1,1,0,0,1],[1,1,1,0,0,1],[1,1,1,0,0,0]]', output: '9' }
    ],
    testCases: [
      { input: { grid: [[0,0,0,0,0,1],[1,1,0,0,1,0],[0,0,0,0,1,1],[0,0,1,0,1,0],[0,1,1,0,0,0],[0,1,1,0,0,0]] }, expectedOutput: 11, isHidden: false },
      { input: { grid: [[0,0,1,1,1,1],[0,0,0,0,1,1],[1,1,0,0,0,1],[1,1,1,0,0,1],[1,1,1,0,0,1],[1,1,1,0,0,0]] }, expectedOutput: 9, isHidden: false }
    ],
    hints: [
      { order: 1, text: 'BFS on state (row, col, direction) where direction is horizontal or vertical.' },
      { order: 2, text: 'For horizontal snake at (r,c): can move right, down, or rotate clockwise.' },
      { order: 3, text: 'For vertical snake at (r,c): can move down, right, or rotate counter-clockwise.' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function minimumMoves(grid) {\n    // Write your code here\n}', functionName: 'minimumMoves' },
      { language: 'python', code: 'def minimum_moves(grid):\n    # Write your code here\n    pass', functionName: 'minimum_moves' }
    ],
    acceptanceRate: 43
  },
  {
    number: 199, title: 'Stone Game V', slug: 'stone-game-v', difficulty: 'hard',
    category: 'Dynamic Programming', tags: ['Array', 'Math', 'Dynamic Programming', 'Game Theory'], companies: ['Google', 'Amazon'],
    skillLevel: 9, topicDepth: 'advanced',
    description: 'There are several stones arranged in a row. Alice and Bob take turns, with Alice first. On each turn, the current player splits the row into two non-empty parts, and the other player scores the sum of the smaller part (or either part if equal). The current player then continues on the smaller part.\n\nReturn the **maximum score** Alice can get.',
    constraints: [{ description: '1 <= stoneValue.length <= 500' }, { description: '1 <= stoneValue[i] <= 1000' }],
    examples: [
      { input: 'stoneValue = [6,2,3,4,5,5]', output: '18', explanation: 'Alice scores 2+3=5, Bob scores 4+5+5=14... optimal play gives Alice 18.' },
      { input: 'stoneValue = [7,7,7,7,7,7,7]', output: '28' },
      { input: 'stoneValue = [4]', output: '0' }
    ],
    testCases: [
      { input: { stoneValue: [6,2,3,4,5,5] }, expectedOutput: 18, isHidden: false },
      { input: { stoneValue: [7,7,7,7,7,7,7] }, expectedOutput: 28, isHidden: false },
      { input: { stoneValue: [4] }, expectedOutput: 0, isHidden: false }
    ],
    hints: [
      { order: 1, text: 'dp[i][j] = max score from stones[i..j].' },
      { order: 2, text: 'Try every split point k. Left sum < right sum → score += left sum + dp[i][k].' },
      { order: 3, text: 'Use prefix sums for O(1) range sum queries.' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function stoneGameV(stoneValue) {\n    // Write your code here\n}', functionName: 'stoneGameV' },
      { language: 'python', code: 'def stone_game_v(stone_value):\n    # Write your code here\n    pass', functionName: 'stone_game_v' }
    ],
    acceptanceRate: 46
  },
  {
    number: 200, title: 'Minimum Cost to Cut a Stick', slug: 'minimum-cost-cut-stick', difficulty: 'hard',
    category: 'Dynamic Programming', tags: ['Array', 'Dynamic Programming'], companies: ['Google', 'Amazon', 'Microsoft'],
    skillLevel: 9, topicDepth: 'advanced',
    description: 'You have a wooden stick of length `n`. The stick has positions labeled from `0` to `n`. Given an array `cuts` where `cuts[i]` denotes a position you must cut, you can make cuts in any order. The cost of a cut is the length of the stick being cut.\n\nReturn the **minimum total cost** of all cuts.',
    constraints: [{ description: '2 <= n <= 10^6' }, { description: '1 <= cuts.length <= min(n-1, 100)' }, { description: '1 <= cuts[i] <= n-1' }, { description: 'All cuts are distinct.' }],
    examples: [
      { input: 'n=7, cuts=[1,3,4,5]', output: '16', explanation: 'Optimal cut order: 3(cost7), 5(cost4→wrong), see DP.' },
      { input: 'n=9, cuts=[5,6,1,4,2]', output: '22' }
    ],
    testCases: [
      { input: { n: 7, cuts: [1,3,4,5] }, expectedOutput: 16, isHidden: false },
      { input: { n: 9, cuts: [5,6,1,4,2] }, expectedOutput: 22, isHidden: false },
      { input: { n: 4, cuts: [2] }, expectedOutput: 4, isHidden: true }
    ],
    hints: [
      { order: 1, text: 'Sort cuts and add 0 and n as boundaries.' },
      { order: 2, text: 'Interval DP: dp[i][j] = min cost to make all cuts between cuts[i] and cuts[j].' },
      { order: 3, text: 'Cost of cutting at position k = cuts[j] - cuts[i] (length of current stick).' }
    ],
    starterCode: [
      { language: 'javascript', code: 'function minCost(n, cuts) {\n    // Write your code here\n}', functionName: 'minCost' },
      { language: 'python', code: 'def min_cost(n, cuts):\n    # Write your code here\n    pass', functionName: 'min_cost' }
    ],
    acceptanceRate: 62
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

  console.log(`\n✅ Batch 4 done! Added: ${added}, Skipped: ${skipped}`);
  await mongoose.disconnect();
}

if (require.main === module) {
  seed().catch(err => { console.error(err); process.exit(1); });
}

module.exports = { challenges };
