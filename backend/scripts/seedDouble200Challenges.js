require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const CodingChallenge = require('../models/CodingChallenge');

const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/seek_platform';

// Additional 100 challenges to reach 200 total
const newChallenges = [
  // GRAPH CHALLENGES (15)
  {
    title: 'Number of Islands',
    category: 'Graph',
    difficulty: 'medium',
    skillLevel: 5,
    topicDepth: 'intermediate',
    description: 'Count the number of islands in a 2D grid where 1 represents land and 0 represents water.',
    problemStatement: 'Given an m x n 2D binary grid which represents a map of "1"s (land) and "0"s (water), return the number of islands.',
    starterCode: {
      python: 'def numIslands(grid):\n    # Your code here\n    pass',
      javascript: 'function numIslands(grid) {\n    // Your code here\n}',
      java: 'public int numIslands(char[][] grid) {\n    // Your code here\n}',
      cpp: 'int numIslands(vector<vector<char>>& grid) {\n    // Your code here\n}'
    },
    testCases: [
      { input: [[["1","1","0"],["1","1","0"],["0","0","1"]]], expectedOutput: 2, isHidden: false }
    ],
    tags: ['Graph', 'DFS', 'BFS', 'Union Find'],
    points: 50
  },
  {
    title: 'Clone Graph',
    category: 'Graph',
    difficulty: 'medium',
    skillLevel: 6,
    topicDepth: 'intermediate',
    description: 'Deep clone an undirected graph.',
    problemStatement: 'Given a reference of a node in a connected undirected graph, return a deep copy of the graph.',
    starterCode: {
      python: 'def cloneGraph(node):\n    # Your code here\n    pass',
      javascript: 'function cloneGraph(node) {\n    // Your code here\n}'
    },
    testCases: [
      { input: [[[2,4],[1,3],[2,4],[1,3]]], expectedOutput: [[2,4],[1,3],[2,4],[1,3]], isHidden: false }
    ],
    tags: ['Graph', 'DFS', 'BFS', 'Hash Table'],
    points: 50
  },
  {
    title: 'Course Schedule',
    category: 'Graph',
    difficulty: 'medium',
    skillLevel: 6,
    topicDepth: 'intermediate',
    description: 'Determine if you can finish all courses given prerequisites.',
    problemStatement: 'There are numCourses courses. Some have prerequisites. Return true if you can finish all courses.',
    starterCode: {
      python: 'def canFinish(numCourses, prerequisites):\n    # Your code here\n    pass',
      javascript: 'function canFinish(numCourses, prerequisites) {\n    // Your code here\n}'
    },
    testCases: [
      { input: [2, [[1,0]]], expectedOutput: true, isHidden: false }
    ],
    tags: ['Graph', 'Topological Sort', 'DFS', 'BFS'],
    points: 50
  },
  {
    title: 'Pacific Atlantic Water Flow',
    category: 'Graph',
    difficulty: 'medium',
    skillLevel: 6,
    topicDepth: 'intermediate',
    description: 'Find cells where water can flow to both Pacific and Atlantic oceans.',
    problemStatement: 'Given heights matrix, find coordinates where water can flow to both oceans.',
    starterCode: {
      python: 'def pacificAtlantic(heights):\n    # Your code here\n    pass',
      javascript: 'function pacificAtlantic(heights) {\n    // Your code here\n}'
    },
    testCases: [
      { input: [[[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]], expectedOutput: [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]], isHidden: false }
    ],
    tags: ['Graph', 'DFS', 'BFS', 'Matrix'],
    points: 60
  },
  {
    title: 'Graph Valid Tree',
    category: 'Graph',
    difficulty: 'medium',
    skillLevel: 5,
    topicDepth: 'intermediate',
    description: 'Determine if edges form a valid tree.',
    problemStatement: 'Given n nodes and edges, return true if they form a valid tree.',
    starterCode: {
      python: 'def validTree(n, edges):\n    # Your code here\n    pass',
      javascript: 'function validTree(n, edges) {\n    // Your code here\n}'
    },
    testCases: [
      { input: [5, [[0,1],[0,2],[0,3],[1,4]]], expectedOutput: true, isHidden: false }
    ],
    tags: ['Graph', 'Union Find', 'DFS', 'BFS'],
    points: 50
  },
  {
    title: 'Word Ladder',
    category: 'Graph',
    difficulty: 'hard',
    skillLevel: 8,
    topicDepth: 'advanced',
    description: 'Find shortest transformation sequence from beginWord to endWord.',
    problemStatement: 'Transform beginWord to endWord changing one letter at a time using words from wordList.',
    starterCode: {
      python: 'def ladderLength(beginWord, endWord, wordList):\n    # Your code here\n    pass',
      javascript: 'function ladderLength(beginWord, endWord, wordList) {\n    // Your code here\n}'
    },
    testCases: [
      { input: ["hit", "cog", ["hot","dot","dog","lot","log","cog"]], expectedOutput: 5, isHidden: false }
    ],
    tags: ['Graph', 'BFS', 'Hash Table'],
    points: 80
  },
  {
    title: 'Alien Dictionary',
    category: 'Graph',
    difficulty: 'hard',
    skillLevel: 9,
    topicDepth: 'expert',
    description: 'Derive the order of characters in an alien language.',
    problemStatement: 'Given a sorted dictionary of alien language words, find the character order.',
    starterCode: {
      python: 'def alienOrder(words):\n    # Your code here\n    pass',
      javascript: 'function alienOrder(words) {\n    // Your code here\n}'
    },
    testCases: [
      { input: [["wrt","wrf","er","ett","rftt"]], expectedOutput: "wertf", isHidden: false }
    ],
    tags: ['Graph', 'Topological Sort', 'DFS'],
    points: 90
  },
  {
    title: 'Network Delay Time',
    category: 'Graph',
    difficulty: 'medium',
    skillLevel: 6,
    topicDepth: 'intermediate',
    description: 'Find time for signal to reach all nodes.',
    problemStatement: 'Given network of nodes and travel times, find minimum time for all nodes to receive signal.',
    starterCode: {
      python: 'def networkDelayTime(times, n, k):\n    # Your code here\n    pass',
      javascript: 'function networkDelayTime(times, n, k) {\n    // Your code here\n}'
    },
    testCases: [
      { input: [[[2,1,1],[2,3,1],[3,4,1]], 4, 2], expectedOutput: 2, isHidden: false }
    ],
    tags: ['Graph', 'Dijkstra', 'Shortest Path'],
    points: 60
  },
  {
    title: 'Reconstruct Itinerary',
    category: 'Graph',
    difficulty: 'hard',
    skillLevel: 8,
    topicDepth: 'advanced',
    description: 'Reconstruct travel itinerary from tickets.',
    problemStatement: 'Given airline tickets, reconstruct the itinerary in lexical order.',
    starterCode: {
      python: 'def findItinerary(tickets):\n    # Your code here\n    pass',
      javascript: 'function findItinerary(tickets) {\n    // Your code here\n}'
    },
    testCases: [
      { input: [[["MUC","LHR"],["JFK","MUC"],["SFO","SJC"],["LHR","SFO"]]], expectedOutput: ["JFK","MUC","LHR","SFO","SJC"], isHidden: false }
    ],
    tags: ['Graph', 'Eulerian Path', 'DFS'],
    points: 80
  },
  {
    title: 'Minimum Height Trees',
    category: 'Graph',
    difficulty: 'medium',
    skillLevel: 7,
    topicDepth: 'advanced',
    description: 'Find root labels of minimum height trees.',
    problemStatement: 'Given tree graph, find all roots that give minimum height trees.',
    starterCode: {
      python: 'def findMinHeightTrees(n, edges):\n    # Your code here\n    pass',
      javascript: 'function findMinHeightTrees(n, edges) {\n    // Your code here\n}'
    },
    testCases: [
      { input: [4, [[1,0],[1,2],[1,3]]], expectedOutput: [1], isHidden: false }
    ],
    tags: ['Graph', 'BFS', 'Topological Sort'],
    points: 70
  },
  {
    title: 'Critical Connections',
    category: 'Graph',
    difficulty: 'hard',
    skillLevel: 9,
    topicDepth: 'expert',
    description: 'Find critical connections in a network.',
    problemStatement: 'Find all critical connections (bridges) that disconnect the network if removed.',
    starterCode: {
      python: 'def criticalConnections(n, connections):\n    # Your code here\n    pass',
      javascript: 'function criticalConnections(n, connections) {\n    // Your code here\n}'
    },
    testCases: [
      { input: [4, [[0,1],[1,2],[2,0],[1,3]]], expectedOutput: [[1,3]], isHidden: false }
    ],
    tags: ['Graph', 'DFS', 'Bridges'],
    points: 90
  },
  {
    title: 'Shortest Path in Binary Matrix',
    category: 'Graph',
    difficulty: 'medium',
    skillLevel: 5,
    topicDepth: 'intermediate',
    description: 'Find shortest path in binary matrix.',
    problemStatement: 'Find shortest clear path from top-left to bottom-right in binary matrix.',
    starterCode: {
      python: 'def shortestPathBinaryMatrix(grid):\n    # Your code here\n    pass',
      javascript: 'function shortestPathBinaryMatrix(grid) {\n    // Your code here\n}'
    },
    testCases: [
      { input: [[[0,1],[1,0]]], expectedOutput: 2, isHidden: false }
    ],
    tags: ['Graph', 'BFS', 'Matrix'],
    points: 50
  },
  {
    title: 'Cheapest Flights Within K Stops',
    category: 'Graph',
    difficulty: 'medium',
    skillLevel: 7,
    topicDepth: 'advanced',
    description: 'Find cheapest flight price with at most K stops.',
    problemStatement: 'Find cheapest price from src to dst with at most k stops.',
    starterCode: {
      python: 'def findCheapestPrice(n, flights, src, dst, k):\n    # Your code here\n    pass',
      javascript: 'function findCheapestPrice(n, flights, src, dst, k) {\n    // Your code here\n}'
    },
    testCases: [
      { input: [3, [[0,1,100],[1,2,100],[0,2,500]], 0, 2, 1], expectedOutput: 200, isHidden: false }
    ],
    tags: ['Graph', 'BFS', 'Dynamic Programming'],
    points: 70
  },
  {
    title: 'All Paths From Source to Target',
    category: 'Graph',
    difficulty: 'medium',
    skillLevel: 5,
    topicDepth: 'intermediate',
    description: 'Find all paths from source to target in DAG.',
    problemStatement: 'Given directed acyclic graph, find all paths from node 0 to node n-1.',
    starterCode: {
      python: 'def allPathsSourceTarget(graph):\n    # Your code here\n    pass',
      javascript: 'function allPathsSourceTarget(graph) {\n    // Your code here\n}'
    },
    testCases: [
      { input: [[[1,2],[3],[3],[]]], expectedOutput: [[0,1,3],[0,2,3]], isHidden: false }
    ],
    tags: ['Graph', 'DFS', 'Backtracking'],
    points: 50
  },
  {
    title: 'Parallel Courses',
    category: 'Graph',
    difficulty: 'medium',
    skillLevel: 6,
    topicDepth: 'intermediate',
    description: 'Find minimum semesters to finish all courses.',
    problemStatement: 'Given courses and prerequisites, find minimum semesters needed.',
    starterCode: {
      python: 'def minimumSemesters(n, relations):\n    # Your code here\n    pass',
      javascript: 'function minimumSemesters(n, relations) {\n    // Your code here\n}'
    },
    testCases: [
      { input: [3, [[1,3],[2,3]]], expectedOutput: 2, isHidden: false }
    ],
    tags: ['Graph', 'Topological Sort', 'BFS'],
    points: 60
  },

  // BACKTRACKING CHALLENGES (15)
  {
    title: 'Subsets',
    category: 'Backtracking',
    difficulty: 'medium',
    skillLevel: 4,
    topicDepth: 'intermediate',
    description: 'Generate all possible subsets of a set.',
    problemStatement: 'Given an integer array nums of unique elements, return all possible subsets.',
    starterCode: {
      python: 'def subsets(nums):\n    # Your code here\n    pass',
      javascript: 'function subsets(nums) {\n    // Your code here\n}'
    },
    testCases: [
      { input: [[1,2,3]], expectedOutput: [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]], isHidden: false }
    ],
    tags: ['Backtracking', 'Array', 'Bit Manipulation'],
    points: 40
  },
  {
    title: 'Permutations',
    category: 'Backtracking',
    difficulty: 'medium',
    skillLevel: 4,
    topicDepth: 'intermediate',
    description: 'Generate all possible permutations.',
    problemStatement: 'Given an array nums of distinct integers, return all possible permutations.',
    starterCode: {
      python: 'def permute(nums):\n    # Your code here\n    pass',
      javascript: 'function permute(nums) {\n    // Your code here\n}'
    },
    testCases: [
      { input: [[1,2,3]], expectedOutput: [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]], isHidden: false }
    ],
    tags: ['Backtracking', 'Array'],
    points: 40
  },
  {
    title: 'Combination Sum',
    category: 'Backtracking',
    difficulty: 'medium',
    skillLevel: 5,
    topicDepth: 'intermediate',
    description: 'Find all unique combinations that sum to target.',
    problemStatement: 'Given array of candidates and target, find all combinations where candidates sum to target.',
    starterCode: {
      python: 'def combinationSum(candidates, target):\n    # Your code here\n    pass',
      javascript: 'function combinationSum(candidates, target) {\n    // Your code here\n}'
    },
    testCases: [
      { input: [[2,3,6,7], 7], expectedOutput: [[2,2,3],[7]], isHidden: false }
    ],
    tags: ['Backtracking', 'Array'],
    points: 50
  },
  {
    title: 'N-Queens',
    category: 'Backtracking',
    difficulty: 'hard',
    skillLevel: 8,
    topicDepth: 'advanced',
    description: 'Place N queens on N×N chessboard so no two queens attack each other.',
    problemStatement: 'Return all distinct solutions to the n-queens puzzle.',
    starterCode: {
      python: 'def solveNQueens(n):\n    # Your code here\n    pass',
      javascript: 'function solveNQueens(n) {\n    // Your code here\n}'
    },
    testCases: [
      { input: [4], expectedOutput: [[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]], isHidden: false }
    ],
    tags: ['Backtracking', 'Chess'],
    points: 80
  },
  {
    title: 'Sudoku Solver',
    category: 'Backtracking',
    difficulty: 'hard',
    skillLevel: 8,
    topicDepth: 'advanced',
    description: 'Solve a Sudoku puzzle.',
    problemStatement: 'Write a program to solve a Sudoku puzzle by filling the empty cells.',
    starterCode: {
      python: 'def solveSudoku(board):\n    # Your code here\n    pass',
      javascript: 'function solveSudoku(board) {\n    // Your code here\n}'
    },
    testCases: [
      { input: [[["5","3",".",".","7",".",".",".","."]]], expectedOutput: [["5","3","4","6","7","8","9","1","2"]], isHidden: false }
    ],
    tags: ['Backtracking', 'Hash Table', 'Matrix'],
    points: 80
  },
  {
    title: 'Palindrome Partitioning',
    category: 'Backtracking',
    difficulty: 'medium',
    skillLevel: 6,
    topicDepth: 'intermediate',
    description: 'Partition string into palindromic substrings.',
    problemStatement: 'Given string s, partition s such that every substring is a palindrome.',
    starterCode: {
      python: 'def partition(s):\n    # Your code here\n    pass',
      javascript: 'function partition(s) {\n    // Your code here\n}'
    },
    testCases: [
      { input: ["aab"], expectedOutput: [["a","a","b"],["aa","b"]], isHidden: false }
    ],
    tags: ['Backtracking', 'String', 'Dynamic Programming'],
    points: 60
  },
  {
    title: 'Letter Combinations of Phone Number',
    category: 'Backtracking',
    difficulty: 'medium',
    skillLevel: 4,
    topicDepth: 'intermediate',
    description: 'Generate all letter combinations from phone digits.',
    problemStatement: 'Given string of digits, return all possible letter combinations.',
    starterCode: {
      python: 'def letterCombinations(digits):\n    # Your code here\n    pass',
      javascript: 'function letterCombinations(digits) {\n    // Your code here\n}'
    },
    testCases: [
      { input: ["23"], expectedOutput: ["ad","ae","af","bd","be","bf","cd","ce","cf"], isHidden: false }
    ],
    tags: ['Backtracking', 'String', 'Hash Table'],
    points: 40
  },
  {
    title: 'Word Search',
    category: 'Backtracking',
    difficulty: 'medium',
    skillLevel: 5,
    topicDepth: 'intermediate',
    description: 'Find if word exists in grid.',
    problemStatement: 'Given 2D board and word, find if word exists in the grid.',
    starterCode: {
      python: 'def exist(board, word):\n    # Your code here\n    pass',
      javascript: 'function exist(board, word) {\n    // Your code here\n}'
    },
    testCases: [
      { input: [[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCCED"], expectedOutput: true, isHidden: false }
    ],
    tags: ['Backtracking', 'Matrix', 'Array'],
    points: 50
  },
  {
    title: 'Remove Invalid Parentheses',
    category: 'Backtracking',
    difficulty: 'hard',
    skillLevel: 9,
    topicDepth: 'expert',
    description: 'Remove minimum invalid parentheses to make string valid.',
    problemStatement: 'Remove minimum number of parentheses to make input string valid.',
    starterCode: {
      python: 'def removeInvalidParentheses(s):\n    # Your code here\n    pass',
      javascript: 'function removeInvalidParentheses(s) {\n    // Your code here\n}'
    },
    testCases: [
      { input: ["()())()"], expectedOutput: ["(())()","()()()"], isHidden: false }
    ],
    tags: ['Backtracking', 'BFS', 'String'],
    points: 90
  },
  {
    title: 'Restore IP Addresses',
    category: 'Backtracking',
    difficulty: 'medium',
    skillLevel: 5,
    topicDepth: 'intermediate',
    description: 'Generate all valid IP addresses from string.',
    problemStatement: 'Given string containing only digits, restore all possible valid IP addresses.',
    starterCode: {
      python: 'def restoreIpAddresses(s):\n    # Your code here\n    pass',
      javascript: 'function restoreIpAddresses(s) {\n    // Your code here\n}'
    },
    testCases: [
      { input: ["25525511135"], expectedOutput: ["255.255.11.135","255.255.111.35"], isHidden: false }
    ],
    tags: ['Backtracking', 'String'],
    points: 50
  },
  {
    title: 'Partition to K Equal Sum Subsets',
    category: 'Backtracking',
    difficulty: 'medium',
    skillLevel: 7,
    topicDepth: 'advanced',
    description: 'Partition array into k subsets with equal sum.',
    problemStatement: 'Given array nums and k, return true if possible to divide into k subsets with equal sum.',
    starterCode: {
      python: 'def canPartitionKSubsets(nums, k):\n    # Your code here\n    pass',
      javascript: 'function canPartitionKSubsets(nums, k) {\n    // Your code here\n}'
    },
    testCases: [
      { input: [[4,3,2,3,5,2,1], 4], expectedOutput: true, isHidden: false }
    ],
    tags: ['Backtracking', 'Array', 'Dynamic Programming'],
    points: 70
  },
  {
    title: 'Beautiful Arrangement',
    category: 'Backtracking',
    difficulty: 'medium',
    skillLevel: 6,
    topicDepth: 'intermediate',
    description: 'Count number of beautiful arrangements.',
    problemStatement: 'Count permutations where each position i is divisible by nums[i] or vice versa.',
    starterCode: {
      python: 'def countArrangement(n):\n    # Your code here\n    pass',
      javascript: 'function countArrangement(n) {\n    // Your code here\n}'
    },
    testCases: [
      { input: [2], expectedOutput: 2, isHidden: false }
    ],
    tags: ['Backtracking', 'Bit Manipulation'],
    points: 60
  },
  {
    title: 'Gray Code',
    category: 'Backtracking',
    difficulty: 'medium',
    skillLevel: 5,
    topicDepth: 'intermediate',
    description: 'Generate n-bit Gray code sequence.',
    problemStatement: 'Return an n-bit gray code sequence.',
    starterCode: {
      python: 'def grayCode(n):\n    # Your code here\n    pass',
      javascript: 'function grayCode(n) {\n    // Your code here\n}'
    },
    testCases: [
      { input: [2], expectedOutput: [0,1,3,2], isHidden: false }
    ],
    tags: ['Backtracking', 'Bit Manipulation', 'Math'],
    points: 50
  },
  {
    title: 'Split Array into Fibonacci Sequence',
    category: 'Backtracking',
    difficulty: 'medium',
    skillLevel: 6,
    topicDepth: 'intermediate',
    description: 'Split string into Fibonacci-like sequence.',
    problemStatement: 'Given string num, split into Fibonacci-like sequence.',
    starterCode: {
      python: 'def splitIntoFibonacci(num):\n    # Your code here\n    pass',
      javascript: 'function splitIntoFibonacci(num) {\n    // Your code here\n}'
    },
    testCases: [
      { input: ["123456579"], expectedOutput: [123,456,579], isHidden: false }
    ],
    tags: ['Backtracking', 'String'],
    points: 60
  },
  {
    title: 'Expression Add Operators',
    category: 'Backtracking',
    difficulty: 'hard',
    skillLevel: 9,
    topicDepth: 'expert',
    description: 'Add operators to string to get target value.',
    problemStatement: 'Insert operators +, -, * between digits to evaluate to target.',
    starterCode: {
      python: 'def addOperators(num, target):\n    # Your code here\n    pass',
      javascript: 'function addOperators(num, target) {\n    // Your code here\n}'
    },
    testCases: [
      { input: ["123", 6], expectedOutput: ["1+2+3","1*2*3"], isHidden: false }
    ],
    tags: ['Backtracking', 'String', 'Math'],
    points: 90
  },

  // GREEDY CHALLENGES (10)
  {
    title: 'Jump Game II',
    category: 'Greedy',
    difficulty: 'medium',
    skillLevel: 5,
    topicDepth: 'intermediate',
    description: 'Find minimum jumps to reach last index.',
    problemStatement: 'Return minimum number of jumps to reach last index.',
    starterCode: {
      python: 'def jump(nums):\n    # Your code here\n    pass',
      javascript: 'function jump(nums) {\n    // Your code here\n}'
    },
    testCases: [
      { input: [[2,3,1,1,4]], expectedOutput: 2, isHidden: false }
    ],
    tags: ['Greedy', 'Array', 'Dynamic Programming'],
    points: 50
  },
  {
    title: 'Gas Station',
    category: 'Greedy',
    difficulty: 'medium',
    skillLevel: 6,
    topicDepth: 'intermediate',
    description: 'Find starting gas station for circular tour.',
    problemStatement: 'Return starting gas station index if you can travel around circuit.',
    starterCode: {
      python: 'def canCompleteCircuit(gas, cost):\n    # Your code here\n    pass',
      javascript: 'function canCompleteCircuit(gas, cost) {\n    // Your code here\n}'
    },
    testCases: [
      { input: [[1,2,3,4,5], [3,4,5,1,2]], expectedOutput: 3, isHidden: false }
    ],
    tags: ['Greedy', 'Array'],
    points: 60
  },
  {
    title: 'Candy',
    category: 'Greedy',
    difficulty: 'hard',
    skillLevel: 8,
    topicDepth: 'advanced',
    description: 'Distribute minimum candies based on ratings.',
    problemStatement: 'Distribute candies to children based on ratings such that higher rated gets more.',
    starterCode: {
      python: 'def candy(ratings):\n    # Your code here\n    pass',
      javascript: 'function candy(ratings) {\n    // Your code here\n}'
    },
    testCases: [
      { input: [[1,0,2]], expectedOutput: 5, isHidden: false }
    ],
    tags: ['Greedy', 'Array'],
    points: 80
  },
  {
    title: 'Task Scheduler',
    category: 'Greedy',
    difficulty: 'medium',
    skillLevel: 6,
    topicDepth: 'intermediate',
    description: 'Schedule tasks with cooling period.',
    problemStatement: 'Find minimum time to execute all tasks with n cooling period.',
    starterCode: {
      python: 'def leastInterval(tasks, n):\n    # Your code here\n    pass',
      javascript: 'function leastInterval(tasks, n) {\n    // Your code here\n}'
    },
    testCases: [
      { input: [["A","A","A","B","B","B"], 2], expectedOutput: 8, isHidden: false }
    ],
    tags: ['Greedy', 'Array', 'Hash Table'],
    points: 60
  },
  {
    title: 'Meeting Rooms II',
    category: 'Greedy',
    difficulty: 'medium',
    skillLevel: 5,
    topicDepth: 'intermediate',
    description: 'Find minimum meeting rooms required.',
    problemStatement: 'Given meeting time intervals, find minimum number of conference rooms.',
    starterCode: {
      python: 'def minMeetingRooms(intervals):\n    # Your code here\n    pass',
      javascript: 'function minMeetingRooms(intervals) {\n    // Your code here\n}'
    },
    testCases: [
      { input: [[[0,30],[5,10],[15,20]]], expectedOutput: 2, isHidden: false }
    ],
    tags: ['Greedy', 'Heap', 'Sorting'],
    points: 50
  },
  {
    title: 'Partition Labels',
    category: 'Greedy',
    difficulty: 'medium',
    skillLevel: 5,
    topicDepth: 'intermediate',
    description: 'Partition string into maximum parts.',
    problemStatement: 'Partition string so each letter appears in at most one part.',
    starterCode: {
      python: 'def partitionLabels(s):\n    # Your code here\n    pass',
      javascript: 'function partitionLabels(s) {\n    // Your code here\n}'
    },
    testCases: [
      { input: ["ababcbacadefegdehijhklij"], expectedOutput: [9,7,8], isHidden: false }
    ],
    tags: ['Greedy', 'String', 'Two Pointers'],
    points: 50
  },
  {
    title: 'Minimum Number of Arrows',
    category: 'Greedy',
    difficulty: 'medium',
    skillLevel: 5,
    topicDepth: 'intermediate',
    description: 'Find minimum arrows to burst all balloons.',
    problemStatement: 'Find minimum number of arrows to burst all balloons.',
    starterCode: {
      python: 'def findMinArrowShots(points):\n    # Your code here\n    pass',
      javascript: 'function findMinArrowShots(points) {\n    // Your code here\n}'
    },
    testCases: [
      { input: [[[10,16],[2,8],[1,6],[7,12]]], expectedOutput: 2, isHidden: false }
    ],
    tags: ['Greedy', 'Array', 'Sorting'],
    points: 50
  },
  {
    title: 'Non-overlapping Intervals',
    category: 'Greedy',
    difficulty: 'medium',
    skillLevel: 5,
    topicDepth: 'intermediate',
    description: 'Remove minimum intervals to make non-overlapping.',
    problemStatement: 'Find minimum number of intervals to remove to make rest non-overlapping.',
    starterCode: {
      python: 'def eraseOverlapIntervals(intervals):\n    # Your code here\n    pass',
      javascript: 'function eraseOverlapIntervals(intervals) {\n    // Your code here\n}'
    },
    testCases: [
      { input: [[[1,2],[2,3],[3,4],[1,3]]], expectedOutput: 1, isHidden: false }
    ],
    tags: ['Greedy', 'Array', 'Sorting'],
    points: 50
  },
  {
    title: 'Queue Reconstruction by Height',
    category: 'Greedy',
    difficulty: 'medium',
    skillLevel: 6,
    topicDepth: 'intermediate',
    description: 'Reconstruct queue by height.',
    problemStatement: 'Reconstruct queue where each person is [h, k].',
    starterCode: {
      python: 'def reconstructQueue(people):\n    # Your code here\n    pass',
      javascript: 'function reconstructQueue(people) {\n    // Your code here\n}'
    },
    testCases: [
      { input: [[[7,0],[4,4],[7,1],[5,0],[6,1],[5,2]]], expectedOutput: [[5,0],[7,0],[5,2],[6,1],[4,4],[7,1]], isHidden: false }
    ],
    tags: ['Greedy', 'Array', 'Sorting'],
    points: 60
  },
  {
    title: 'Advantage Shuffle',
    category: 'Greedy',
    difficulty: 'medium',
    skillLevel: 6,
    topicDepth: 'intermediate',
    description: 'Rearrange array to maximize advantage.',
    problemStatement: 'Rearrange nums1 to maximize advantage over nums2.',
    starterCode: {
      python: 'def advantageCount(nums1, nums2):\n    # Your code here\n    pass',
      javascript: 'function advantageCount(nums1, nums2) {\n    // Your code here\n}'
    },
    testCases: [
      { input: [[2,7,11,15], [1,10,4,11]], expectedOutput: [2,11,7,15], isHidden: false }
    ],
    tags: ['Greedy', 'Array', 'Sorting'],
    points: 60
  },

  // BINARY SEARCH CHALLENGES (10)
  {
    title: 'Search in Rotated Sorted Array',
    category: 'Binary Search',
    difficulty: 'medium',
    skillLevel: 5,
    topicDepth: 'intermediate',
    description: 'Search target in rotated sorted array.',
    problemStatement: 'Given rotated sorted array and target, return index or -1.',
    starterCode: {
      python: 'def search(nums, target):\n    # Your code here\n    pass',
      javascript: 'function search(nums, target) {\n    // Your code here\n}'
    },
    testCases: [
      { input: [[4,5,6,7,0,1,2], 0], expectedOutput: 4, isHidden: false }
    ],
    tags: ['Binary Search', 'Array'],
    points: 50
  },
  {
    title: 'Find First and Last Position',
    category: 'Binary Search',
    difficulty: 'medium',
    skillLevel: 4,
    topicDepth: 'intermediate',
    description: 'Find first and last position of element in sorted array.',
    problemStatement: 'Given sorted array, find starting and ending position of target.',
    starterCode: {
      python: 'def searchRange(nums, target):\n    # Your code here\n    pass',
      javascript: 'function searchRange(nums, target) {\n    // Your code here\n}'
    },
    testCases: [
      { input: [[5,7,7,8,8,10], 8], expectedOutput: [3,4], isHidden: false }
    ],
    tags: ['Binary Search', 'Array'],
    points: 40
  },
  {
    title: 'Search a 2D Matrix II',
    category: 'Binary Search',
    difficulty: 'medium',
    skillLevel: 5,
    topicDepth: 'intermediate',
    description: 'Search in row and column sorted matrix.',
    problemStatement: 'Search target in matrix where rows and columns are sorted.',
    starterCode: {
      python: 'def searchMatrix(matrix, target):\n    # Your code here\n    pass',
      javascript: 'function searchMatrix(matrix, target) {\n    // Your code here\n}'
    },
    testCases: [
      { input: [[[1,4,7,11,15],[2,5,8,12,19]], 5], expectedOutput: true, isHidden: false }
    ],
    tags: ['Binary Search', 'Matrix', 'Divide and Conquer'],
    points: 50
  },
  {
    title: 'Koko Eating Bananas',
    category: 'Binary Search',
    difficulty: 'medium',
    skillLevel: 6,
    topicDepth: 'intermediate',
    description: 'Find minimum eating speed to finish bananas in h hours.',
    problemStatement: 'Return minimum integer k such that Koko can eat all bananas within h hours.',
    starterCode: {
      python: 'def minEatingSpeed(piles, h):\n    # Your code here\n    pass',
      javascript: 'function minEatingSpeed(piles, h) {\n    // Your code here\n}'
    },
    testCases: [
      { input: [[3,6,7,11], 8], expectedOutput: 4, isHidden: false }
    ],
    tags: ['Binary Search', 'Array'],
    points: 60
  },
  {
    title: 'Capacity To Ship Packages',
    category: 'Binary Search',
    difficulty: 'medium',
    skillLevel: 6,
    topicDepth: 'intermediate',
    description: 'Find minimum capacity to ship all packages within days.',
    problemStatement: 'Find least weight capacity of ship to ship all packages within days.',
    starterCode: {
      python: 'def shipWithinDays(weights, days):\n    # Your code here\n    pass',
      javascript: 'function shipWithinDays(weights, days) {\n    // Your code here\n}'
    },
    testCases: [
      { input: [[1,2,3,4,5,6,7,8,9,10], 5], expectedOutput: 15, isHidden: false }
    ],
    tags: ['Binary Search', 'Array'],
    points: 60
  },
  {
    title: 'Split Array Largest Sum',
    category: 'Binary Search',
    difficulty: 'hard',
    skillLevel: 8,
    topicDepth: 'advanced',
    description: 'Minimize largest sum among m subarrays.',
    problemStatement: 'Split array into m non-empty subarrays to minimize largest sum.',
    starterCode: {
      python: 'def splitArray(nums, m):\n    # Your code here\n    pass',
      javascript: 'function splitArray(nums, m) {\n    // Your code here\n}'
    },
    testCases: [
      { input: [[7,2,5,10,8], 2], expectedOutput: 18, isHidden: false }
    ],
    tags: ['Binary Search', 'Array', 'Dynamic Programming'],
    points: 80
  },
  {
    title: 'Find K Closest Elements',
    category: 'Binary Search',
    difficulty: 'medium',
    skillLevel: 5,
    topicDepth: 'intermediate',
    description: 'Find k closest elements to x in sorted array.',
    problemStatement: 'Given sorted array, find k closest integers to x.',
    starterCode: {
      python: 'def findClosestElements(arr, k, x):\n    # Your code here\n    pass',
      javascript: 'function findClosestElements(arr, k, x) {\n    // Your code here\n}'
    },
    testCases: [
      { input: [[1,2,3,4,5], 4, 3], expectedOutput: [1,2,3,4], isHidden: false }
    ],
    tags: ['Binary Search', 'Two Pointers', 'Sorting'],
    points: 50
  },
  {
    title: 'Find Peak Element',
    category: 'Binary Search',
    difficulty: 'medium',
    skillLevel: 4,
    topicDepth: 'intermediate',
    description: 'Find peak element in array.',
    problemStatement: 'Find peak element where nums[i] > nums[i-1] and nums[i] > nums[i+1].',
    starterCode: {
      python: 'def findPeakElement(nums):\n    # Your code here\n    pass',
      javascript: 'function findPeakElement(nums) {\n    // Your code here\n}'
    },
    testCases: [
      { input: [[1,2,3,1]], expectedOutput: 2, isHidden: false }
    ],
    tags: ['Binary Search', 'Array'],
    points: 40
  },
  {
    title: 'Time Based Key-Value Store',
    category: 'Binary Search',
    difficulty: 'medium',
    skillLevel: 6,
    topicDepth: 'intermediate',
    description: 'Implement time-based key-value store.',
    problemStatement: 'Store key-value pairs with timestamps and retrieve values.',
    starterCode: {
      python: 'class TimeMap:\n    def __init__(self):\n        pass\n    def set(self, key, value, timestamp):\n        pass\n    def get(self, key, timestamp):\n        pass',
      javascript: 'class TimeMap {\n    constructor() {}\n    set(key, value, timestamp) {}\n    get(key, timestamp) {}\n}'
    },
    testCases: [
      { input: [["TimeMap","set","get"],[[],["foo","bar",1],["foo",1]]], expectedOutput: [null,null,"bar"], isHidden: false }
    ],
    tags: ['Binary Search', 'Hash Table', 'Design'],
    points: 60
  },
  {
    title: 'Sqrt(x)',
    category: 'Binary Search',
    difficulty: 'easy',
    skillLevel: 2,
    topicDepth: 'fundamental',
    description: 'Compute square root without using built-in function.',
    problemStatement: 'Return integer part of square root of x.',
    starterCode: {
      python: 'def mySqrt(x):\n    # Your code here\n    pass',
      javascript: 'function mySqrt(x) {\n    // Your code here\n}'
    },
    testCases: [
      { input: [8], expectedOutput: 2, isHidden: false }
    ],
    tags: ['Binary Search', 'Math'],
    points: 20
  },

  // TRIE CHALLENGES (5)
  {
    title: 'Implement Trie',
    category: 'Trie',
    difficulty: 'medium',
    skillLevel: 5,
    topicDepth: 'intermediate',
    description: 'Implement prefix tree data structure.',
    problemStatement: 'Implement Trie with insert, search, and startsWith operations.',
    starterCode: {
      python: 'class Trie:\n    def __init__(self):\n        pass\n    def insert(self, word):\n        pass\n    def search(self, word):\n        pass\n    def startsWith(self, prefix):\n        pass',
      javascript: 'class Trie {\n    constructor() {}\n    insert(word) {}\n    search(word) {}\n    startsWith(prefix) {}\n}'
    },
    testCases: [
      { input: [["Trie","insert","search"],[[],["apple"],["apple"]]], expectedOutput: [null,null,true], isHidden: false }
    ],
    tags: ['Trie', 'Design', 'Hash Table'],
    points: 50
  },
  {
    title: 'Word Search II',
    category: 'Trie',
    difficulty: 'hard',
    skillLevel: 9,
    topicDepth: 'expert',
    description: 'Find all words from dictionary in board.',
    problemStatement: 'Given board and list of words, find all words in the board.',
    starterCode: {
      python: 'def findWords(board, words):\n    # Your code here\n    pass',
      javascript: 'function findWords(board, words) {\n    // Your code here\n}'
    },
    testCases: [
      { input: [[["o","a","a","n"],["e","t","a","e"]], ["oath","pea","eat","rain"]], expectedOutput: ["eat","oath"], isHidden: false }
    ],
    tags: ['Trie', 'Backtracking', 'Matrix'],
    points: 90
  },
  {
    title: 'Design Add and Search Words',
    category: 'Trie',
    difficulty: 'medium',
    skillLevel: 6,
    topicDepth: 'intermediate',
    description: 'Design data structure supporting wildcard search.',
    problemStatement: 'Design data structure that supports adding words and searching with "." wildcard.',
    starterCode: {
      python: 'class WordDictionary:\n    def __init__(self):\n        pass\n    def addWord(self, word):\n        pass\n    def search(self, word):\n        pass',
      javascript: 'class WordDictionary {\n    constructor() {}\n    addWord(word) {}\n    search(word) {}\n}'
    },
    testCases: [
      { input: [["WordDictionary","addWord","search"],[[],["bad"],[".ad"]]], expectedOutput: [null,null,true], isHidden: false }
    ],
    tags: ['Trie', 'Design', 'DFS'],
    points: 60
  },
  {
    title: 'Replace Words',
    category: 'Trie',
    difficulty: 'medium',
    skillLevel: 5,
    topicDepth: 'intermediate',
    description: 'Replace words with shortest root.',
    problemStatement: 'Replace each word with shortest dictionary root that it starts with.',
    starterCode: {
      python: 'def replaceWords(dictionary, sentence):\n    # Your code here\n    pass',
      javascript: 'function replaceWords(dictionary, sentence) {\n    // Your code here\n}'
    },
    testCases: [
      { input: [["cat","bat","rat"], "the cattle was rattled by the battery"], expectedOutput: "the cat was rat by the bat", isHidden: false }
    ],
    tags: ['Trie', 'Hash Table', 'String'],
    points: 50
  },
  {
    title: 'Longest Word in Dictionary',
    category: 'Trie',
    difficulty: 'medium',
    skillLevel: 5,
    topicDepth: 'intermediate',
    description: 'Find longest word built one character at a time.',
    problemStatement: 'Return longest word that can be built one character at a time.',
    starterCode: {
      python: 'def longestWord(words):\n    # Your code here\n    pass',
      javascript: 'function longestWord(words) {\n    // Your code here\n}'
    },
    testCases: [
      { input: [["w","wo","wor","worl","world"]], expectedOutput: "world", isHidden: false }
    ],
    tags: ['Trie', 'Hash Table', 'String'],
    points: 50
  },

  // SLIDING WINDOW CHALLENGES (10)
  {
    title: 'Minimum Window Substring',
    category: 'Sliding Window',
    difficulty: 'hard',
    skillLevel: 9,
    topicDepth: 'expert',
    description: 'Find minimum window containing all characters of t.',
    problemStatement: 'Find minimum window in s which contains all characters in t.',
    starterCode: {
      python: 'def minWindow(s, t):\n    # Your code here\n    pass',
      javascript: 'function minWindow(s, t) {\n    // Your code here\n}'
    },
    testCases: [
      { input: ["ADOBECODEBANC", "ABC"], expectedOutput: "BANC", isHidden: false }
    ],
    tags: ['Sliding Window', 'String', 'Hash Table'],
    points: 90
  },
  {
    title: 'Longest Repeating Character Replacement',
    category: 'Sliding Window',
    difficulty: 'medium',
    skillLevel: 6,
    topicDepth: 'intermediate',
    description: 'Find longest substring with same letters after k replacements.',
    problemStatement: 'Find length of longest substring containing same letter after k replacements.',
    starterCode: {
      python: 'def characterReplacement(s, k):\n    # Your code here\n    pass',
      javascript: 'function characterReplacement(s, k) {\n    // Your code here\n}'
    },
    testCases: [
      { input: ["ABAB", 2], expectedOutput: 4, isHidden: false }
    ],
    tags: ['Sliding Window', 'String', 'Hash Table'],
    points: 60
  },
  {
    title: 'Permutation in String',
    category: 'Sliding Window',
    difficulty: 'medium',
    skillLevel: 5,
    topicDepth: 'intermediate',
    description: 'Check if s2 contains permutation of s1.',
    problemStatement: 'Return true if s2 contains permutation of s1.',
    starterCode: {
      python: 'def checkInclusion(s1, s2):\n    # Your code here\n    pass',
      javascript: 'function checkInclusion(s1, s2) {\n    // Your code here\n}'
    },
    testCases: [
      { input: ["ab", "eidbaooo"], expectedOutput: true, isHidden: false }
    ],
    tags: ['Sliding Window', 'String', 'Hash Table'],
    points: 50
  },
  {
    title: 'Find All Anagrams in String',
    category: 'Sliding Window',
    difficulty: 'medium',
    skillLevel: 5,
    topicDepth: 'intermediate',
    description: 'Find all anagram starting indices in s.',
    problemStatement: 'Return list of starting indices of p\'s anagrams in s.',
    starterCode: {
      python: 'def findAnagrams(s, p):\n    # Your code here\n    pass',
      javascript: 'function findAnagrams(s, p) {\n    // Your code here\n}'
    },
    testCases: [
      { input: ["cbaebabacd", "abc"], expectedOutput: [0,6], isHidden: false }
    ],
    tags: ['Sliding Window', 'String', 'Hash Table'],
    points: 50
  },
  {
    title: 'Longest Substring with At Most K Distinct',
    category: 'Sliding Window',
    difficulty: 'medium',
    skillLevel: 5,
    topicDepth: 'intermediate',
    description: 'Find longest substring with at most k distinct characters.',
    problemStatement: 'Return length of longest substring with at most k distinct characters.',
    starterCode: {
      python: 'def lengthOfLongestSubstringKDistinct(s, k):\n    # Your code here\n    pass',
      javascript: 'function lengthOfLongestSubstringKDistinct(s, k) {\n    // Your code here\n}'
    },
    testCases: [
      { input: ["eceba", 2], expectedOutput: 3, isHidden: false }
    ],
    tags: ['Sliding Window', 'String', 'Hash Table'],
    points: 50
  },
  {
    title: 'Max Consecutive Ones III',
    category: 'Sliding Window',
    difficulty: 'medium',
    skillLevel: 5,
    topicDepth: 'intermediate',
    description: 'Find max consecutive 1s after flipping at most k 0s.',
    problemStatement: 'Return max number of consecutive 1s after flipping at most k zeros.',
    starterCode: {
      python: 'def longestOnes(nums, k):\n    # Your code here\n    pass',
      javascript: 'function longestOnes(nums, k) {\n    // Your code here\n}'
    },
    testCases: [
      { input: [[1,1,1,0,0,0,1,1,1,1,0], 2], expectedOutput: 6, isHidden: false }
    ],
    tags: ['Sliding Window', 'Array'],
    points: 50
  },
  {
    title: 'Fruit Into Baskets',
    category: 'Sliding Window',
    difficulty: 'medium',
    skillLevel: 5,
    topicDepth: 'intermediate',
    description: 'Collect maximum fruits with 2 baskets.',
    problemStatement: 'Return total amount of fruit you can collect with 2 baskets.',
    starterCode: {
      python: 'def totalFruit(fruits):\n    # Your code here\n    pass',
      javascript: 'function totalFruit(fruits) {\n    // Your code here\n}'
    },
    testCases: [
      { input: [[1,2,1]], expectedOutput: 3, isHidden: false }
    ],
    tags: ['Sliding Window', 'Array', 'Hash Table'],
    points: 50
  },
  {
    title: 'Subarray Product Less Than K',
    category: 'Sliding Window',
    difficulty: 'medium',
    skillLevel: 4,
    topicDepth: 'intermediate',
    description: 'Count subarrays with product less than k.',
    problemStatement: 'Return number of contiguous subarrays with product less than k.',
    starterCode: {
      python: 'def numSubarrayProductLessThanK(nums, k):\n    # Your code here\n    pass',
      javascript: 'function numSubarrayProductLessThanK(nums, k) {\n    // Your code here\n}'
    },
    testCases: [
      { input: [[10,5,2,6], 100], expectedOutput: 8, isHidden: false }
    ],
    tags: ['Sliding Window', 'Array'],
    points: 40
  },
  {
    title: 'Minimum Size Subarray Sum',
    category: 'Sliding Window',
    difficulty: 'medium',
    skillLevel: 4,
    topicDepth: 'intermediate',
    description: 'Find minimum length subarray with sum >= target.',
    problemStatement: 'Return minimal length of subarray with sum >= target.',
    starterCode: {
      python: 'def minSubArrayLen(target, nums):\n    # Your code here\n    pass',
      javascript: 'function minSubArrayLen(target, nums) {\n    // Your code here\n}'
    },
    testCases: [
      { input: [7, [2,3,1,2,4,3]], expectedOutput: 2, isHidden: false }
    ],
    tags: ['Sliding Window', 'Array', 'Binary Search'],
    points: 40
  },
  {
    title: 'Grumpy Bookstore Owner',
    category: 'Sliding Window',
    difficulty: 'medium',
    skillLevel: 5,
    topicDepth: 'intermediate',
    description: 'Maximize satisfied customers with grumpy technique.',
    problemStatement: 'Maximize satisfied customers using grumpy technique for minutes.',
    starterCode: {
      python: 'def maxSatisfied(customers, grumpy, minutes):\n    # Your code here\n    pass',
      javascript: 'function maxSatisfied(customers, grumpy, minutes) {\n    // Your code here\n}'
    },
    testCases: [
      { input: [[1,0,1,2,1,1,7,5], [0,1,0,1,0,1,0,1], 3], expectedOutput: 16, isHidden: false }
    ],
    tags: ['Sliding Window', 'Array'],
    points: 50
  },

  // TWO POINTERS CHALLENGES (10)
  {
    title: 'Remove Duplicates from Sorted Array',
    category: 'Two Pointers',
    difficulty: 'easy',
    skillLevel: 1,
    topicDepth: 'fundamental',
    description: 'Remove duplicates in-place from sorted array.',
    problemStatement: 'Remove duplicates from sorted array in-place and return new length.',
    starterCode: {
      python: 'def removeDuplicates(nums):\n    # Your code here\n    pass',
      javascript: 'function removeDuplicates(nums) {\n    // Your code here\n}'
    },
    testCases: [
      { input: [[1,1,2]], expectedOutput: 2, isHidden: false }
    ],
    tags: ['Two Pointers', 'Array'],
    points: 10
  },
  {
    title: 'Move Zeroes',
    category: 'Two Pointers',
    difficulty: 'easy',
    skillLevel: 2,
    topicDepth: 'fundamental',
    description: 'Move all zeros to end maintaining order.',
    problemStatement: 'Move all 0s to end while maintaining relative order of non-zero elements.',
    starterCode: {
      python: 'def moveZeroes(nums):\n    # Your code here\n    pass',
      javascript: 'function moveZeroes(nums) {\n    // Your code here\n}'
    },
    testCases: [
      { input: [[0,1,0,3,12]], expectedOutput: [1,3,12,0,0], isHidden: false }
    ],
    tags: ['Two Pointers', 'Array'],
    points: 20
  },
  {
    title: 'Three Sum Closest',
    category: 'Two Pointers',
    difficulty: 'medium',
    skillLevel: 5,
    topicDepth: 'intermediate',
    description: 'Find three integers closest to target.',
    problemStatement: 'Return sum of three integers closest to target.',
    starterCode: {
      python: 'def threeSumClosest(nums, target):\n    # Your code here\n    pass',
      javascript: 'function threeSumClosest(nums, target) {\n    // Your code here\n}'
    },
    testCases: [
      { input: [[-1,2,1,-4], 1], expectedOutput: 2, isHidden: false }
    ],
    tags: ['Two Pointers', 'Array', 'Sorting'],
    points: 50
  },
  {
    title: 'Trapping Rain Water',
    category: 'Two Pointers',
    difficulty: 'hard',
    skillLevel: 8,
    topicDepth: 'advanced',
    description: 'Calculate trapped rainwater.',
    problemStatement: 'Compute how much water can be trapped after rain.',
    starterCode: {
      python: 'def trap(height):\n    # Your code here\n    pass',
      javascript: 'function trap(height) {\n    // Your code here\n}'
    },
    testCases: [
      { input: [[0,1,0,2,1,0,1,3,2,1,2,1]], expectedOutput: 6, isHidden: false }
    ],
    tags: ['Two Pointers', 'Array', 'Stack'],
    points: 80
  },
  {
    title: 'Boats to Save People',
    category: 'Two Pointers',
    difficulty: 'medium',
    skillLevel: 4,
    topicDepth: 'intermediate',
    description: 'Find minimum boats to carry people.',
    problemStatement: 'Return minimum number of boats to carry people within weight limit.',
    starterCode: {
      python: 'def numRescueBoats(people, limit):\n    # Your code here\n    pass',
      javascript: 'function numRescueBoats(people, limit) {\n    // Your code here\n}'
    },
    testCases: [
      { input: [[1,2], 3], expectedOutput: 1, isHidden: false }
    ],
    tags: ['Two Pointers', 'Array', 'Greedy'],
    points: 40
  },
  {
    title: 'Partition Labels',
    category: 'Two Pointers',
    difficulty: 'medium',
    skillLevel: 5,
    topicDepth: 'intermediate',
    description: 'Partition string into maximum parts.',
    problemStatement: 'Partition string so each letter appears in at most one part.',
    starterCode: {
      python: 'def partitionLabels(s):\n    # Your code here\n    pass',
      javascript: 'function partitionLabels(s) {\n    // Your code here\n}'
    },
    testCases: [
      { input: ["ababcbacadefegdehijhklij"], expectedOutput: [9,7,8], isHidden: false }
    ],
    tags: ['Two Pointers', 'String', 'Greedy'],
    points: 50
  },
  {
    title: 'Sort Colors',
    category: 'Two Pointers',
    difficulty: 'medium',
    skillLevel: 4,
    topicDepth: 'intermediate',
    description: 'Sort array with 0s, 1s, and 2s.',
    problemStatement: 'Sort array containing 0, 1, and 2 in-place.',
    starterCode: {
      python: 'def sortColors(nums):\n    # Your code here\n    pass',
      javascript: 'function sortColors(nums) {\n    // Your code here\n}'
    },
    testCases: [
      { input: [[2,0,2,1,1,0]], expectedOutput: [0,0,1,1,2,2], isHidden: false }
    ],
    tags: ['Two Pointers', 'Array', 'Sorting'],
    points: 40
  },
  {
    title: 'Valid Palindrome II',
    category: 'Two Pointers',
    difficulty: 'easy',
    skillLevel: 2,
    topicDepth: 'fundamental',
    description: 'Check palindrome after deleting at most one character.',
    problemStatement: 'Return true if string can become palindrome after deleting at most one character.',
    starterCode: {
      python: 'def validPalindrome(s):\n    # Your code here\n    pass',
      javascript: 'function validPalindrome(s) {\n    // Your code here\n}'
    },
    testCases: [
      { input: ["aba"], expectedOutput: true, isHidden: false }
    ],
    tags: ['Two Pointers', 'String'],
    points: 20
  },
  {
    title: 'Reverse String',
    category: 'Two Pointers',
    difficulty: 'easy',
    skillLevel: 1,
    topicDepth: 'fundamental',
    description: 'Reverse string in-place.',
    problemStatement: 'Reverse input string in-place with O(1) extra memory.',
    starterCode: {
      python: 'def reverseString(s):\n    # Your code here\n    pass',
      javascript: 'function reverseString(s) {\n    // Your code here\n}'
    },
    testCases: [
      { input: [["h","e","l","l","o"]], expectedOutput: ["o","l","l","e","h"], isHidden: false }
    ],
    tags: ['Two Pointers', 'String'],
    points: 10
  },
  {
    title: 'Reverse Vowels of String',
    category: 'Two Pointers',
    difficulty: 'easy',
    skillLevel: 2,
    topicDepth: 'fundamental',
    description: 'Reverse only vowels in string.',
    problemStatement: 'Reverse only the vowels of a string.',
    starterCode: {
      python: 'def reverseVowels(s):\n    # Your code here\n    pass',
      javascript: 'function reverseVowels(s) {\n    // Your code here\n}'
    },
    testCases: [
      { input: ["hello"], expectedOutput: "holle", isHidden: false }
    ],
    tags: ['Two Pointers', 'String'],
    points: 20
  },

  // INTERVALS CHALLENGES (5)
  {
    title: 'Insert Interval',
    category: 'Intervals',
    difficulty: 'medium',
    skillLevel: 5,
    topicDepth: 'intermediate',
    description: 'Insert new interval and merge if necessary.',
    problemStatement: 'Insert new interval into non-overlapping intervals and merge if needed.',
    starterCode: {
      python: 'def insert(intervals, newInterval):\n    # Your code here\n    pass',
      javascript: 'function insert(intervals, newInterval) {\n    // Your code here\n}'
    },
    testCases: [
      { input: [[[1,3],[6,9]], [2,5]], expectedOutput: [[1,5],[6,9]], isHidden: false }
    ],
    tags: ['Intervals', 'Array'],
    points: 50
  },
  {
    title: 'Meeting Rooms',
    category: 'Intervals',
    difficulty: 'easy',
    skillLevel: 2,
    topicDepth: 'fundamental',
    description: 'Check if person can attend all meetings.',
    problemStatement: 'Determine if person can attend all meetings.',
    starterCode: {
      python: 'def canAttendMeetings(intervals):\n    # Your code here\n    pass',
      javascript: 'function canAttendMeetings(intervals) {\n    // Your code here\n}'
    },
    testCases: [
      { input: [[[0,30],[5,10],[15,20]]], expectedOutput: false, isHidden: false }
    ],
    tags: ['Intervals', 'Array', 'Sorting'],
    points: 20
  },
  {
    title: 'Employee Free Time',
    category: 'Intervals',
    difficulty: 'hard',
    skillLevel: 8,
    topicDepth: 'advanced',
    description: 'Find common free time for all employees.',
    problemStatement: 'Return finite intervals representing common free time.',
    starterCode: {
      python: 'def employeeFreeTime(schedule):\n    # Your code here\n    pass',
      javascript: 'function employeeFreeTime(schedule) {\n    // Your code here\n}'
    },
    testCases: [
      { input: [[[[1,2],[5,6]],[[1,3]],[[4,10]]]], expectedOutput: [[3,4]], isHidden: false }
    ],
    tags: ['Intervals', 'Heap', 'Sorting'],
    points: 80
  },
  {
    title: 'My Calendar I',
    category: 'Intervals',
    difficulty: 'medium',
    skillLevel: 5,
    topicDepth: 'intermediate',
    description: 'Implement calendar to book events without double booking.',
    problemStatement: 'Implement calendar that can add events without causing double booking.',
    starterCode: {
      python: 'class MyCalendar:\n    def __init__(self):\n        pass\n    def book(self, start, end):\n        pass',
      javascript: 'class MyCalendar {\n    constructor() {}\n    book(start, end) {}\n}'
    },
    testCases: [
      { input: [["MyCalendar","book","book"],[[],[10,20],[15,25]]], expectedOutput: [null,true,false], isHidden: false }
    ],
    tags: ['Intervals', 'Design', 'Ordered Set'],
    points: 50
  },
  {
    title: 'Interval List Intersections',
    category: 'Intervals',
    difficulty: 'medium',
    skillLevel: 5,
    topicDepth: 'intermediate',
    description: 'Find intersections of two interval lists.',
    problemStatement: 'Return intersection of two interval lists.',
    starterCode: {
      python: 'def intervalIntersection(firstList, secondList):\n    # Your code here\n    pass',
      javascript: 'function intervalIntersection(firstList, secondList) {\n    // Your code here\n}'
    },
    testCases: [
      { input: [[[0,2],[5,10],[13,23],[24,25]], [[1,5],[8,12],[15,24],[25,26]]], expectedOutput: [[1,2],[5,5],[8,10],[15,23],[24,24],[25,25]], isHidden: false }
    ],
    tags: ['Intervals', 'Two Pointers', 'Array'],
    points: 50
  }
];

async function seedDoubledChallenges() {
  try {
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Get current count
    const currentCount = await CodingChallenge.countDocuments();
    console.log(`📊 Current challenges: ${currentCount}`);

    // Insert new challenges
    const result = await CodingChallenge.insertMany(newChallenges);
    console.log(`\n✅ Successfully added ${result.length} new challenges`);

    const newCount = await CodingChallenge.countDocuments();
    console.log(`📊 Total challenges now: ${newCount}`);

    // Display summary
    const byDifficulty = await CodingChallenge.aggregate([
      { $group: { _id: '$difficulty', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const byCategory = await CodingChallenge.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log('\n📊 Difficulty Distribution:');
    byDifficulty.forEach(item => {
      console.log(`   ${item._id}: ${item.count} challenges`);
    });

    console.log('\n📈 By Category:');
    byCategory.forEach(item => {
      console.log(`   ${item._id}: ${item.count} challenges`);
    });

    mongoose.connection.close();
    console.log('\n✨ Challenge doubling complete!');
  } catch (error) {
    console.error('❌ Error seeding challenges:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  seedDoubledChallenges();
}

module.exports = seedDoubledChallenges;
