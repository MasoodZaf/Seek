export interface CodeExample {
  language: string;
  code: string;
  explanation: string;
  isExecutable: boolean;
}

export interface Practice {
  type: string;
  instructions: string;
  starterCode: string;
  solution: string;
  hints: string[];
}

export interface QuizOption {
  text: string;
  isCorrect: boolean;
}

export interface Quiz {
  question: string;
  options: QuizOption[];
  explanation: string;
}

export interface TutorialStep {
  stepNumber: number;
  title: string;
  content: string;
  codeExamples: CodeExample[];
  practice?: Practice;
  quiz?: Quiz;
}

export interface Tutorial {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  language: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  thumbnail?: string;
  tags: string[];
  prerequisites: string[];
  learningObjectives: string[];
  isFeatured: boolean;
  rating: { average: number; count: number };
  stats: { views: number; completions: number; likes: number };
  author?: { name: string; avatar?: string };
  stepCount?: number;
  steps?: TutorialStep[];
  enrolled?: boolean;
  progress?: number;
}
