/**
 * SEO Utilities and Configuration
 * Comprehensive SEO management for dynamic meta tags, structured data, and social sharing
 */

// Base site configuration
export const SITE_CONFIG = {
  name: 'Seek',
  fullName: 'Seek - Master Programming & Database Skills',
  description: 'Learn programming, database management, and coding through interactive tutorials, challenges, and real-time practice. Master JavaScript, Python, Java, SQL, MongoDB, Redis, and more.',
  url: process.env.REACT_APP_SITE_URL || 'https://seek-platform.com',
  logo: '/logo512.png',
  author: 'Seek Learning Platform',
  keywords: [
    'programming tutorials',
    'coding challenges',
    'database tutorials',
    'learn javascript',
    'learn python',
    'learn java',
    'sql tutorials',
    'mongodb tutorials',
    'redis tutorials',
    'interactive coding',
    'code playground',
    'programming exercises',
    'developer education',
    'coding bootcamp',
    'web development',
    'software engineering'
  ],
  social: {
    twitter: '@SeekPlatform',
    facebook: 'SeekPlatform',
    github: 'seek-platform'
  },
  contact: {
    email: 'support@seek-platform.com'
  }
};

// Generate page-specific SEO configuration
export const generateSEO = ({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  article = null,
  course = null,
  breadcrumbs = []
}) => {
  const fullTitle = title ? `${title} | ${SITE_CONFIG.name}` : SITE_CONFIG.fullName;
  const fullDescription = description || SITE_CONFIG.description;
  const fullUrl = url ? `${SITE_CONFIG.url}${url}` : SITE_CONFIG.url;
  const fullImage = image ? `${SITE_CONFIG.url}${image}` : `${SITE_CONFIG.url}${SITE_CONFIG.logo}`;
  const allKeywords = [...new Set([...SITE_CONFIG.keywords, ...keywords])];

  return {
    title: fullTitle,
    meta: [
      // Primary meta tags
      { name: 'description', content: fullDescription },
      { name: 'keywords', content: allKeywords.join(', ') },
      { name: 'author', content: SITE_CONFIG.author },

      // Open Graph / Facebook
      { property: 'og:type', content: type },
      { property: 'og:url', content: fullUrl },
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: fullDescription },
      { property: 'og:image', content: fullImage },
      { property: 'og:site_name', content: SITE_CONFIG.name },

      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: SITE_CONFIG.social.twitter },
      { name: 'twitter:creator', content: SITE_CONFIG.social.twitter },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: fullDescription },
      { name: 'twitter:image', content: fullImage },

      // Additional SEO
      { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
      { name: 'googlebot', content: 'index, follow' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      { httpEquiv: 'content-language', content: 'en-US' }
    ],
    link: [
      { rel: 'canonical', href: fullUrl }
    ],
    structuredData: generateStructuredData({
      type,
      title: fullTitle,
      description: fullDescription,
      url: fullUrl,
      image: fullImage,
      article,
      course,
      breadcrumbs
    })
  };
};

// Generate structured data (Schema.org JSON-LD)
export const generateStructuredData = ({ type, title, description, url, image, article, course, breadcrumbs }) => {
  const structuredData = [];

  // Organization schema (always include)
  structuredData.push({
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}${SITE_CONFIG.logo}`,
    sameAs: [
      `https://twitter.com/${SITE_CONFIG.social.twitter.replace('@', '')}`,
      `https://facebook.com/${SITE_CONFIG.social.facebook}`,
      `https://github.com/${SITE_CONFIG.social.github}`
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: SITE_CONFIG.contact.email,
      contactType: 'Customer Support'
    }
  });

  // Website schema
  structuredData.push({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_CONFIG.url}/tutorials?search={search_term_string}`,
      'query-input': 'required name=search_term_string'
    }
  });

  // Breadcrumb schema
  if (breadcrumbs && breadcrumbs.length > 0) {
    structuredData.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: `${SITE_CONFIG.url}${crumb.url}`
      }))
    });
  }

  // Course schema
  if (course) {
    structuredData.push({
      '@context': 'https://schema.org',
      '@type': 'Course',
      name: course.name,
      description: course.description,
      provider: {
        '@type': 'Organization',
        name: SITE_CONFIG.name,
        sameAs: SITE_CONFIG.url
      },
      educationalLevel: course.level || 'Beginner',
      inLanguage: 'en-US',
      ...(course.duration && { timeRequired: course.duration }),
      ...(course.skillLevel && { coursePrerequisites: course.skillLevel }),
      ...(course.tags && { keywords: course.tags.join(', ') })
    });
  }

  // Article schema
  if (article) {
    structuredData.push({
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: title,
      description: description,
      image: image,
      author: {
        '@type': 'Organization',
        name: SITE_CONFIG.name
      },
      publisher: {
        '@type': 'Organization',
        name: SITE_CONFIG.name,
        logo: {
          '@type': 'ImageObject',
          url: `${SITE_CONFIG.url}${SITE_CONFIG.logo}`
        }
      },
      datePublished: article.datePublished || new Date().toISOString(),
      dateModified: article.dateModified || new Date().toISOString()
    });
  }

  return structuredData;
};

// Page-specific SEO configurations
export const PAGE_SEO_CONFIG = {
  home: {
    title: 'Master Programming & Database Skills',
    description: 'Learn programming and database management through interactive tutorials, challenges, and real-time practice. Master JavaScript, Python, Java, SQL, MongoDB, Redis, and more.',
    keywords: ['programming tutorials', 'coding challenges', 'learn to code', 'interactive learning', 'developer education'],
    breadcrumbs: []
  },

  dashboard: {
    title: 'Dashboard',
    description: 'Track your learning progress, view achievements, and continue your programming journey. Monitor your coding skills development.',
    keywords: ['learning dashboard', 'progress tracking', 'coding stats', 'achievements'],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Dashboard', url: '/dashboard' }
    ]
  },

  tutorials: {
    title: 'Programming Tutorials',
    description: 'Comprehensive programming tutorials covering JavaScript, Python, Java, TypeScript, C, C++, and more. Learn with interactive examples and practice exercises.',
    keywords: ['programming tutorials', 'coding lessons', 'learn javascript', 'learn python', 'learn java', 'interactive coding'],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Tutorials', url: '/tutorials' }
    ]
  },

  databaseTutorials: {
    title: 'Database Tutorials',
    description: 'Master database management with tutorials on SQL, MongoDB, Redis, PostgreSQL, MySQL, and more. Learn queries, optimization, and best practices.',
    keywords: ['database tutorials', 'sql tutorials', 'mongodb tutorials', 'redis tutorials', 'learn databases', 'database management'],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Database Tutorials', url: '/database-tutorials' }
    ]
  },

  challenges: {
    title: 'Coding Challenges',
    description: 'Test your programming skills with coding challenges. Practice algorithms, data structures, and problem-solving with real-world problems.',
    keywords: ['coding challenges', 'programming problems', 'algorithm practice', 'coding exercises', 'leetcode alternative'],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Challenges', url: '/challenges' }
    ]
  },

  playground: {
    title: 'Code Playground',
    description: 'Write, run, and test code in real-time. Multi-language code editor supporting JavaScript, Python, Java, C, C++, TypeScript, and more.',
    keywords: ['code playground', 'online code editor', 'run code online', 'javascript playground', 'python playground'],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Playground', url: '/playground' }
    ]
  },

  codeTranslator: {
    title: 'Code Translator',
    description: 'Translate code between programming languages instantly. Convert JavaScript to Python, Java to C++, and more with intelligent code translation.',
    keywords: ['code translator', 'convert code', 'programming language converter', 'code transformation'],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Code Translator', url: '/translator' }
    ]
  },

  databaseTranslator: {
    title: 'Database Query Translator',
    description: 'Translate database queries between SQL, MongoDB, Redis, Elasticsearch, and more. Convert queries with explanations and compatibility notes.',
    keywords: ['database query translator', 'sql to mongodb', 'query converter', 'database migration', 'sql translator'],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Database Translator', url: '/database-translator' }
    ]
  },

  games: {
    title: 'Learning Games',
    description: 'Learn programming through interactive games. Master coding concepts with fun, engaging game-based learning experiences.',
    keywords: ['coding games', 'programming games', 'learn coding through games', 'educational games'],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Learning Games', url: '/games' }
    ]
  },

  achievements: {
    title: 'Achievements',
    description: 'View your achievements, badges, and milestones. Track your learning journey and celebrate your coding accomplishments.',
    keywords: ['coding achievements', 'programming badges', 'learning milestones', 'coding progress'],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Achievements', url: '/achievements' }
    ]
  },

  profile: {
    title: 'Profile',
    description: 'Manage your profile, view your coding statistics, and customize your learning preferences.',
    keywords: ['user profile', 'coding profile', 'learning preferences', 'account settings'],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Profile', url: '/profile' }
    ]
  },

  settings: {
    title: 'Settings',
    description: 'Customize your learning experience. Adjust theme, notifications, and account preferences.',
    keywords: ['settings', 'preferences', 'account settings', 'customization'],
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Settings', url: '/settings' }
    ]
  }
};

// Generate tutorial-specific SEO
export const generateTutorialSEO = (tutorial) => {
  const category = tutorial.category || 'Programming';
  const difficulty = tutorial.difficulty || 'Beginner';

  return generateSEO({
    title: tutorial.title,
    description: tutorial.description || `Learn ${tutorial.title} with interactive examples and practice exercises. ${difficulty} level ${category} tutorial.`,
    keywords: [
      tutorial.title.toLowerCase(),
      `${tutorial.title.toLowerCase()} tutorial`,
      category.toLowerCase(),
      difficulty.toLowerCase(),
      'programming tutorial',
      'coding lesson',
      ...(tutorial.tags || [])
    ],
    url: `/tutorials/${tutorial.slug || tutorial.id}`,
    type: 'article',
    course: {
      name: tutorial.title,
      description: tutorial.description,
      level: difficulty,
      tags: tutorial.tags
    },
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Tutorials', url: '/tutorials' },
      { name: category, url: `/tutorials?category=${category}` },
      { name: tutorial.title, url: `/tutorials/${tutorial.slug || tutorial.id}` }
    ]
  });
};

// Generate challenge-specific SEO
export const generateChallengeSEO = (challenge) => {
  const difficulty = challenge.difficulty || 'Medium';

  return generateSEO({
    title: challenge.title,
    description: challenge.description || `Solve ${challenge.title}. ${difficulty} difficulty coding challenge to test your programming skills.`,
    keywords: [
      challenge.title.toLowerCase(),
      `${challenge.title.toLowerCase()} challenge`,
      difficulty.toLowerCase(),
      'coding challenge',
      'programming problem',
      'algorithm',
      ...(challenge.tags || [])
    ],
    url: `/challenges/${challenge.slug || challenge.id}`,
    type: 'article',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Challenges', url: '/challenges' },
      { name: difficulty, url: `/challenges?difficulty=${difficulty}` },
      { name: challenge.title, url: `/challenges/${challenge.slug || challenge.id}` }
    ]
  });
};

// Generate database tutorial SEO
export const generateDatabaseTutorialSEO = (tutorial) => {
  const database = tutorial.database || 'SQL';
  const difficulty = tutorial.difficulty || 'Beginner';

  return generateSEO({
    title: tutorial.title,
    description: tutorial.description || `Master ${tutorial.title} with hands-on ${database} examples. ${difficulty} level database tutorial.`,
    keywords: [
      tutorial.title.toLowerCase(),
      `${database.toLowerCase()} tutorial`,
      `${tutorial.title.toLowerCase()} ${database.toLowerCase()}`,
      'database tutorial',
      'sql tutorial',
      difficulty.toLowerCase(),
      ...(tutorial.tags || [])
    ],
    url: `/database-tutorials/${tutorial.slug || tutorial.id}`,
    type: 'article',
    course: {
      name: tutorial.title,
      description: tutorial.description,
      level: difficulty,
      tags: tutorial.tags
    },
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'Database Tutorials', url: '/database-tutorials' },
      { name: database, url: `/database-tutorials?database=${database}` },
      { name: tutorial.title, url: `/database-tutorials/${tutorial.slug || tutorial.id}` }
    ]
  });
};

// Helper to inject structured data into page
export const injectStructuredData = (structuredData) => {
  if (typeof window === 'undefined') return;

  // Remove existing structured data
  const existingScripts = document.querySelectorAll('script[type="application/ld+json"]');
  existingScripts.forEach(script => {
    if (script.id && script.id.startsWith('structured-data-')) {
      script.remove();
    }
  });

  // Add new structured data
  structuredData.forEach((data, index) => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = `structured-data-${index}`;
    script.text = JSON.stringify(data);
    document.head.appendChild(script);
  });
};

// Performance optimization utilities
export const preloadResources = (resources = []) => {
  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = resource.rel || 'preload';
    link.as = resource.as;
    link.href = resource.href;
    if (resource.crossorigin) link.crossOrigin = resource.crossorigin;
    document.head.appendChild(link);
  });
};

// Generate sitemap data
export const generateSitemapData = () => {
  const baseUrl = SITE_CONFIG.url;
  const pages = [
    { url: '/', priority: 1.0, changefreq: 'daily' },
    { url: '/dashboard', priority: 0.9, changefreq: 'daily' },
    { url: '/tutorials', priority: 0.9, changefreq: 'weekly' },
    { url: '/database-tutorials', priority: 0.9, changefreq: 'weekly' },
    { url: '/challenges', priority: 0.9, changefreq: 'weekly' },
    { url: '/playground', priority: 0.8, changefreq: 'monthly' },
    { url: '/translator', priority: 0.8, changefreq: 'monthly' },
    { url: '/database-translator', priority: 0.8, changefreq: 'monthly' },
    { url: '/games', priority: 0.7, changefreq: 'monthly' },
    { url: '/achievements', priority: 0.6, changefreq: 'monthly' },
    { url: '/profile', priority: 0.5, changefreq: 'weekly' },
    { url: '/settings', priority: 0.4, changefreq: 'monthly' }
  ];

  return pages.map(page => ({
    ...page,
    url: `${baseUrl}${page.url}`,
    lastmod: new Date().toISOString()
  }));
};

export default {
  SITE_CONFIG,
  PAGE_SEO_CONFIG,
  generateSEO,
  generateStructuredData,
  generateTutorialSEO,
  generateChallengeSEO,
  generateDatabaseTutorialSEO,
  injectStructuredData,
  preloadResources,
  generateSitemapData
};
