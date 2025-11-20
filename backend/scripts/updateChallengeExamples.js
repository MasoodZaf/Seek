require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const CodingChallenge = require('../models/CodingChallenge');

const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/seek_platform';

// Meaningful examples for each challenge
const challengeExamples = {
  'two-sum': [
    {
      input: 'nums = [2,7,11,15], target = 9',
      output: '[0,1]',
      explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].'
    },
    {
      input: 'nums = [3,2,4], target = 6',
      output: '[1,2]',
      explanation: 'nums[1] + nums[2] == 6'
    }
  ],

  'reverse-linked-list': [
    {
      input: 'head = [1,2,3,4,5]',
      output: '[5,4,3,2,1]',
      explanation: 'The linked list is reversed, so the tail becomes the head.'
    }
  ],

  'valid-parentheses': [
    {
      input: 's = "()"',
      output: 'true',
      explanation: 'The string contains valid parentheses that are properly closed.'
    },
    {
      input: 's = "()[]{}"',
      output: 'true',
      explanation: 'All brackets are properly closed in the correct order.'
    },
    {
      input: 's = "(]"',
      output: 'false',
      explanation: 'Brackets are not closed in the correct order.'
    }
  ],

  'maximum-depth-of-binary-tree': [
    {
      input: 'root = [3,9,20,null,null,15,7]',
      output: '3',
      explanation: 'The maximum depth is 3 (path: 3 -> 20 -> 15 or 7).'
    }
  ],

  'climbing-stairs': [
    {
      input: 'n = 2',
      output: '2',
      explanation: 'There are two ways: 1+1 or 2'
    },
    {
      input: 'n = 3',
      output: '3',
      explanation: 'There are three ways: 1+1+1, 1+2, or 2+1'
    }
  ],

  'number-of-islands': [
    {
      input: 'grid = [["1","1","0"],["1","1","0"],["0","0","1"]]',
      output: '2',
      explanation: 'There are 2 islands in the grid.'
    }
  ],

  'top-k-frequent-elements': [
    {
      input: 'nums = [1,1,1,2,2,3], k = 2',
      output: '[1,2]',
      explanation: '1 appears 3 times, 2 appears 2 times. These are the 2 most frequent.'
    },
    {
      input: 'nums = [1], k = 1',
      output: '[1]',
      explanation: 'Only one element, so it is the most frequent.'
    }
  ],

  // Default example for challenges without specific examples
  'default': [
    {
      input: 'Input 1',
      output: 'Expected Output',
      explanation: 'Explanation of how input transforms to output'
    }
  ]
};

// Generate examples based on title
function getExamplesByTitle(title) {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  if (challengeExamples[slug]) {
    return challengeExamples[slug];
  }

  // Generate context-aware examples based on the title
  if (title.includes('Array') || title.includes('Sum')) {
    return [
      {
        input: 'arr = [1,2,3,4,5]',
        output: 'result',
        explanation: 'Process the array to get the expected result'
      }
    ];
  }

  if (title.includes('String') || title.includes('Substring')) {
    return [
      {
        input: 's = "hello world"',
        output: 'result',
        explanation: 'Process the string to get the expected result'
      }
    ];
  }

  if (title.includes('Tree') || title.includes('Binary')) {
    return [
      {
        input: 'root = [1,2,3,4,5]',
        output: 'result',
        explanation: 'Traverse the binary tree to get the expected result'
      }
    ];
  }

  if (title.includes('Graph') || title.includes('Island')) {
    return [
      {
        input: 'graph = [[1,2],[0,2],[0,1]]',
        output: 'result',
        explanation: 'Process the graph to get the expected result'
      }
    ];
  }

  if (title.includes('Linked List')) {
    return [
      {
        input: 'head = [1,2,3,4,5]',
        output: 'result',
        explanation: 'Process the linked list to get the expected result'
      }
    ];
  }

  return challengeExamples['default'];
}

async function updateChallengeExamples() {
  try {
    console.log('🚀 Updating challenge examples with meaningful data...\n');
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB\n');

    const challenges = await CodingChallenge.find();
    let updated = 0;

    for (const challenge of challenges) {
      const newExamples = getExamplesByTitle(challenge.title);

      // Use updateOne to bypass validation on other fields
      await CodingChallenge.updateOne(
        { _id: challenge._id },
        { $set: { examples: newExamples } }
      );
      updated++;

      if (updated % 20 === 0) {
        console.log(`  ✓ Updated ${updated} challenges...`);
      }
    }

    console.log(`\n✅ Successfully updated ${updated} challenges with meaningful examples!`);

    mongoose.connection.close();
    console.log('\n🎉 Update complete!');
  } catch (error) {
    console.error('❌ Error updating examples:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  updateChallengeExamples();
}

module.exports = updateChallengeExamples;
