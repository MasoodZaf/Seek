#!/usr/bin/env node
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const MongoTutorial = require('../models/MongoTutorial');

const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/seek_platform';

// ── Helpers ──
function makeTutorial(t) {
  return {
    title: t.title, slug: t.slug, description: t.description,
    category: t.category || 'Programming Fundamentals',
    language: t.language, difficulty: t.difficulty,
    estimatedTime: t.duration || 45,
    tags: t.tags, prerequisites: t.prerequisites || [],
    learningObjectives: t.objectives,
    isFeatured: !!t.featured, isPublished: true,
    steps: t.steps,
    resources: t.resources || [],
    author: { name: t.author || 'CodeArc', bio: 'Professional programming education' },
    rating: { average: +(3.8 + Math.random() * 1.1).toFixed(1), count: 50 + Math.floor(Math.random() * 200) },
    stats: {
      views: 300 + Math.floor(Math.random() * 3000),
      completions: 150 + Math.floor(Math.random() * 1500),
      likes: 30 + Math.floor(Math.random() * 400)
    }
  };
}

function makeStep(n, s) {
  return {
    stepNumber: n, title: s.title, content: s.content,
    codeExamples: [{ language: s.lang, code: s.code, explanation: s.codeExp || '', isExecutable: s.exec !== false }],
    learnPhase: {
      conceptExplanation: s.concept, keyPoints: s.keyPoints,
      realWorldExample: s.realWorld, commonMistakes: s.mistakes
    },
    practicePhase: {
      instructions: s.pInstructions.map((inst, i) => ({ step: i + 1, instruction: inst })),
      starterCode: s.starter, solution: s.solution,
      hints: (s.hints || []).map((h, i) => ({ level: i + 1, hint: h }))
    },
    challengePhase: {
      problemStatement: s.challenge, requirements: s.reqs,
      testCases: (s.tests || []).map(tc => ({ input: tc[0], expected: tc[1], points: tc[2] || 5 }))
    }
  };
}

// ── Load all data files ──
const loaders = [
  './data/jsTutorials',
  './data/pyTutorials',
  './data/tsTutorials',
  './data/javaTutorials',
  './data/cTutorials',
  './data/cppTutorials',
  './data/mongodbTutorials',
  './data/sqlTutorials',
  './data/pgTutorials',
  './data/redisTutorials',
];

async function seed() {
  await mongoose.connect(mongoURI);
  console.log('Connected to MongoDB');

  await MongoTutorial.deleteMany({});
  console.log('Cleared existing tutorials');

  let total = 0;
  for (const path of loaders) {
    const gen = require(path);
    const batch = gen(makeTutorial, makeStep);
    if (batch.length) {
      await MongoTutorial.insertMany(batch, { ordered: false });
      console.log(`  ${path.split('/').pop()}: ${batch.length} tutorials`);
      total += batch.length;
    }
  }

  console.log(`\nTotal inserted: ${total}`);
  const summary = await MongoTutorial.aggregate([
    { $group: { _id: { cat: '$category', lang: '$language' }, n: { $sum: 1 } } },
    { $sort: { '_id.cat': 1, '_id.lang': 1 } }
  ]);
  console.log('\n── By category / language ──');
  summary.forEach(s => console.log(`  ${s._id.cat} / ${s._id.lang}: ${s.n}`));

  await mongoose.disconnect();
  console.log('\nDone!');
}

seed().catch(e => { console.error(e); process.exit(1); });
