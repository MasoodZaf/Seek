require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const CodingChallenge = require('../models/CodingChallenge');

const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/seek_platform';

// Meaningful hints for popular challenges
const challengeHints = {
  'two-sum': [
    { order: 1, text: 'Think about using a hash map to store numbers you\'ve seen', cost: 0 },
    { order: 2, text: 'For each number, check if target - number exists in your hash map', cost: 0 }
  ],

  'reverse-linked-list': [
    { order: 1, text: 'You need to change the direction of next pointers', cost: 0 },
    { order: 2, text: 'Use three pointers: previous, current, and next', cost: 0 }
  ],

  'valid-parentheses': [
    { order: 1, text: 'A stack data structure is perfect for matching pairs', cost: 0 },
    { order: 2, text: 'Push opening brackets, pop and match with closing brackets', cost: 0 }
  ],

  'maximum-depth-of-binary-tree': [
    { order: 1, text: 'Think recursively: depth = 1 + max(left subtree depth, right subtree depth)', cost: 0 },
    { order: 2, text: 'Base case: an empty tree has depth 0', cost: 0 }
  ],

  'climbing-stairs': [
    { order: 1, text: 'This is a Fibonacci sequence problem', cost: 0 },
    { order: 2, text: 'To reach step n, you came from either step n-1 or n-2', cost: 0 },
    { order: 3, text: 'Use dynamic programming to avoid recalculating subproblems', cost: 0 }
  ],

  'number-of-islands': [
    { order: 1, text: 'Use DFS or BFS to explore each island', cost: 0 },
    { order: 2, text: 'Mark visited cells to avoid counting the same island twice', cost: 0 }
  ],

  'top-k-frequent-elements': [
    { order: 1, text: 'First, count the frequency of each element using a hash map', cost: 0 },
    { order: 2, text: 'Use a heap (priority queue) to efficiently find the k most frequent', cost: 0 },
    { order: 3, text: 'Alternative: Bucket sort where bucket index = frequency', cost: 0 }
  ],

  'longest-substring-without-repeating-characters': [
    { order: 1, text: 'Use the sliding window technique with two pointers', cost: 0 },
    { order: 2, text: 'Keep a set or hash map of characters in the current window', cost: 0 },
    { order: 3, text: 'When you find a duplicate, move the left pointer', cost: 0 }
  ],

  'merge-two-sorted-lists': [
    { order: 1, text: 'Compare the current nodes from both lists', cost: 0 },
    { order: 2, text: 'Choose the smaller one and advance that pointer', cost: 0 }
  ],

  'best-time-to-buy-and-sell-stock': [
    { order: 1, text: 'Track the minimum price seen so far', cost: 0 },
    { order: 2, text: 'For each price, calculate profit if you sell at that price', cost: 0 }
  ],

  'coin-change': [
    { order: 1, text: 'This is a classic dynamic programming problem', cost: 0 },
    { order: 2, text: 'Build up solutions for smaller amounts', cost: 0 },
    { order: 3, text: 'For each amount, try adding each coin denomination', cost: 0 }
  ]
};

// Generate hints based on category and difficulty
function getHintsByChallenge(title, category, difficulty) {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  if (challengeHints[slug]) {
    return challengeHints[slug];
  }

  // Generate context-aware hints based on category
  const hints = [];

  if (category === 'Array') {
    hints.push({ order: 1, text: 'Consider using a hash map to track elements', cost: 0 });
    if (difficulty === 'easy') {
      hints.push({ order: 2, text: 'Try iterating through the array once', cost: 0 });
    } else {
      hints.push({ order: 2, text: 'Think about two-pointer or sliding window techniques', cost: 0 });
      hints.push({ order: 3, text: 'Can you sort the array to simplify the problem?', cost: 0 });
    }
  } else if (category === 'String') {
    hints.push({ order: 1, text: 'Consider using a hash map or set to track characters', cost: 0 });
    hints.push({ order: 2, text: 'Try the sliding window technique for substring problems', cost: 0 });
  } else if (category === 'Tree' || category === 'Binary Tree') {
    hints.push({ order: 1, text: 'Think about using recursion for tree traversal', cost: 0 });
    hints.push({ order: 2, text: 'Consider DFS (preorder/inorder/postorder) or BFS approaches', cost: 0 });
  } else if (category === 'Graph') {
    hints.push({ order: 1, text: 'Consider using DFS or BFS for graph traversal', cost: 0 });
    hints.push({ order: 2, text: 'Mark visited nodes to avoid cycles', cost: 0 });
  } else if (category === 'Dynamic Programming') {
    hints.push({ order: 1, text: 'Break the problem into smaller subproblems', cost: 0 });
    hints.push({ order: 2, text: 'Use memoization or bottom-up DP to avoid recalculation', cost: 0 });
    hints.push({ order: 3, text: 'Define your state and transition function clearly', cost: 0 });
  } else if (category === 'Linked List') {
    hints.push({ order: 1, text: 'Consider using multiple pointers (slow/fast, prev/current)', cost: 0 });
    hints.push({ order: 2, text: 'Watch out for edge cases: empty list, single node', cost: 0 });
  } else if (category === 'Stack') {
    hints.push({ order: 1, text: 'Think about what information you need to store on the stack', cost: 0 });
    hints.push({ order: 2, text: 'Consider when to push and when to pop', cost: 0 });
  } else if (category === 'Heap') {
    hints.push({ order: 1, text: 'Use a min-heap or max-heap depending on the problem', cost: 0 });
    hints.push({ order: 2, text: 'Heaps are great for finding top K elements', cost: 0 });
  } else if (category === 'Hash Table') {
    hints.push({ order: 1, text: 'Use a hash map to store key-value pairs for O(1) lookup', cost: 0 });
    hints.push({ order: 2, text: 'Think about what you need to track as keys and values', cost: 0 });
  } else if (category === 'Binary Search') {
    hints.push({ order: 1, text: 'Identify what property makes the search space monotonic', cost: 0 });
    hints.push({ order: 2, text: 'Be careful with integer overflow when calculating mid', cost: 0 });
  } else {
    hints.push({ order: 1, text: `Think about the properties of ${category}`, cost: 0 });
    hints.push({ order: 2, text: 'Consider edge cases and special inputs', cost: 0 });
  }

  return hints;
}

async function updateChallengeHints() {
  try {
    console.log('🚀 Updating challenge hints with meaningful guidance...\n');
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB\n');

    const challenges = await CodingChallenge.find();
    let updated = 0;

    for (const challenge of challenges) {
      const newHints = getHintsByChallenge(
        challenge.title,
        challenge.category,
        challenge.difficulty
      );

      await CodingChallenge.updateOne(
        { _id: challenge._id },
        { $set: { hints: newHints } }
      );
      updated++;

      if (updated % 20 === 0) {
        console.log(`  ✓ Updated ${updated} challenges...`);
      }
    }

    console.log(`\n✅ Successfully updated ${updated} challenges with meaningful hints!`);

    mongoose.connection.close();
    console.log('\n🎉 Update complete!');
  } catch (error) {
    console.error('❌ Error updating hints:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  updateChallengeHints();
}

module.exports = updateChallengeHints;
