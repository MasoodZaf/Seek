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

// Challenge templates for different categories
const challengeTemplates = {
  // ARRAY CHALLENGES (20)
  array: [
    { title: 'Two Sum', difficulty: 'easy', skillLevel: 1, topicDepth: 'fundamental' },
    { title: 'Best Time to Buy and Sell Stock', difficulty: 'easy', skillLevel: 2, topicDepth: 'fundamental' },
    { title: 'Contains Duplicate', difficulty: 'easy', skillLevel: 1, topicDepth: 'fundamental' },
    { title: 'Product of Array Except Self', difficulty: 'medium', skillLevel: 5, topicDepth: 'intermediate' },
    { title: 'Maximum Subarray', difficulty: 'easy', skillLevel: 3, topicDepth: 'intermediate' },
    { title: 'Merge Intervals', difficulty: 'medium', skillLevel: 6, topicDepth: 'intermediate' },
    { title: 'Rotate Array', difficulty: 'medium', skillLevel: 4, topicDepth: 'intermediate' },
    { title: 'Find Minimum in Rotated Sorted Array', difficulty: 'medium', skillLevel: 5, topicDepth: 'intermediate' },
    { title: '3Sum', difficulty: 'medium', skillLevel: 6, topicDepth: 'intermediate' },
    { title: '4Sum', difficulty: 'medium', skillLevel: 7, topicDepth: 'advanced' },
    { title: 'Container With Most Water', difficulty: 'medium', skillLevel: 5, topicDepth: 'intermediate' },
    { title: 'Trapping Rain Water', difficulty: 'hard', skillLevel: 8, topicDepth: 'advanced' },
    { title: 'First Missing Positive', difficulty: 'hard', skillLevel: 9, topicDepth: 'expert' },
    { title: 'Largest Rectangle in Histogram', difficulty: 'hard', skillLevel: 9, topicDepth: 'expert' },
    { title: 'Median of Two Sorted Arrays', difficulty: 'hard', skillLevel: 10, topicDepth: 'expert' },
    { title: 'Sliding Window Maximum', difficulty: 'hard', skillLevel: 8, topicDepth: 'advanced' },
    { title: 'Subarray Sum Equals K', difficulty: 'medium', skillLevel: 5, topicDepth: 'intermediate' },
    { title: 'Majority Element', difficulty: 'easy', skillLevel: 2, topicDepth: 'fundamental' },
    { title: 'Sort Colors', difficulty: 'medium', skillLevel: 4, topicDepth: 'intermediate' },
    { title: 'Next Permutation', difficulty: 'medium', skillLevel: 6, topicDepth: 'intermediate' }
  ],

  // STRING CHALLENGES (15)
  string: [
    { title: 'Valid Anagram', difficulty: 'easy', skillLevel: 1, topicDepth: 'fundamental' },
    { title: 'Valid Palindrome', difficulty: 'easy', skillLevel: 1, topicDepth: 'fundamental' },
    { title: 'Longest Substring Without Repeating Characters', difficulty: 'medium', skillLevel: 5, topicDepth: 'intermediate' },
    { title: 'Longest Palindromic Substring', difficulty: 'medium', skillLevel: 6, topicDepth: 'intermediate' },
    { title: 'Palindrome Number', difficulty: 'easy', skillLevel: 2, topicDepth: 'fundamental' },
    { title: 'Group Anagrams', difficulty: 'medium', skillLevel: 4, topicDepth: 'intermediate' },
    { title: 'Longest Common Prefix', difficulty: 'easy', skillLevel: 2, topicDepth: 'fundamental' },
    { title: 'String to Integer (atoi)', difficulty: 'medium', skillLevel: 5, topicDepth: 'intermediate' },
    { title: 'ZigZag Conversion', difficulty: 'medium', skillLevel: 4, topicDepth: 'intermediate' },
    { title: 'Minimum Window Substring', difficulty: 'hard', skillLevel: 9, topicDepth: 'expert' },
    { title: 'Valid Parentheses', difficulty: 'easy', skillLevel: 2, topicDepth: 'fundamental' },
    { title: 'Generate Parentheses', difficulty: 'medium', skillLevel: 6, topicDepth: 'intermediate' },
    { title: 'Longest Valid Parentheses', difficulty: 'hard', skillLevel: 8, topicDepth: 'advanced' },
    { title: 'Word Break', difficulty: 'medium', skillLevel: 6, topicDepth: 'intermediate' },
    { title: 'Regular Expression Matching', difficulty: 'hard', skillLevel: 10, topicDepth: 'expert' }
  ],

  // LINKED LIST CHALLENGES (10)
  linkedList: [
    { title: 'Reverse Linked List', difficulty: 'easy', skillLevel: 2, topicDepth: 'fundamental' },
    { title: 'Merge Two Sorted Lists', difficulty: 'easy', skillLevel: 2, topicDepth: 'fundamental' },
    { title: 'Add Two Numbers', difficulty: 'medium', skillLevel: 4, topicDepth: 'intermediate' },
    { title: 'Remove Nth Node From End of List', difficulty: 'medium', skillLevel: 4, topicDepth: 'intermediate' },
    { title: 'Linked List Cycle', difficulty: 'easy', skillLevel: 3, topicDepth: 'fundamental' },
    { title: 'Linked List Cycle II', difficulty: 'medium', skillLevel: 5, topicDepth: 'intermediate' },
    { title: 'Reorder List', difficulty: 'medium', skillLevel: 6, topicDepth: 'intermediate' },
    { title: 'Merge k Sorted Lists', difficulty: 'hard', skillLevel: 8, topicDepth: 'advanced' },
    { title: 'Copy List with Random Pointer', difficulty: 'medium', skillLevel: 5, topicDepth: 'intermediate' },
    { title: 'LRU Cache', difficulty: 'medium', skillLevel: 7, topicDepth: 'advanced' }
  ],

  // TREE CHALLENGES (12)
  tree: [
    { title: 'Maximum Depth of Binary Tree', difficulty: 'easy', skillLevel: 2, topicDepth: 'fundamental' },
    { title: 'Same Tree', difficulty: 'easy', skillLevel: 2, topicDepth: 'fundamental' },
    { title: 'Invert Binary Tree', difficulty: 'easy', skillLevel: 2, topicDepth: 'fundamental' },
    { title: 'Binary Tree Level Order Traversal', difficulty: 'medium', skillLevel: 4, topicDepth: 'intermediate' },
    { title: 'Validate Binary Search Tree', difficulty: 'medium', skillLevel: 5, topicDepth: 'intermediate' },
    { title: 'Kth Smallest Element in a BST', difficulty: 'medium', skillLevel: 5, topicDepth: 'intermediate' },
    { title: 'Lowest Common Ancestor of a Binary Tree', difficulty: 'medium', skillLevel: 6, topicDepth: 'intermediate' },
    { title: 'Binary Tree Maximum Path Sum', difficulty: 'hard', skillLevel: 8, topicDepth: 'advanced' },
    { title: 'Serialize and Deserialize Binary Tree', difficulty: 'hard', skillLevel: 8, topicDepth: 'advanced' },
    { title: 'Construct Binary Tree from Preorder and Inorder', difficulty: 'medium', skillLevel: 6, topicDepth: 'intermediate' },
    { title: 'Subtree of Another Tree', difficulty: 'easy', skillLevel: 3, topicDepth: 'fundamental' },
    { title: 'Symmetric Tree', difficulty: 'easy', skillLevel: 2, topicDepth: 'fundamental' }
  ],

  // DYNAMIC PROGRAMMING CHALLENGES (12)
  dp: [
    { title: 'Climbing Stairs', difficulty: 'easy', skillLevel: 2, topicDepth: 'fundamental' },
    { title: 'House Robber', difficulty: 'medium', skillLevel: 4, topicDepth: 'intermediate' },
    { title: 'Coin Change', difficulty: 'medium', skillLevel: 6, topicDepth: 'intermediate' },
    { title: 'Longest Increasing Subsequence', difficulty: 'medium', skillLevel: 6, topicDepth: 'intermediate' },
    { title: 'Unique Paths', difficulty: 'medium', skillLevel: 4, topicDepth: 'intermediate' },
    { title: 'Jump Game', difficulty: 'medium', skillLevel: 5, topicDepth: 'intermediate' },
    { title: 'Word Break', difficulty: 'medium', skillLevel: 6, topicDepth: 'intermediate' },
    { title: 'Combination Sum IV', difficulty: 'medium', skillLevel: 6, topicDepth: 'intermediate' },
    { title: 'Decode Ways', difficulty: 'medium', skillLevel: 5, topicDepth: 'intermediate' },
    { title: 'Edit Distance', difficulty: 'hard', skillLevel: 8, topicDepth: 'advanced' },
    { title: 'Best Time to Buy and Sell Stock IV', difficulty: 'hard', skillLevel: 9, topicDepth: 'expert' },
    { title: 'Burst Balloons', difficulty: 'hard', skillLevel: 10, topicDepth: 'expert' }
  ],

  // GRAPH CHALLENGES (10)
  graph: [
    { title: 'Number of Islands', difficulty: 'medium', skillLevel: 5, topicDepth: 'intermediate' },
    { title: 'Clone Graph', difficulty: 'medium', skillLevel: 5, topicDepth: 'intermediate' },
    { title: 'Course Schedule', difficulty: 'medium', skillLevel: 6, topicDepth: 'intermediate' },
    { title: 'Pacific Atlantic Water Flow', difficulty: 'medium', skillLevel: 6, topicDepth: 'intermediate' },
    { title: 'Graph Valid Tree', difficulty: 'medium', skillLevel: 5, topicDepth: 'intermediate' },
    { title: 'Word Ladder', difficulty: 'hard', skillLevel: 7, topicDepth: 'advanced' },
    { title: 'Alien Dictionary', difficulty: 'hard', skillLevel: 9, topicDepth: 'expert' },
    { title: 'Network Delay Time', difficulty: 'medium', skillLevel: 6, topicDepth: 'intermediate' },
    { title: 'Cheapest Flights Within K Stops', difficulty: 'medium', skillLevel: 7, topicDepth: 'advanced' },
    { title: 'Critical Connections in a Network', difficulty: 'hard', skillLevel: 9, topicDepth: 'expert' }
  ],

  // BACKTRACKING CHALLENGES (8)
  backtracking: [
    { title: 'Permutations', difficulty: 'medium', skillLevel: 5, topicDepth: 'intermediate' },
    { title: 'Subsets', difficulty: 'medium', skillLevel: 4, topicDepth: 'intermediate' },
    { title: 'Combination Sum', difficulty: 'medium', skillLevel: 5, topicDepth: 'intermediate' },
    { title: 'Palindrome Partitioning', difficulty: 'medium', skillLevel: 6, topicDepth: 'intermediate' },
    { title: 'Letter Combinations of a Phone Number', difficulty: 'medium', skillLevel: 4, topicDepth: 'intermediate' },
    { title: 'N-Queens', difficulty: 'hard', skillLevel: 8, topicDepth: 'advanced' },
    { title: 'Word Search', difficulty: 'medium', skillLevel: 6, topicDepth: 'intermediate' },
    { title: 'Sudoku Solver', difficulty: 'hard', skillLevel: 9, topicDepth: 'expert' }
  ],

  // MISCELLANEOUS (13 more to reach 100)
  misc: [
    { title: 'Single Number', difficulty: 'easy', skillLevel: 1, topicDepth: 'fundamental', category: 'Bit Manipulation' },
    { title: 'Number of 1 Bits', difficulty: 'easy', skillLevel: 2, topicDepth: 'fundamental', category: 'Bit Manipulation' },
    { title: 'Missing Number', difficulty: 'easy', skillLevel: 2, topicDepth: 'fundamental', category: 'Math' },
    { title: 'Reverse Integer', difficulty: 'easy', skillLevel: 2, topicDepth: 'fundamental', category: 'Math' },
    { title: 'Pow(x, n)', difficulty: 'medium', skillLevel: 5, topicDepth: 'intermediate', category: 'Math' },
    { title: 'Sqrt(x)', difficulty: 'easy', skillLevel: 3, topicDepth: 'fundamental', category: 'Binary Search' },
    { title: 'Search in Rotated Sorted Array', difficulty: 'medium', skillLevel: 6, topicDepth: 'intermediate', category: 'Binary Search' },
    { title: 'Find Peak Element', difficulty: 'medium', skillLevel: 5, topicDepth: 'intermediate', category: 'Binary Search' },
    { title: 'Implement Trie', difficulty: 'medium', skillLevel: 6, topicDepth: 'intermediate', category: 'Design' },
    { title: 'Min Stack', difficulty: 'easy', skillLevel: 3, topicDepth: 'fundamental', category: 'Stack' },
    { title: 'Evaluate Reverse Polish Notation', difficulty: 'medium', skillLevel: 4, topicDepth: 'intermediate', category: 'Stack' },
    { title: 'Kth Largest Element in an Array', difficulty: 'medium', skillLevel: 5, topicDepth: 'intermediate', category: 'Heap' },
    { title: 'Top K Frequent Elements', difficulty: 'medium', skillLevel: 5, topicDepth: 'intermediate', category: 'Heap' }
  ]
};

// Map category keys to valid enum values
const categoryMap = {
  'array': 'Array',
  'string': 'String',
  'linkedList': 'Linked List',
  'tree': 'Binary Tree',
  'dp': 'Dynamic Programming',
  'graph': 'Graph',
  'backtracking': 'Backtracking',
  'misc': 'Math'
};

// Generate full challenge objects
function generateChallenge(template, number, category) {
  const slug = template.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + number;

  return {
    number,
    title: template.title,
    slug,
    difficulty: template.difficulty,
    skillLevel: template.skillLevel,
    topicDepth: template.topicDepth,
    category: template.category || categoryMap[category] || 'Array',
    description: `Solve the ${template.title} problem. This is a ${template.difficulty} level challenge that tests your understanding of ${template.category || category}.`,
    tags: [category, template.difficulty],
    companies: ['Google', 'Amazon', 'Microsoft', 'Facebook'].slice(0, Math.floor(Math.random() * 4) + 1),
    isPremium: false,
    acceptanceRate: 30 + Math.random() * 50,
    likes: Math.floor(Math.random() * 10000) + 100,
    dislikes: Math.floor(Math.random() * 500),
    constraints: [
      { description: 'Standard input/output constraints apply' }
    ],
    examples: [
      {
        input: 'Example input',
        output: 'Example output',
        explanation: 'Example explanation'
      }
    ],
    testCases: [
      { input: {}, expectedOutput: {}, isHidden: false },
      { input: {}, expectedOutput: {}, isHidden: true }
    ],
    hints: [
      { order: 1, text: `Consider using ${category.toLowerCase()} techniques` },
      { order: 2, text: 'Think about edge cases' }
    ],
    starterCode: [
      {
        language: 'javascript',
        code: `function solve(input) {\n    // Write your code here\n\n}`,
        functionName: 'solve'
      },
      {
        language: 'python',
        code: `def solve(input):\n    # Write your code here\n    pass`,
        functionName: 'solve'
      }
    ],
    isActive: true
  };
}

// Seed function
const seedChallenges = async () => {
  try {
    console.log('🚀 Starting 100-challenge seeding...');

    // Clear existing challenges
    await CodingChallenge.deleteMany({});
    console.log('🧹 Cleared existing challenges');

    const allChallenges = [];
    let number = 1;

    // Generate challenges from templates
    for (const [categoryKey, templates] of Object.entries(challengeTemplates)) {
      const categoryName = categoryKey === 'misc' ? null :
                          categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1);

      for (const template of templates) {
        const challenge = generateChallenge(
          template,
          number++,
          template.category || categoryName
        );
        allChallenges.push(challenge);
      }
    }

    console.log(`📝 Generated ${allChallenges.length} challenges`);

    // Insert all challenges
    await CodingChallenge.insertMany(allChallenges);
    console.log(`✅ Successfully seeded ${allChallenges.length} challenges`);

    // Print statistics
    const stats = await CodingChallenge.aggregate([
      { $group: { _id: '$difficulty', count: { $sum: 1 } } }
    ]);

    console.log('\n📊 Challenges by Difficulty:');
    stats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} challenges`);
    });

    const skillStats = await CodingChallenge.aggregate([
      { $group: { _id: '$skillLevel', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    console.log('\n📈 Challenges by Skill Level (1-10):');
    skillStats.forEach(stat => {
      console.log(`   Level ${stat._id}: ${stat.count} challenges`);
    });

    const categoryStats = await CodingChallenge.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    console.log('\n📚 Challenges by Category:');
    categoryStats.forEach(stat => {
      console.log(`   ${stat._id}: ${stat.count} challenges`);
    });

    console.log('\n🎉 100-Challenge seeding completed successfully!');
    console.log('💡 Challenges are now available with intelligent recommendation system!');
    console.log('👥 Normal users will receive personalized recommendations');
    console.log('🔐 Admins can access the full list via /api/v1/challenges/admin/all');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding challenges:', error);
    process.exit(1);
  }
};

// Run seeding
seedChallenges();
