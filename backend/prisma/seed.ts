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

  // Step 4: Seed Sample Users (Instructors)
  console.log('👥 Seeding Sample Users (Instructors)...');

  const instructor1 = await prisma.user.create({
    data: {
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@example.com',
      learningType: {
        connect: { id: 1 } // Visual learner
      }
    }
  });

  const instructor2 = await prisma.user.create({
    data: {
      name: 'Prof. Michael Chen',
      email: 'michael.chen@example.com',
      learningType: {
        connect: { id: 2 } // Auditory learner
      }
    }
  });

  console.log(`✅ Created sample instructors: ${instructor1.name}, ${instructor2.name}`);

  // Step 5: Seed Sample Courses
  console.log('📚 Seeding Sample Courses...');

  const webDevCourse = await prisma.course.upsert({
    where: { id: 'course-web-dev-fundamentals' },
    update: {},
    create: {
      id: 'course-web-dev-fundamentals',
      title: 'Web Development Fundamentals',
      description: 'A comprehensive course covering the basics of web development, from HTML and CSS to JavaScript and React. Perfect for beginners who want to start their journey in web development.',
      thumbnailUrl: 'https://example.com/thumbnails/web-dev-fundamentals.jpg',
      instructor: {
        connect: { id: instructor1.id }
      }
    }
  });

  const dataAnalysisCourse = await prisma.course.upsert({
    where: { id: 'course-data-analysis-python' },
    update: {},
    create: {
      id: 'course-data-analysis-python',
      title: 'Data Analysis with Python',
      description: 'Learn data analysis using Python, pandas, and visualization libraries. This course combines theoretical concepts with hands-on practice using real datasets.',
      thumbnailUrl: 'https://example.com/thumbnails/data-analysis-python.jpg',
      instructor: {
        connect: { id: instructor2.id }
      }
    }
  });

  console.log(`✅ Created sample courses: ${webDevCourse.title}, ${dataAnalysisCourse.title}`);

  // Step 6: Seed Course Lessons
  console.log('📖 Seeding Course Lessons...');

  // Web Development Fundamentals Course Lessons
  const webDevLessons = [
    { courseId: webDevCourse.id, videoId: 1, order: 1 }, // JavaScript Fundamentals
    { courseId: webDevCourse.id, videoId: 4, order: 2 }, // CSS Grid Layout
    { courseId: webDevCourse.id, videoId: 2, order: 3 }, // React Hooks
    { courseId: webDevCourse.id, videoId: 3, order: 4 }, // Full-Stack Todo App
    { courseId: webDevCourse.id, videoId: 7, order: 5 }, // API Design Best Practices
  ];

  // Data Analysis Course Lessons
  const dataAnalysisLessons = [
    { courseId: dataAnalysisCourse.id, videoId: 6, order: 1 }, // Python Data Analysis Workshop
    { courseId: dataAnalysisCourse.id, videoId: 5, order: 2 }, // Database Design Principles
    { courseId: dataAnalysisCourse.id, videoId: 8, order: 3 }, // Machine Learning Concepts
  ];

  const allLessons = [...webDevLessons, ...dataAnalysisLessons];

  await prisma.lesson.createMany({
    data: allLessons,
    skipDuplicates: true
  });

  console.log(`✅ Created ${allLessons.length} course lessons`);

  // Step 7: Seed Sample Tracks
  console.log('🛤️ Seeding Sample Tracks...');

  const fullStackTrack = await prisma.track.upsert({
    where: { id: 'track-fullstack-journey' },
    update: {},
    create: {
      id: 'track-fullstack-journey',
      title: 'Full-Stack Development Journey',
      description: 'A comprehensive learning path that takes you from web development fundamentals to advanced full-stack development. Perfect for aspiring developers who want to build complete web applications.',
      thumbnailUrl: 'https://example.com/thumbnails/fullstack-journey.jpg',
      category: 'Web Development',
      level: 'intermediate',
      totalDuration: 1800, // 30 hours
      enrollmentCount: 245,
      isPublished: true,
    }
  });

  const dataTrack = await prisma.track.upsert({
    where: { id: 'track-data-mastery' },
    update: {},
    create: {
      id: 'track-data-mastery',
      title: 'Data Science Mastery',
      description: 'Master data analysis, visualization, and machine learning with Python. This track combines theoretical knowledge with hands-on projects using real-world datasets.',
      thumbnailUrl: 'https://example.com/thumbnails/data-mastery.jpg',
      category: 'Data Science',
      level: 'advanced',
      totalDuration: 2400, // 40 hours
      enrollmentCount: 189,
      isPublished: true,
    }
  });

  console.log(`✅ Created sample tracks: ${fullStackTrack.title}, ${dataTrack.title}`);

  // Step 8: Seed TrackCourse relationships
  console.log('🔗 Seeding Track-Course relationships...');

  const trackCourseRelations = [
    // Full-Stack Development Journey Track
    { trackId: fullStackTrack.id, courseId: webDevCourse.id, order: 1 },
    { trackId: fullStackTrack.id, courseId: dataAnalysisCourse.id, order: 2 },
    
    // Data Science Mastery Track
    { trackId: dataTrack.id, courseId: dataAnalysisCourse.id, order: 1 },
  ];

  await prisma.trackCourse.createMany({
    data: trackCourseRelations,
    skipDuplicates: true
  });

  console.log(`✅ Created ${trackCourseRelations.length} track-course relationships`);

  // Step 9: Seed Sample Projects with Course Links
  console.log('📋 Seeding Sample Projects...');

  const sampleProject = await prisma.project.create({
    data: {
      title: 'E-commerce Website Development',
      description: 'Build a complete e-commerce website using modern web technologies. Apply concepts from the Web Development Fundamentals course.',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      userId: instructor1.id,
      courseId: webDevCourse.id // Link to Web Development Fundamentals course
    }
  });

  const dataProject = await prisma.project.create({
    data: {
      title: 'Customer Analytics Dashboard',
      description: 'Create an interactive dashboard analyzing customer behavior using Python, pandas, and visualization libraries. Apply data analysis techniques from the course.',
      deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
      userId: instructor2.id,
      courseId: dataAnalysisCourse.id // Link to Data Analysis course
    }
  });

  console.log(`✅ Created sample projects: ${sampleProject.title}, ${dataProject.title}`);

  // Summary
  console.log('\n🎉 Database seeding completed successfully!');
  console.log('\n📊 Seeding Summary:');
  console.log(`   • Learning Types: 3 (Visual, Auditory, Kinesthetic)`);
  console.log(`   • Videos: ${videos.length} sample videos with realistic content`);
  console.log(`   • Video Tags: ${videoTags.length} tags with learning type scores`);
  console.log(`   • Instructors: 2 sample instructors`);
  console.log(`   • Courses: 2 sample courses`);
  console.log(`   • Lessons: ${allLessons.length} course lessons`);
  console.log(`   • Tracks: 2 sample tracks`);
  console.log(`   • Track-Course Relations: ${trackCourseRelations.length} relationships`);
  console.log(`   • Projects: 2 sample projects (linked to courses)`);
  console.log('\n🚀 Your Clario database is now ready for testing!');
  console.log('\n💡 Next steps:');
  console.log('   1. Test the unified course system across Learn, Tracks, and Projects');
  console.log('   2. Test the video search and scoring algorithms');
  console.log('   3. Create test users with different learning types');
  console.log('   4. Verify personalized recommendations work correctly');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });