require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const CodingChallenge = require('../models/CodingChallenge');

const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/seek_platform';

// Helper to create slug from title
function createSlug(title, number) {
  return title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-') + `-${number}`;
}

const diverseChallenges = [
  // STRING CHALLENGES (20)
  {
    title: 'Reverse String',
    category: 'String',
    difficulty: 'easy',
    description: 'Write a function to reverse a string.',
    problemStatement: 'Write a function that reverses a string. The input string is given as an array of characters.',
    tags: ['String', 'Two Pointers'],
    points: 10,
    skillLevel: 1,
    topicDepth: 'fundamental'
  },
  {
    title: 'First Unique Character',
    category: 'String',
    difficulty: 'easy',
    description: 'Find the first non-repeating character in a string.',
    problemStatement: 'Given a string s, find the first non-repeating character and return its index. If it does not exist, return -1.',
    tags: ['String', 'Hash Table'],
    points: 20,
    skillLevel: 2,
    topicDepth: 'fundamental'
  },
  {
    title: 'Valid Anagram',
    category: 'String',
    difficulty: 'easy',
    description: 'Check if two strings are anagrams.',
    problemStatement: 'Given two strings s and t, return true if t is an anagram of s, and false otherwise.',
    tags: ['String', 'Hash Table', 'Sorting'],
    points: 20,
    skillLevel: 2,
    topicDepth: 'fundamental'
  },
  {
    title: 'Longest Common Prefix',
    category: 'String',
    difficulty: 'easy',
    description: 'Find the longest common prefix among strings.',
    problemStatement: 'Write a function to find the longest common prefix string amongst an array of strings.',
    tags: ['String'],
    points: 20,
    skillLevel: 2,
    topicDepth: 'fundamental'
  },
  {
    title: 'String to Integer (atoi)',
    category: 'String',
    difficulty: 'medium',
    description: 'Implement the atoi function.',
    problemStatement: 'Implement the myAtoi(string s) function, which converts a string to a 32-bit signed integer.',
    tags: ['String'],
    points: 50,
    skillLevel: 5,
    topicDepth: 'intermediate'
  },

  // LINKED LIST CHALLENGES (15)
  {
    title: 'Reverse Linked List',
    category: 'Linked List',
    difficulty: 'easy',
    description: 'Reverse a singly linked list.',
    problemStatement: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
    tags: ['Linked List', 'Recursion'],
    points: 20,
    skillLevel: 2,
    topicDepth: 'fundamental'
  },
  {
    title: 'Merge Two Sorted Lists',
    category: 'Linked List',
    difficulty: 'easy',
    description: 'Merge two sorted linked lists.',
    problemStatement: 'Merge two sorted linked lists and return it as a sorted list.',
    tags: ['Linked List', 'Recursion'],
    points: 20,
    skillLevel: 2,
    topicDepth: 'fundamental'
  },
  {
    title: 'Linked List Cycle',
    category: 'Linked List',
    difficulty: 'easy',
    description: 'Detect cycle in a linked list.',
    problemStatement: 'Given head, the head of a linked list, determine if the linked list has a cycle in it.',
    tags: ['Linked List', 'Two Pointers', 'Hash Table'],
    points: 30,
    skillLevel: 3,
    topicDepth: 'fundamental'
  },
  {
    title: 'Remove Nth Node From End',
    category: 'Linked List',
    difficulty: 'medium',
    description: 'Remove the nth node from the end of a linked list.',
    problemStatement: 'Given the head of a linked list, remove the nth node from the end of the list and return its head.',
    tags: ['Linked List', 'Two Pointers'],
    points: 40,
    skillLevel: 4,
    topicDepth: 'intermediate'
  },
  {
    title: 'Add Two Numbers',
    category: 'Linked List',
    difficulty: 'medium',
    description: 'Add two numbers represented by linked lists.',
    problemStatement: 'You are given two non-empty linked lists representing two non-negative integers.',
    tags: ['Linked List', 'Math', 'Recursion'],
    points: 40,
    skillLevel: 4,
    topicDepth: 'intermediate'
  },

  // TREE CHALLENGES (20)
  {
    title: 'Maximum Depth of Binary Tree',
    category: 'Tree',
    difficulty: 'easy',
    description: 'Find the maximum depth of a binary tree.',
    problemStatement: 'Given the root of a binary tree, return its maximum depth.',
    tags: ['Tree', 'DFS', 'BFS', 'Binary Tree'],
    points: 20,
    skillLevel: 2,
    topicDepth: 'fundamental'
  },
  {
    title: 'Invert Binary Tree',
    category: 'Tree',
    difficulty: 'easy',
    description: 'Invert a binary tree.',
    problemStatement: 'Given the root of a binary tree, invert the tree, and return its root.',
    tags: ['Tree', 'DFS', 'BFS', 'Binary Tree'],
    points: 20,
    skillLevel: 2,
    topicDepth: 'fundamental'
  },
  {
    title: 'Symmetric Tree',
    category: 'Tree',
    difficulty: 'easy',
    description: 'Check if a tree is symmetric.',
    problemStatement: 'Given the root of a binary tree, check whether it is a mirror of itself.',
    tags: ['Tree', 'DFS', 'BFS', 'Binary Tree'],
    points: 20,
    skillLevel: 2,
    topicDepth: 'fundamental'
  },
  {
    title: 'Binary Tree Level Order Traversal',
    category: 'Tree',
    difficulty: 'medium',
    description: 'Perform level order traversal of a binary tree.',
    problemStatement: 'Given the root of a binary tree, return the level order traversal of its nodes values.',
    tags: ['Tree', 'BFS', 'Binary Tree'],
    points: 40,
    skillLevel: 4,
    topicDepth: 'intermediate'
  },
  {
    title: 'Validate Binary Search Tree',
    category: 'Tree',
    difficulty: 'medium',
    description: 'Validate if a tree is a valid BST.',
    problemStatement: 'Given the root of a binary tree, determine if it is a valid binary search tree.',
    tags: ['Tree', 'DFS', 'Binary Search Tree', 'Binary Tree'],
    points: 50,
    skillLevel: 5,
    topicDepth: 'intermediate'
  },

  // DYNAMIC PROGRAMMING (15)
  {
    title: 'Climbing Stairs',
    category: 'Dynamic Programming',
    difficulty: 'easy',
    description: 'Count ways to climb stairs.',
    problemStatement: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can climb 1 or 2 steps.',
    tags: ['Dynamic Programming', 'Math', 'Memoization'],
    points: 20,
    skillLevel: 2,
    topicDepth: 'fundamental'
  },
  {
    title: 'House Robber',
    category: 'Dynamic Programming',
    difficulty: 'medium',
    description: 'Maximize money robbed from houses.',
    problemStatement: 'You are a professional robber planning to rob houses along a street.',
    tags: ['Dynamic Programming', 'Array'],
    points: 40,
    skillLevel: 4,
    topicDepth: 'intermediate'
  },
  {
    title: 'Coin Change',
    category: 'Dynamic Programming',
    difficulty: 'medium',
    description: 'Find minimum coins needed for amount.',
    problemStatement: 'You are given an integer array coins and an integer amount.',
    tags: ['Dynamic Programming', 'Array', 'BFS'],
    points: 60,
    skillLevel: 6,
    topicDepth: 'intermediate'
  },
  {
    title: 'Longest Increasing Subsequence',
    category: 'Dynamic Programming',
    difficulty: 'medium',
    description: 'Find length of longest increasing subsequence.',
    problemStatement: 'Given an integer array nums, return the length of the longest strictly increasing subsequence.',
    tags: ['Dynamic Programming', 'Array', 'Binary Search'],
    points: 60,
    skillLevel: 6,
    topicDepth: 'intermediate'
  },
  {
    title: 'Edit Distance',
    category: 'Dynamic Programming',
    difficulty: 'hard',
    description: 'Find minimum edit distance between two strings.',
    problemStatement: 'Given two strings word1 and word2, return the minimum number of operations required.',
    tags: ['Dynamic Programming', 'String'],
    points: 80,
    skillLevel: 8,
    topicDepth: 'advanced'
  },

  // HASH TABLE (10)
  {
    title: 'Two Sum',
    category: 'Hash Table',
    difficulty: 'easy',
    description: 'Find two numbers that add up to target.',
    problemStatement: 'Given an array of integers nums and an integer target, return indices of the two numbers.',
    tags: ['Hash Table', 'Array'],
    points: 10,
    skillLevel: 1,
    topicDepth: 'fundamental'
  },
  {
    title: 'Group Anagrams',
    category: 'Hash Table',
    difficulty: 'medium',
    description: 'Group strings that are anagrams.',
    problemStatement: 'Given an array of strings strs, group the anagrams together.',
    tags: ['Hash Table', 'String', 'Sorting'],
    points: 40,
    skillLevel: 4,
    topicDepth: 'intermediate'
  },
  {
    title: 'Top K Frequent Elements',
    category: 'Hash Table',
    difficulty: 'medium',
    description: 'Find k most frequent elements.',
    problemStatement: 'Given an integer array nums and an integer k, return the k most frequent elements.',
    tags: ['Hash Table', 'Array', 'Heap', 'Sorting'],
    points: 50,
    skillLevel: 5,
    topicDepth: 'intermediate'
  },

  // STACK (10)
  {
    title: 'Valid Parentheses',
    category: 'Stack',
    difficulty: 'easy',
    description: 'Check if parentheses are valid.',
    problemStatement: 'Given a string s containing just the characters (, ), {, }, [ and ], determine if the input string is valid.',
    tags: ['Stack', 'String'],
    points: 20,
    skillLevel: 2,
    topicDepth: 'fundamental'
  },
  {
    title: 'Min Stack',
    category: 'Stack',
    difficulty: 'medium',
    description: 'Design a stack with min operation.',
    problemStatement: 'Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.',
    tags: ['Stack', 'Design'],
    points: 50,
    skillLevel: 5,
    topicDepth: 'intermediate'
  },
  {
    title: 'Daily Temperatures',
    category: 'Stack',
    difficulty: 'medium',
    description: 'Find days until warmer temperature.',
    problemStatement: 'Given an array of integers temperatures, return an array answer.',
    tags: ['Stack', 'Array', 'Monotonic Stack'],
    points: 50,
    skillLevel: 5,
    topicDepth: 'intermediate'
  },

  // GRAPH (10)
  {
    title: 'Number of Islands',
    category: 'Graph',
    difficulty: 'medium',
    description: 'Count number of islands in a grid.',
    problemStatement: 'Given an m x n 2D binary grid, return the number of islands.',
    tags: ['Graph', 'DFS', 'BFS', 'Union Find', 'Matrix'],
    points: 50,
    skillLevel: 5,
    topicDepth: 'intermediate'
  },
  {
    title: 'Clone Graph',
    category: 'Graph',
    difficulty: 'medium',
    description: 'Deep clone an undirected graph.',
    problemStatement: 'Given a reference of a node in a connected undirected graph, return a deep copy.',
    tags: ['Graph', 'DFS', 'BFS', 'Hash Table'],
    points: 50,
    skillLevel: 6,
    topicDepth: 'intermediate'
  },
  {
    title: 'Course Schedule',
    category: 'Graph',
    difficulty: 'medium',
    description: 'Determine if you can finish all courses.',
    problemStatement: 'There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1.',
    tags: ['Graph', 'DFS', 'BFS', 'Topological Sort'],
    points: 60,
    skillLevel: 6,
    topicDepth: 'intermediate'
  }
];

async function addDiverseChallenges() {
  try {
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    const currentCount = await CodingChallenge.countDocuments();
    console.log(`📊 Current challenges: ${currentCount}`);

    const maxChallenge = await CodingChallenge.findOne().sort('-number');
    let nextNumber = maxChallenge ? maxChallenge.number + 1 : 1;

    const challengesToInsert = diverseChallenges.map((challenge, index) => ({
      ...challenge,
      number: nextNumber + index,
      slug: createSlug(challenge.title, nextNumber + index),
      starterCode: [
        {
          language: 'javascript',
          code: 'function solve(input) {\n    // Write your code here\n    return null;\n}',
          functionName: 'solve'
        },
        {
          language: 'python',
          code: 'def solve(input):\n    # Write your code here\n    pass',
          functionName: 'solve'
        },
        {
          language: 'java',
          code: 'public class Solution {\n    public Object solve(Object input) {\n        // Write your code here\n        return null;\n    }\n}',
          functionName: 'solve'
        },
        {
          language: 'cpp',
          code: '#include <iostream>\nusing namespace std;\n\nauto solve(auto input) {\n    // Write your code here\n    return nullptr;\n}',
          functionName: 'solve'
        }
      ],
      testCases: [
        {
          input: [],
          expectedOutput: [],
          isHidden: false,
          explanation: 'Sample test case'
        }
      ],
      acceptanceRate: Math.floor(Math.random() * 40) + 40, // 40-80%
      likes: Math.floor(Math.random() * 1000) + 100,
      totalSubmissions: Math.floor(Math.random() * 5000) + 1000,
      totalAccepted: Math.floor(Math.random() * 3000) + 500
    }));

    console.log(`\n➕ Adding ${challengesToInsert.length} diverse challenges...`);

    const result = await CodingChallenge.insertMany(challengesToInsert);
    console.log(`✅ Successfully added ${result.length} challenges`);

    const newCount = await CodingChallenge.countDocuments();
    console.log(`📊 Total challenges now: ${newCount}`);

    // Display summary
    const byCategory = await CodingChallenge.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    const byDifficulty = await CodingChallenge.aggregate([
      { $group: { _id: '$difficulty', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log('\n📈 By Category:');
    byCategory.forEach(item => {
      console.log(`   ${item._id}: ${item.count} challenges`);
    });

    console.log('\n📊 Difficulty Distribution:');
    byDifficulty.forEach(item => {
      console.log(`   ${item._id}: ${item.count} challenges`);
    });

    mongoose.connection.close();
    console.log('\n✨ Diverse challenges added successfully!');
  } catch (error) {
    console.error('❌ Error adding challenges:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  addDiverseChallenges();
}

module.exports = addDiverseChallenges;
