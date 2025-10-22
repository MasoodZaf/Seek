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
  // ==================== EASY CHALLENGES ====================
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
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]'
      },
      {
        input: 'nums = [3,3], target = 6',
        output: '[0,1]'
      }
    ],
    testCases: [
      { input: { nums: [2, 7, 11, 15], target: 9 }, expectedOutput: [0, 1], isHidden: false },
      { input: { nums: [3, 2, 4], target: 6 }, expectedOutput: [1, 2], isHidden: false },
      { input: { nums: [3, 3], target: 6 }, expectedOutput: [0, 1], isHidden: false },
      { input: { nums: [1, 2, 3, 4, 5], target: 9 }, expectedOutput: [3, 4], isHidden: true },
      { input: { nums: [-1, -2, -3, -4, -5], target: -8 }, expectedOutput: [2, 4], isHidden: true }
    ],
    hints: [
      { order: 1, text: 'Use a hash map to store the numbers you\'ve seen so far.' },
      { order: 2, text: 'For each number, check if target - number exists in the hash map.' }
    ],
    starterCode: [
      {
        language: 'javascript',
        code: `function twoSum(nums, target) {
    // Write your code here

}`,
        functionName: 'twoSum'
      },
      {
        language: 'python',
        code: `def two_sum(nums, target):
    # Write your code here
    pass`,
        functionName: 'two_sum'
      }
    ],
    solutions: [
      {
        language: 'javascript',
        code: `function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}`,
        explanation: 'Use a hash map to store numbers and their indices. For each number, check if its complement exists.',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(n)'
      }
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
      {
        input: 'x = 121',
        output: 'true',
        explanation: '121 reads as 121 from left to right and from right to left.'
      },
      {
        input: 'x = -121',
        output: 'false',
        explanation: 'From left to right, it reads -121. From right to left, it becomes 121-.'
      },
      {
        input: 'x = 10',
        output: 'false',
        explanation: 'Reads 01 from right to left.'
      }
    ],
    testCases: [
      { input: { x: 121 }, expectedOutput: true, isHidden: false },
      { input: { x: -121 }, expectedOutput: false, isHidden: false },
      { input: { x: 10 }, expectedOutput: false, isHidden: false },
      { input: { x: 0 }, expectedOutput: true, isHidden: true },
      { input: { x: 12321 }, expectedOutput: true, isHidden: true }
    ],
    hints: [
      { order: 1, text: 'Negative numbers are not palindromes.' },
      { order: 2, text: 'You can reverse the second half of the number and compare it with the first half.' }
    ],
    starterCode: [
      {
        language: 'javascript',
        code: `function isPalindrome(x) {
    // Write your code here

}`,
        functionName: 'isPalindrome'
      },
      {
        language: 'python',
        code: `def is_palindrome(x):
    # Write your code here
    pass`,
        functionName: 'is_palindrome'
      }
    ],
    solutions: [
      {
        language: 'javascript',
        code: `function isPalindrome(x) {
    if (x < 0) return false;
    const str = x.toString();
    return str === str.split('').reverse().join('');
}`,
        explanation: 'Convert to string and compare with its reverse.',
        timeComplexity: 'O(log n)',
        spaceComplexity: 'O(1)'
      }
    ],
    acceptanceRate: 53.8,
    likes: 9200,
    dislikes: 2100
  },

  {
    number: 3,
    title: 'Reverse String',
    slug: 'reverse-string',
    difficulty: 'easy',
    category: 'String',
    tags: ['Two Pointers', 'String'],
    companies: ['Microsoft', 'Amazon'],
    description: `Write a function that reverses a string. The input string is given as an array of characters \`s\`.

You must do this by modifying the input array in-place with O(1) extra memory.`,
    constraints: [
      { description: '1 <= s.length <= 10⁵' },
      { description: 's[i] is a printable ascii character.' }
    ],
    examples: [
      {
        input: 's = ["h","e","l","l","o"]',
        output: '["o","l","l","e","h"]'
      },
      {
        input: 's = ["H","a","n","n","a","h"]',
        output: '["h","a","n","n","a","H"]'
      }
    ],
    testCases: [
      { input: { s: ['h', 'e', 'l', 'l', 'o'] }, expectedOutput: ['o', 'l', 'l', 'e', 'h'], isHidden: false },
      { input: { s: ['H', 'a', 'n', 'n', 'a', 'h'] }, expectedOutput: ['h', 'a', 'n', 'n', 'a', 'H'], isHidden: false },
      { input: { s: ['a'] }, expectedOutput: ['a'], isHidden: true }
    ],
    hints: [
      { order: 1, text: 'Use two pointers, one at the start and one at the end.' },
      { order: 2, text: 'Swap characters and move the pointers towards the center.' }
    ],
    starterCode: [
      {
        language: 'javascript',
        code: `function reverseString(s) {
    // Write your code here

}`,
        functionName: 'reverseString'
      }
    ],
    acceptanceRate: 76.4,
    likes: 6800,
    dislikes: 980
  },

  // ==================== MEDIUM CHALLENGES ====================
  {
    number: 4,
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
      {
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with the length of 3.'
      },
      {
        input: 's = "bbbbb"',
        output: '1',
        explanation: 'The answer is "b", with the length of 1.'
      },
      {
        input: 's = "pwwkew"',
        output: '3',
        explanation: 'The answer is "wke", with the length of 3.'
      }
    ],
    testCases: [
      { input: { s: 'abcabcbb' }, expectedOutput: 3, isHidden: false },
      { input: { s: 'bbbbb' }, expectedOutput: 1, isHidden: false },
      { input: { s: 'pwwkew' }, expectedOutput: 3, isHidden: false },
      { input: { s: '' }, expectedOutput: 0, isHidden: true },
      { input: { s: 'dvdf' }, expectedOutput: 3, isHidden: true }
    ],
    hints: [
      { order: 1, text: 'Use a sliding window approach with two pointers.' },
      { order: 2, text: 'Use a hash set to track characters in the current window.' }
    ],
    starterCode: [
      {
        language: 'javascript',
        code: `function lengthOfLongestSubstring(s) {
    // Write your code here

}`,
        functionName: 'lengthOfLongestSubstring'
      }
    ],
    acceptanceRate: 33.5,
    likes: 32500,
    dislikes: 1420
  },

  {
    number: 5,
    title: 'Add Two Numbers',
    slug: 'add-two-numbers',
    difficulty: 'medium',
    category: 'Linked List',
    tags: ['Linked List', 'Math', 'Recursion'],
    companies: ['Amazon', 'Microsoft', 'Adobe'],
    description: `You are given two **non-empty** linked lists representing two non-negative integers. The digits are stored in **reverse order**, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.

You may assume the two numbers do not contain any leading zero, except the number 0 itself.`,
    constraints: [
      { description: 'The number of nodes in each linked list is in the range [1, 100].' },
      { description: '0 <= Node.val <= 9' },
      { description: 'It is guaranteed that the list represents a number that does not have leading zeros.' }
    ],
    examples: [
      {
        input: 'l1 = [2,4,3], l2 = [5,6,4]',
        output: '[7,0,8]',
        explanation: '342 + 465 = 807.'
      }
    ],
    testCases: [
      { input: { l1: [2, 4, 3], l2: [5, 6, 4] }, expectedOutput: [7, 0, 8], isHidden: false },
      { input: { l1: [0], l2: [0] }, expectedOutput: [0], isHidden: false },
      { input: { l1: [9, 9, 9], l2: [1] }, expectedOutput: [0, 0, 0, 1], isHidden: true }
    ],
    hints: [
      { order: 1, text: 'Remember to handle the carry.' },
      { order: 2, text: 'The sum of two digits may exceed 9, so carry = sum / 10.' }
    ],
    starterCode: [
      {
        language: 'javascript',
        code: `function addTwoNumbers(l1, l2) {
    // Write your code here

}`,
        functionName: 'addTwoNumbers'
      }
    ],
    acceptanceRate: 40.2,
    likes: 25800,
    dislikes: 5100
  },

  // ==================== HARD CHALLENGES ====================
  {
    number: 6,
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
      { description: '1 <= m + n <= 2000' },
      { description: '-10⁶ <= nums1[i], nums2[i] <= 10⁶' }
    ],
    examples: [
      {
        input: 'nums1 = [1,3], nums2 = [2]',
        output: '2.00000',
        explanation: 'merged array = [1,2,3] and median is 2.'
      },
      {
        input: 'nums1 = [1,2], nums2 = [3,4]',
        output: '2.50000',
        explanation: 'merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.'
      }
    ],
    testCases: [
      { input: { nums1: [1, 3], nums2: [2] }, expectedOutput: 2.0, isHidden: false },
      { input: { nums1: [1, 2], nums2: [3, 4] }, expectedOutput: 2.5, isHidden: false },
      { input: { nums1: [], nums2: [1] }, expectedOutput: 1.0, isHidden: true },
      { input: { nums1: [2], nums2: [] }, expectedOutput: 2.0, isHidden: true }
    ],
    hints: [
      { order: 1, text: 'Binary search approach: partition the arrays to find the median.' },
      { order: 2, text: 'The median divides the array into two equal halves.' }
    ],
    starterCode: [
      {
        language: 'javascript',
        code: `function findMedianSortedArrays(nums1, nums2) {
    // Write your code here

}`,
        functionName: 'findMedianSortedArrays'
      }
    ],
    acceptanceRate: 36.3,
    likes: 22100,
    dislikes: 2450
  },

  // More Easy challenges
  {
    number: 7,
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
      {
        input: 's = "()"',
        output: 'true'
      },
      {
        input: 's = "()[]{}"',
        output: 'true'
      },
      {
        input: 's = "(]"',
        output: 'false'
      }
    ],
    testCases: [
      { input: { s: '()' }, expectedOutput: true, isHidden: false },
      { input: { s: '()[]{}' }, expectedOutput: true, isHidden: false },
      { input: { s: '(]' }, expectedOutput: false, isHidden: false },
      { input: { s: '([)]' }, expectedOutput: false, isHidden: true },
      { input: { s: '{[]}' }, expectedOutput: true, isHidden: true }
    ],
    hints: [
      { order: 1, text: 'Use a stack to keep track of opening brackets.' },
      { order: 2, text: 'When you encounter a closing bracket, check if it matches the top of the stack.' }
    ],
    starterCode: [
      {
        language: 'javascript',
        code: `function isValid(s) {
    // Write your code here

}`,
        functionName: 'isValid'
      }
    ],
    acceptanceRate: 40.5,
    likes: 19200,
    dislikes: 1180
  },

  {
    number: 8,
    title: 'Best Time to Buy and Sell Stock',
    slug: 'best-time-to-buy-and-sell-stock',
    difficulty: 'easy',
    category: 'Array',
    tags: ['Array', 'Dynamic Programming'],
    companies: ['Amazon', 'Microsoft', 'Facebook', 'Bloomberg'],
    description: `You are given an array \`prices\` where \`prices[i]\` is the price of a given stock on the \`ith\` day.

You want to maximize your profit by choosing a **single day** to buy one stock and choosing a **different day in the future** to sell that stock.

Return *the maximum profit you can achieve from this transaction*. If you cannot achieve any profit, return \`0\`.`,
    constraints: [
      { description: '1 <= prices.length <= 10⁵' },
      { description: '0 <= prices[i] <= 10⁴' }
    ],
    examples: [
      {
        input: 'prices = [7,1,5,3,6,4]',
        output: '5',
        explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.'
      },
      {
        input: 'prices = [7,6,4,3,1]',
        output: '0',
        explanation: 'No transactions are done and the max profit = 0.'
      }
    ],
    testCases: [
      { input: { prices: [7, 1, 5, 3, 6, 4] }, expectedOutput: 5, isHidden: false },
      { input: { prices: [7, 6, 4, 3, 1] }, expectedOutput: 0, isHidden: false },
      { input: { prices: [2, 4, 1] }, expectedOutput: 2, isHidden: true }
    ],
    hints: [
      { order: 1, text: 'Track the minimum price seen so far.' },
      { order: 2, text: 'Calculate the profit if you sell at the current price.' }
    ],
    starterCode: [
      {
        language: 'javascript',
        code: `function maxProfit(prices) {
    // Write your code here

}`,
        functionName: 'maxProfit'
      }
    ],
    acceptanceRate: 54.2,
    likes: 25300,
    dislikes: 820
  },

  {
    number: 9,
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
      { description: '-100 <= Node.val <= 100' },
      { description: 'Both list1 and list2 are sorted in non-decreasing order.' }
    ],
    examples: [
      {
        input: 'list1 = [1,2,4], list2 = [1,3,4]',
        output: '[1,1,2,3,4,4]'
      }
    ],
    testCases: [
      { input: { list1: [1, 2, 4], list2: [1, 3, 4] }, expectedOutput: [1, 1, 2, 3, 4, 4], isHidden: false },
      { input: { list1: [], list2: [] }, expectedOutput: [], isHidden: false },
      { input: { list1: [], list2: [0] }, expectedOutput: [0], isHidden: true }
    ],
    hints: [
      { order: 1, text: 'Use a dummy node to simplify the merge logic.' },
      { order: 2, text: 'Compare the values of the two lists and append the smaller one.' }
    ],
    starterCode: [
      {
        language: 'javascript',
        code: `function mergeTwoLists(list1, list2) {
    // Write your code here

}`,
        functionName: 'mergeTwoLists'
      }
    ],
    acceptanceRate: 61.8,
    likes: 18500,
    dislikes: 1520
  },

  {
    number: 10,
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
      {
        input: 'nums = [1,2,3,1]',
        output: 'true'
      },
      {
        input: 'nums = [1,2,3,4]',
        output: 'false'
      }
    ],
    testCases: [
      { input: { nums: [1, 2, 3, 1] }, expectedOutput: true, isHidden: false },
      { input: { nums: [1, 2, 3, 4] }, expectedOutput: false, isHidden: false },
      { input: { nums: [1, 1, 1, 3, 3, 4, 3, 2, 4, 2] }, expectedOutput: true, isHidden: true }
    ],
    hints: [
      { order: 1, text: 'Use a hash set to track numbers you\'ve seen.' },
      { order: 2, text: 'If you encounter a number that\'s already in the set, return true.' }
    ],
    starterCode: [
      {
        language: 'javascript',
        code: `function containsDuplicate(nums) {
    // Write your code here

}`,
        functionName: 'containsDuplicate'
      }
    ],
    acceptanceRate: 60.9,
    likes: 9600,
    dislikes: 1050
  }
];

// Seed function
const seedChallenges = async () => {
  try {
    console.log('🚀 Starting challenge seeding...');
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
    console.log('🔗 Users can now practice LeetCode-style problems on your platform!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding challenges:', error);
    process.exit(1);
  }
};

// Run seeding
seedChallenges();
