import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Step 1: Seed Learning Types
  console.log('📚 Seeding Learning Types...');
  
  const visualType = await prisma.learningType.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      typeName: 'Visual',
      description: 'Learns best through visual aids, diagrams, charts, and written instructions. Prefers to see information presented graphically.'
    }
  });

  const auditoryType = await prisma.learningType.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      typeName: 'Auditory',
      description: 'Learns best through listening, discussions, and verbal explanations. Prefers audio content and spoken instructions.'
    }
  });

  const kinestheticType = await prisma.learningType.upsert({
    where: { id: 3 },
    update: {},
    create: {
      id: 3,
      typeName: 'Kinesthetic',
      description: 'Learns best through hands-on activities, practice, and physical engagement. Prefers interactive and practical experiences.'
    }
  });

  console.log(`✅ Created/Updated Learning Types: ${visualType.typeName}, ${auditoryType.typeName}, ${kinestheticType.typeName}`);

  // Step 2: Seed Sample Videos
  console.log('🎥 Seeding Sample Videos...');

  const videos = [
    {
      id: 1,
      title: 'JavaScript Fundamentals - Complete Course',
      description: 'A comprehensive tutorial covering JavaScript basics including variables, functions, objects, and DOM manipulation. Perfect for beginners starting their web development journey.',
      transcript: 'Welcome to JavaScript fundamentals. In this course, we will cover variables, data types, functions, objects, arrays, and DOM manipulation. Let\'s start with declaring variables using let, const, and var keywords...'
    },
    {
      id: 2,
      title: 'React Hooks Explained with Examples',
      description: 'Deep dive into React Hooks including useState, useEffect, useContext, and custom hooks. Learn through practical examples and real-world scenarios.',
      transcript: 'React Hooks revolutionized how we write React components. Today we\'ll explore useState for state management, useEffect for side effects, and how to create custom hooks for reusable logic...'
    },
    {
      id: 3,
      title: 'Build a Full-Stack Todo App - Step by Step',
      description: 'Hands-on tutorial building a complete todo application using React, Node.js, Express, and MongoDB. Follow along and code together.',
      transcript: 'Let\'s build a full-stack todo application from scratch. We\'ll start by setting up our React frontend, then create our Express backend with MongoDB integration. Open your code editor and let\'s begin...'
    },
    {
      id: 4,
      title: 'CSS Grid Layout - Visual Guide',
      description: 'Master CSS Grid with visual examples and interactive demonstrations. See how grid properties work in real-time with clear visual representations.',
      transcript: 'CSS Grid is a powerful layout system. Let\'s visualize how grid-template-columns, grid-template-rows, and grid-gap work together to create responsive layouts...'
    },
    {
      id: 5,
      title: 'Database Design Principles Explained',
      description: 'Learn database normalization, relationships, and design patterns through clear explanations and visual diagrams. Understand when to use different database structures.',
      transcript: 'Database design is crucial for application performance. We\'ll discuss normalization forms, entity relationships, indexing strategies, and when to denormalize for performance...'
    },
    {
      id: 6,
      title: 'Python Data Analysis Workshop',
      description: 'Interactive workshop using pandas, numpy, and matplotlib for data analysis. Work with real datasets and create visualizations.',
      transcript: 'Welcome to our Python data analysis workshop. We\'ll use pandas to load and manipulate data, numpy for numerical operations, and matplotlib for creating insightful visualizations. Let\'s start by importing our libraries...'
    },
    {
      id: 7,
      title: 'API Design Best Practices',
      description: 'Comprehensive guide to RESTful API design, including HTTP methods, status codes, authentication, and documentation strategies.',
      transcript: 'Good API design is essential for modern applications. We\'ll cover REST principles, proper use of HTTP methods, status codes, authentication patterns, and how to document your APIs effectively...'
    },
    {
      id: 8,
      title: 'Machine Learning Concepts Visualized',
      description: 'Visual explanation of machine learning algorithms including linear regression, decision trees, and neural networks with interactive diagrams.',
      transcript: 'Machine learning can seem complex, but visual representations make it clearer. Let\'s explore how linear regression finds the best fit line, how decision trees make splits, and how neural networks process information...'
    }
  ];

  await prisma.video.createMany({
    data: videos,
    skipDuplicates: true
  });

  console.log(`✅ Created ${videos.length} sample videos`);

  // Step 3: Seed Video Tags (linking videos to learning types with scores)
  console.log('🏷️ Seeding Video Tags...');

  const videoTags = [
    // Video 1: JavaScript Fundamentals - Balanced for all learning types
    { videoId: 1, learningTypeId: 1, keyword: 'visual-examples', score: 7.5 },
    { videoId: 1, learningTypeId: 2, keyword: 'verbal-explanation', score: 8.0 },
    { videoId: 1, learningTypeId: 3, keyword: 'code-practice', score: 6.5 },

    // Video 2: React Hooks - More visual and auditory
    { videoId: 2, learningTypeId: 1, keyword: 'code-examples', score: 8.5 },
    { videoId: 2, learningTypeId: 2, keyword: 'detailed-explanation', score: 9.0 },
    { videoId: 2, learningTypeId: 3, keyword: 'hands-on-examples', score: 7.0 },

    // Video 3: Full-Stack Todo App - Highly kinesthetic (hands-on coding)
    { videoId: 3, learningTypeId: 1, keyword: 'step-by-step-visual', score: 7.0 },
    { videoId: 3, learningTypeId: 2, keyword: 'guided-instruction', score: 7.5 },
    { videoId: 3, learningTypeId: 3, keyword: 'build-along-project', score: 9.5 },

    // Video 4: CSS Grid - Highly visual
    { videoId: 4, learningTypeId: 1, keyword: 'visual-demonstrations', score: 9.5 },
    { videoId: 4, learningTypeId: 2, keyword: 'property-explanation', score: 6.0 },
    { videoId: 4, learningTypeId: 3, keyword: 'interactive-examples', score: 7.5 },

    // Video 5: Database Design - More auditory and visual
    { videoId: 5, learningTypeId: 1, keyword: 'diagrams-charts', score: 8.5 },
    { videoId: 5, learningTypeId: 2, keyword: 'concept-explanation', score: 9.0 },
    { videoId: 5, learningTypeId: 3, keyword: 'practical-examples', score: 6.0 },

    // Video 6: Python Data Analysis - Highly kinesthetic (workshop format)
    { videoId: 6, learningTypeId: 1, keyword: 'data-visualization', score: 8.0 },
    { videoId: 6, learningTypeId: 2, keyword: 'workshop-instruction', score: 7.0 },
    { videoId: 6, learningTypeId: 3, keyword: 'hands-on-workshop', score: 9.0 },

    // Video 7: API Design - Balanced, slightly more auditory
    { videoId: 7, learningTypeId: 1, keyword: 'design-patterns', score: 7.5 },
    { videoId: 7, learningTypeId: 2, keyword: 'best-practices-explanation', score: 8.5 },
    { videoId: 7, learningTypeId: 3, keyword: 'implementation-examples', score: 7.0 },

    // Video 8: Machine Learning Visualized - Highly visual
    { videoId: 8, learningTypeId: 1, keyword: 'algorithm-visualization', score: 9.5 },
    { videoId: 8, learningTypeId: 2, keyword: 'concept-narration', score: 7.5 },
    { videoId: 8, learningTypeId: 3, keyword: 'interactive-diagrams', score: 8.0 }
  ];

  await prisma.videoTag.createMany({
    data: videoTags,
    skipDuplicates: true
  });

  console.log(`✅ Created ${videoTags.length} video tags linking videos to learning types`);

  // Summary
  console.log('\n🎉 Database seeding completed successfully!');
  console.log('\n📊 Seeding Summary:');
  console.log(`   • Learning Types: 3 (Visual, Auditory, Kinesthetic)`);
  console.log(`   • Videos: ${videos.length} sample videos with realistic content`);
  console.log(`   • Video Tags: ${videoTags.length} tags with learning type scores`);
  console.log('\n🚀 Your Clario database is now ready for testing!');
  console.log('\n💡 Next steps:');
  console.log('   1. Test the video search and scoring algorithms');
  console.log('   2. Create test users with different learning types');
  console.log('   3. Verify personalized video recommendations work correctly');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });