import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data to avoid conflicts
  console.log('🧹 Clearing existing data...');
  await prisma.reminder.deleteMany();
  await prisma.accountabilityFee.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.project.deleteMany();
  await prisma.userVideoHistory.deleteMany();
  await prisma.trackCourse.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.course.deleteMany();
  await prisma.track.deleteMany();
  await prisma.videoTag.deleteMany();
  await prisma.video.deleteMany();
  await prisma.user.deleteMany();
  await prisma.learningType.deleteMany();
  console.log('✅ Cleared existing data');

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

  // Step 4: Seed Demo User Personas (5 diverse learners for MVP demo)
  console.log('👥 Seeding Demo User Personas...');

  // User 1: Alex Chen - Visual Learner, College Student (High Engagement)
  const alexChen = await prisma.user.upsert({
    where: { email: 'alex.chen@clario-demo.com' },
    update: {},
    create: {
      name: 'Alex Chen',
      email: 'alex.chen@clario-demo.com',
      learningType: {
        connect: { id: 1 } // Visual learner
      }
    }
  });

  // User 2: Maya Rodriguez - Auditory Learner, Early Professional (Medium Engagement)
  const mayaRodriguez = await prisma.user.upsert({
    where: { email: 'maya.rodriguez@clario-demo.com' },
    update: {},
    create: {
      name: 'Maya Rodriguez',
      email: 'maya.rodriguez@clario-demo.com',
      learningType: {
        connect: { id: 2 } // Auditory learner
      }
    }
  });

  // User 3: Jordan Park - Kinesthetic Learner, Independent Developer (Very High Engagement)
  const jordanPark = await prisma.user.upsert({
    where: { email: 'jordan.park@clario-demo.com' },
    update: {},
    create: {
      name: 'Jordan Park',
      email: 'jordan.park@clario-demo.com',
      learningType: {
        connect: { id: 3 } // Kinesthetic learner
      }
    }
  });

  // User 4: Sarah Thompson - Visual Learner, Career Switcher (New User)
  const sarahThompson = await prisma.user.upsert({
    where: { email: 'sarah.thompson@clario-demo.com' },
    update: {},
    create: {
      name: 'Sarah Thompson',
      email: 'sarah.thompson@clario-demo.com',
      learningType: {
        connect: { id: 1 } // Visual learner
      }
    }
  });

  // User 5: David Kumar - Auditory Learner, Graduate Student (Medium-High Engagement)
  const davidKumar = await prisma.user.upsert({
    where: { email: 'david.kumar@clario-demo.com' },
    update: {},
    create: {
      name: 'David Kumar',
      email: 'david.kumar@clario-demo.com',
      learningType: {
        connect: { id: 2 } // Auditory learner
      }
    }
  });

  // Additional Instructors for courses
  const instructor1 = await prisma.user.upsert({
    where: { email: 'sarah.johnson@example.com' },
    update: {},
    create: {
      name: 'Dr. Sarah Johnson',
      email: 'sarah.johnson@example.com',
      learningType: {
        connect: { id: 1 } // Visual learner
      }
    }
  });

  const instructor2 = await prisma.user.upsert({
    where: { email: 'michael.chen@example.com' },
    update: {},
    create: {
      name: 'Prof. Michael Chen',
      email: 'michael.chen@example.com',
      learningType: {
        connect: { id: 2 } // Auditory learner
      }
    }
  });

  console.log(`✅ Created 5 demo user personas + 2 instructors`);

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

  // Step 9: Seed Video History for Demo Users
  console.log('📺 Seeding Video History for Demo Users...');

  const now = new Date();
  const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  // Alex Chen - Visual Learner (8-10 videos, mix of completed & in-progress)
  const alexHistory = [
    { userId: alexChen.id, videoId: 4, percentWatched: 100, status: 'COMPLETED' as const, watchedAt: daysAgo(18), completedAt: daysAgo(18) },
    { userId: alexChen.id, videoId: 8, percentWatched: 100, status: 'COMPLETED' as const, watchedAt: daysAgo(15), completedAt: daysAgo(15) },
    { userId: alexChen.id, videoId: 1, percentWatched: 100, status: 'COMPLETED' as const, watchedAt: daysAgo(12), completedAt: daysAgo(12) },
    { userId: alexChen.id, videoId: 2, percentWatched: 75, status: 'STARTED' as const, watchedAt: daysAgo(8) },
    { userId: alexChen.id, videoId: 5, percentWatched: 60, status: 'STARTED' as const, watchedAt: daysAgo(5) },
    { userId: alexChen.id, videoId: 7, percentWatched: 40, status: 'STARTED' as const, watchedAt: daysAgo(3) },
    { userId: alexChen.id, videoId: 3, percentWatched: 85, status: 'STARTED' as const, watchedAt: daysAgo(2) },
    { userId: alexChen.id, videoId: 6, percentWatched: 30, status: 'STARTED' as const, watchedAt: daysAgo(1) },
  ];

  // Maya Rodriguez - Auditory Learner (6-8 videos, prefers lectures)
  const mayaHistory = [
    { userId: mayaRodriguez.id, videoId: 5, percentWatched: 100, status: 'COMPLETED' as const, watchedAt: daysAgo(20), completedAt: daysAgo(20) },
    { userId: mayaRodriguez.id, videoId: 7, percentWatched: 100, status: 'COMPLETED' as const, watchedAt: daysAgo(14), completedAt: daysAgo(14) },
    { userId: mayaRodriguez.id, videoId: 1, percentWatched: 90, status: 'STARTED' as const, watchedAt: daysAgo(10) },
    { userId: mayaRodriguez.id, videoId: 2, percentWatched: 100, status: 'COMPLETED' as const, watchedAt: daysAgo(7), completedAt: daysAgo(7) },
    { userId: mayaRodriguez.id, videoId: 4, percentWatched: 65, status: 'STARTED' as const, watchedAt: daysAgo(4) },
    { userId: mayaRodriguez.id, videoId: 8, percentWatched: 45, status: 'STARTED' as const, watchedAt: daysAgo(2) },
  ];

  // Jordan Park - Kinesthetic Learner (12+ videos, workshops & coding-along)
  const jordanHistory = [
    { userId: jordanPark.id, videoId: 3, percentWatched: 100, status: 'COMPLETED' as const, watchedAt: daysAgo(40), completedAt: daysAgo(40) },
    { userId: jordanPark.id, videoId: 6, percentWatched: 100, status: 'COMPLETED' as const, watchedAt: daysAgo(35), completedAt: daysAgo(35) },
    { userId: jordanPark.id, videoId: 1, percentWatched: 100, status: 'COMPLETED' as const, watchedAt: daysAgo(30), completedAt: daysAgo(30) },
    { userId: jordanPark.id, videoId: 2, percentWatched: 100, status: 'COMPLETED' as const, watchedAt: daysAgo(25), completedAt: daysAgo(25) },
    { userId: jordanPark.id, videoId: 7, percentWatched: 100, status: 'COMPLETED' as const, watchedAt: daysAgo(20), completedAt: daysAgo(20) },
    { userId: jordanPark.id, videoId: 4, percentWatched: 100, status: 'COMPLETED' as const, watchedAt: daysAgo(15), completedAt: daysAgo(15) },
    { userId: jordanPark.id, videoId: 5, percentWatched: 100, status: 'COMPLETED' as const, watchedAt: daysAgo(12), completedAt: daysAgo(12) },
    { userId: jordanPark.id, videoId: 8, percentWatched: 100, status: 'COMPLETED' as const, watchedAt: daysAgo(10), completedAt: daysAgo(10) },
    { userId: jordanPark.id, videoId: 3, percentWatched: 95, status: 'STARTED' as const, watchedAt: daysAgo(6) },
    { userId: jordanPark.id, videoId: 6, percentWatched: 80, status: 'STARTED' as const, watchedAt: daysAgo(4) },
    { userId: jordanPark.id, videoId: 1, percentWatched: 70, status: 'STARTED' as const, watchedAt: daysAgo(2) },
    { userId: jordanPark.id, videoId: 2, percentWatched: 55, status: 'STARTED' as const, watchedAt: daysAgo(1) },
  ];

  // Sarah Thompson - Visual Learner, New User (4-5 videos, just getting started)
  const sarahHistory = [
    { userId: sarahThompson.id, videoId: 1, percentWatched: 100, status: 'COMPLETED' as const, watchedAt: daysAgo(4), completedAt: daysAgo(4) },
    { userId: sarahThompson.id, videoId: 4, percentWatched: 80, status: 'STARTED' as const, watchedAt: daysAgo(3) },
    { userId: sarahThompson.id, videoId: 8, percentWatched: 60, status: 'STARTED' as const, watchedAt: daysAgo(2) },
    { userId: sarahThompson.id, videoId: 2, percentWatched: 35, status: 'STARTED' as const, watchedAt: daysAgo(1) },
  ];

  // David Kumar - Auditory Learner, Graduate Student (7-9 videos, data science focus)
  const davidHistory = [
    { userId: davidKumar.id, videoId: 6, percentWatched: 100, status: 'COMPLETED' as const, watchedAt: daysAgo(25), completedAt: daysAgo(25) },
    { userId: davidKumar.id, videoId: 8, percentWatched: 100, status: 'COMPLETED' as const, watchedAt: daysAgo(20), completedAt: daysAgo(20) },
    { userId: davidKumar.id, videoId: 5, percentWatched: 100, status: 'COMPLETED' as const, watchedAt: daysAgo(15), completedAt: daysAgo(15) },
    { userId: davidKumar.id, videoId: 1, percentWatched: 85, status: 'STARTED' as const, watchedAt: daysAgo(10) },
    { userId: davidKumar.id, videoId: 7, percentWatched: 75, status: 'STARTED' as const, watchedAt: daysAgo(7) },
    { userId: davidKumar.id, videoId: 2, percentWatched: 90, status: 'STARTED' as const, watchedAt: daysAgo(5) },
    { userId: davidKumar.id, videoId: 4, percentWatched: 50, status: 'STARTED' as const, watchedAt: daysAgo(3) },
    { userId: davidKumar.id, videoId: 3, percentWatched: 40, status: 'STARTED' as const, watchedAt: daysAgo(1) },
  ];

  const allHistory = [...alexHistory, ...mayaHistory, ...jordanHistory, ...sarahHistory, ...davidHistory];
  
  await prisma.userVideoHistory.createMany({
    data: allHistory,
    skipDuplicates: true
  });

  console.log(`✅ Created ${allHistory.length} video history entries for demo users`);

  // Step 10: Seed Projects for Demo Users
  console.log('📋 Seeding Projects for Demo Users...');

  // Alex Chen Projects - 3 active, high engagement
  const alexProjects = [
    {
      title: 'Personal Portfolio Website',
      description: 'Modern portfolio showcasing my web development projects with interactive animations and responsive design.',
      deadline: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000),
      userId: alexChen.id,
      courseId: webDevCourse.id,
      createdAt: daysAgo(30)
    },
    {
      title: 'React Design System',
      description: 'Component library with reusable UI components following Material Design principles.',
      deadline: new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000),
      userId: alexChen.id,
      courseId: webDevCourse.id,
      createdAt: daysAgo(20)
    },
    {
      title: 'E-commerce Dashboard',
      description: 'Admin dashboard for managing products, orders, and customers with real-time analytics.',
      deadline: new Date(now.getTime() + 40 * 24 * 60 * 60 * 1000),
      userId: alexChen.id,
      courseId: webDevCourse.id,
      createdAt: daysAgo(10)
    }
  ];

  // Maya Rodriguez Projects - 2 active
  const mayaProjects = [
    {
      title: 'REST API for Mobile App',
      description: 'Building a scalable Node.js API with authentication, rate limiting, and comprehensive documentation.',
      deadline: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000),
      userId: mayaRodriguez.id,
      courseId: webDevCourse.id,
      createdAt: daysAgo(25)
    },
    {
      title: 'Database Optimization Project',
      description: 'Improving query performance and implementing caching strategies for high-traffic application.',
      deadline: new Date(now.getTime() + 35 * 24 * 60 * 60 * 1000),
      userId: mayaRodriguez.id,
      courseId: dataAnalysisCourse.id,
      createdAt: daysAgo(15)
    }
  ];

  // Jordan Park Projects - 4 active, very high engagement
  const jordanProjects = [
    {
      title: 'Full-Stack Todo Application',
      description: 'Complete task management app with React frontend, Express backend, and MongoDB database.',
      deadline: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000),
      userId: jordanPark.id,
      courseId: webDevCourse.id,
      createdAt: daysAgo(50)
    },
    {
      title: 'Real-time Chat Application',
      description: 'WebSocket-based chat with rooms, file sharing, and user presence indicators.',
      deadline: new Date(now.getTime() + 18 * 24 * 60 * 60 * 1000),
      userId: jordanPark.id,
      courseId: webDevCourse.id,
      createdAt: daysAgo(40)
    },
    {
      title: 'Weather Dashboard Widget',
      description: 'Interactive weather visualization with API integration and location-based forecasts.',
      deadline: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      userId: jordanPark.id,
      courseId: webDevCourse.id,
      createdAt: daysAgo(25)
    },
    {
      title: 'Expense Tracker Mobile App',
      description: 'React Native app for tracking personal finances with charts and budget alerts.',
      deadline: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000),
      userId: jordanPark.id,
      courseId: webDevCourse.id,
      createdAt: daysAgo(15)
    }
  ];

  // Sarah Thompson Projects - 1 active, new user
  const sarahProjects = [
    {
      title: 'My First Full-Stack App',
      description: 'Learning project: Building a simple blog application with user authentication and CRUD operations.',
      deadline: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000),
      userId: sarahThompson.id,
      courseId: webDevCourse.id,
      createdAt: daysAgo(5)
    }
  ];

  // David Kumar Projects - 3 active
  const davidProjects = [
    {
      title: 'Research Data Dashboard',
      description: 'Interactive visualization of research data using D3.js and Python backend for analysis.',
      deadline: new Date(now.getTime() + 22 * 24 * 60 * 60 * 1000),
      userId: davidKumar.id,
      courseId: dataAnalysisCourse.id,
      createdAt: daysAgo(35)
    },
    {
      title: 'Machine Learning Model Pipeline',
      description: 'End-to-end ML pipeline for predicting student performance with automated data preprocessing.',
      deadline: new Date(now.getTime() + 38 * 24 * 60 * 60 * 1000),
      userId: davidKumar.id,
      courseId: dataAnalysisCourse.id,
      createdAt: daysAgo(28)
    },
    {
      title: 'Data ETL Pipeline',
      description: 'Automated data extraction, transformation, and loading system for research database.',
      deadline: new Date(now.getTime() + 50 * 24 * 60 * 60 * 1000),
      userId: davidKumar.id,
      courseId: dataAnalysisCourse.id,
      createdAt: daysAgo(20)
    }
  ];

  const allProjects = [...alexProjects, ...mayaProjects, ...jordanProjects, ...sarahProjects, ...davidProjects];
  
  const createdProjects = [];
  for (const projectData of allProjects) {
    const project = await prisma.project.create({ data: projectData });
    createdProjects.push(project);
  }

  console.log(`✅ Created ${createdProjects.length} projects for demo users`);

  // Step 11: Seed Milestones for Projects
  console.log('🎯 Seeding Milestones for Projects...');

  const milestones = [
    // Alex Chen - Portfolio Project (Project 1) - High completion
    { projectId: createdProjects[0].id, title: 'Design mockups', dueDate: daysAgo(25), status: 'COMPLETED' as const },
    { projectId: createdProjects[0].id, title: 'Setup project structure', dueDate: daysAgo(20), status: 'COMPLETED' as const },
    { projectId: createdProjects[0].id, title: 'Build homepage', dueDate: daysAgo(15), status: 'COMPLETED' as const },
    { projectId: createdProjects[0].id, title: 'Add project gallery', dueDate: daysAgo(10), status: 'COMPLETED' as const },
    { projectId: createdProjects[0].id, title: 'Implement animations', dueDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), status: 'PENDING' as const },
    { projectId: createdProjects[0].id, title: 'Deploy to production', dueDate: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000), status: 'PENDING' as const },

    // Alex Chen - Design System (Project 2) - In progress
    { projectId: createdProjects[1].id, title: 'Define color palette', dueDate: daysAgo(18), status: 'COMPLETED' as const },
    { projectId: createdProjects[1].id, title: 'Create button components', dueDate: daysAgo(12), status: 'COMPLETED' as const },
    { projectId: createdProjects[1].id, title: 'Build form components', dueDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), status: 'PENDING' as const },
    { projectId: createdProjects[1].id, title: 'Add documentation', dueDate: new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000), status: 'PENDING' as const },

    // Alex Chen - E-commerce Dashboard (Project 3) - Just started
    { projectId: createdProjects[2].id, title: 'Project planning', dueDate: daysAgo(8), status: 'COMPLETED' as const },
    { projectId: createdProjects[2].id, title: 'Database schema design', dueDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), status: 'PENDING' as const },
    { projectId: createdProjects[2].id, title: 'Setup authentication', dueDate: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000), status: 'PENDING' as const },

    // Maya Rodriguez - REST API (Project 4) - Good progress
    { projectId: createdProjects[3].id, title: 'API architecture design', dueDate: daysAgo(22), status: 'COMPLETED' as const },
    { projectId: createdProjects[3].id, title: 'Setup Express server', dueDate: daysAgo(18), status: 'COMPLETED' as const },
    { projectId: createdProjects[3].id, title: 'Implement authentication', dueDate: daysAgo(10), status: 'COMPLETED' as const },
    { projectId: createdProjects[3].id, title: 'Add rate limiting', dueDate: new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000), status: 'PENDING' as const },
    { projectId: createdProjects[3].id, title: 'Write API documentation', dueDate: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000), status: 'PENDING' as const },

    // Maya Rodriguez - Database Optimization (Project 5) - Early stage
    { projectId: createdProjects[4].id, title: 'Performance audit', dueDate: daysAgo(12), status: 'COMPLETED' as const },
    { projectId: createdProjects[4].id, title: 'Add database indexes', dueDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), status: 'PENDING' as const },
    { projectId: createdProjects[4].id, title: 'Implement Redis caching', dueDate: new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000), status: 'PENDING' as const },

    // Jordan Park - Todo App (Project 6) - Almost complete
    { projectId: createdProjects[5].id, title: 'Setup React + Express', dueDate: daysAgo(48), status: 'COMPLETED' as const },
    { projectId: createdProjects[5].id, title: 'Build CRUD operations', dueDate: daysAgo(42), status: 'COMPLETED' as const },
    { projectId: createdProjects[5].id, title: 'Add user authentication', dueDate: daysAgo(35), status: 'COMPLETED' as const },
    { projectId: createdProjects[5].id, title: 'Implement drag & drop', dueDate: daysAgo(28), status: 'COMPLETED' as const },
    { projectId: createdProjects[5].id, title: 'Polish UI/UX', dueDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), status: 'PENDING' as const },
    { projectId: createdProjects[5].id, title: 'Deploy & test', dueDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), status: 'PENDING' as const },

    // Jordan Park - Chat App (Project 7) - Good progress
    { projectId: createdProjects[6].id, title: 'Setup WebSocket server', dueDate: daysAgo(38), status: 'COMPLETED' as const },
    { projectId: createdProjects[6].id, title: 'Build chat rooms', dueDate: daysAgo(30), status: 'COMPLETED' as const },
    { projectId: createdProjects[6].id, title: 'Add file uploads', dueDate: new Date(now.getTime() + 8 * 24 * 60 * 60 * 1000), status: 'PENDING' as const },
    { projectId: createdProjects[6].id, title: 'Implement notifications', dueDate: new Date(now.getTime() + 18 * 24 * 60 * 60 * 1000), status: 'PENDING' as const },

    // Jordan Park - Weather Dashboard (Project 8)
    { projectId: createdProjects[7].id, title: 'API integration', dueDate: daysAgo(22), status: 'COMPLETED' as const },
    { projectId: createdProjects[7].id, title: 'Build weather cards', dueDate: daysAgo(15), status: 'COMPLETED' as const },
    { projectId: createdProjects[7].id, title: 'Add location search', dueDate: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000), status: 'PENDING' as const },
    { projectId: createdProjects[7].id, title: 'Create forecast charts', dueDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), status: 'PENDING' as const },

    // Jordan Park - Expense Tracker (Project 9) - Just started
    { projectId: createdProjects[8].id, title: 'Setup React Native', dueDate: daysAgo(12), status: 'COMPLETED' as const },
    { projectId: createdProjects[8].id, title: 'Build expense form', dueDate: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000), status: 'PENDING' as const },
    { projectId: createdProjects[8].id, title: 'Add chart visualizations', dueDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), status: 'PENDING' as const },

    // Sarah Thompson - First App (Project 10) - Early stage
    { projectId: createdProjects[9].id, title: 'Learn HTML/CSS basics', dueDate: daysAgo(3), status: 'COMPLETED' as const },
    { projectId: createdProjects[9].id, title: 'Setup development environment', dueDate: daysAgo(1), status: 'COMPLETED' as const },
    { projectId: createdProjects[9].id, title: 'Create database schema', dueDate: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000), status: 'PENDING' as const },
    { projectId: createdProjects[9].id, title: 'Build authentication', dueDate: new Date(now.getTime() + 40 * 24 * 60 * 60 * 1000), status: 'PENDING' as const },
    { projectId: createdProjects[9].id, title: 'Add CRUD operations', dueDate: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000), status: 'PENDING' as const },

    // David Kumar - Research Dashboard (Project 11)
    { projectId: createdProjects[10].id, title: 'Data collection setup', dueDate: daysAgo(32), status: 'COMPLETED' as const },
    { projectId: createdProjects[10].id, title: 'Build Python backend', dueDate: daysAgo(25), status: 'COMPLETED' as const },
    { projectId: createdProjects[10].id, title: 'Create D3.js visualizations', dueDate: daysAgo(15), status: 'COMPLETED' as const },
    { projectId: createdProjects[10].id, title: 'Add filtering options', dueDate: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), status: 'PENDING' as const },
    { projectId: createdProjects[10].id, title: 'Deploy to university server', dueDate: new Date(now.getTime() + 22 * 24 * 60 * 60 * 1000), status: 'PENDING' as const },

    // David Kumar - ML Model (Project 12)
    { projectId: createdProjects[11].id, title: 'Data preprocessing', dueDate: daysAgo(26), status: 'COMPLETED' as const },
    { projectId: createdProjects[11].id, title: 'Feature engineering', dueDate: daysAgo(18), status: 'COMPLETED' as const },
    { projectId: createdProjects[11].id, title: 'Train initial model', dueDate: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000), status: 'PENDING' as const },
    { projectId: createdProjects[11].id, title: 'Hyperparameter tuning', dueDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), status: 'PENDING' as const },

    // David Kumar - ETL Pipeline (Project 13)
    { projectId: createdProjects[12].id, title: 'Design pipeline architecture', dueDate: daysAgo(18), status: 'COMPLETED' as const },
    { projectId: createdProjects[12].id, title: 'Build data extractors', dueDate: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000), status: 'PENDING' as const },
    { projectId: createdProjects[12].id, title: 'Add transformation logic', dueDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), status: 'PENDING' as const },
    { projectId: createdProjects[12].id, title: 'Schedule automated runs', dueDate: new Date(now.getTime() + 50 * 24 * 60 * 60 * 1000), status: 'PENDING' as const },
  ];

  await prisma.milestone.createMany({ data: milestones });

  console.log(`✅ Created ${milestones.length} milestones for projects`);

  // Step 12: Seed Accountability Fees for Select Projects
  console.log('💰 Seeding Accountability Fees...');

  const fees = [
    // Maya Rodriguez - Completed project with refunded fee
    { userId: mayaRodriguez.id, projectId: createdProjects[3].id, amount: 500, status: 'LOCKED' as const },
    
    // Jordan Park - Completed projects
    { userId: jordanPark.id, projectId: createdProjects[5].id, amount: 1000, status: 'LOCKED' as const },
    { userId: jordanPark.id, projectId: createdProjects[6].id, amount: 750, status: 'LOCKED' as const },
    
    // David Kumar - Active project
    { userId: davidKumar.id, projectId: createdProjects[10].id, amount: 800, status: 'LOCKED' as const },
  ];

  await prisma.accountabilityFee.createMany({ data: fees });

  console.log(`✅ Created ${fees.length} accountability fees`);

  // Step 13: Seed Reminders for Upcoming Milestones
  console.log('🔔 Seeding Reminders for Upcoming Milestones...');

  const upcomingMilestones = milestones.filter(m => m.status === 'PENDING' && m.dueDate);
  const reminders = [];

  for (const milestone of upcomingMilestones.slice(0, 15)) { // Add reminders for first 15 upcoming milestones
    const project = createdProjects.find(p => p.id === milestone.projectId);
    if (project && milestone.dueDate) {
      // Email reminder 2 days before
      reminders.push({
        userId: project.userId,
        milestoneId: milestone.id,
        channel: 'email',
        sendDate: new Date(milestone.dueDate.getTime() - 2 * 24 * 60 * 60 * 1000),
        status: 'SCHEDULED' as const
      });
      
      // WhatsApp reminder on due date
      reminders.push({
        userId: project.userId,
        milestoneId: milestone.id,
        channel: 'whatsapp',
        sendDate: milestone.dueDate,
        status: 'SCHEDULED' as const
      });
    }
  }

  await prisma.reminder.createMany({ data: reminders });

  console.log(`✅ Created ${reminders.length} reminders for upcoming milestones`);

  // Summary
  console.log('\n🎉 Database seeding completed successfully!');
  console.log('\n📊 Seeding Summary:');
  console.log(`   • Learning Types: 3 (Visual, Auditory, Kinesthetic)`);
  console.log(`   • Videos: ${videos.length} sample videos with realistic content`);
  console.log(`   • Video Tags: ${videoTags.length} tags with learning type scores`);
  console.log(`   • Demo Users: 5 diverse personas (Alex, Maya, Jordan, Sarah, David)`);
  console.log(`   • Instructors: 2 sample instructors`);
  console.log(`   • Courses: 2 sample courses`);
  console.log(`   • Lessons: ${allLessons.length} course lessons`);
  console.log(`   • Tracks: 2 sample tracks`);
  console.log(`   • Track-Course Relations: ${trackCourseRelations.length} relationships`);
  console.log(`   • Video History: ${allHistory.length} watch history entries`);
  console.log(`   • Projects: ${createdProjects.length} projects for demo users`);
  console.log(`   • Milestones: ${milestones.length} project milestones`);
  console.log(`   • Accountability Fees: ${fees.length} fees`);
  console.log(`   • Reminders: ${reminders.length} scheduled reminders`);
  console.log('\n👥 Demo User Personas:');
  console.log('   1. Alex Chen (alex.chen@clario-demo.com) - Visual, College Student, High Engagement');
  console.log('   2. Maya Rodriguez (maya.rodriguez@clario-demo.com) - Auditory, Professional, Medium Engagement');
  console.log('   3. Jordan Park (jordan.park@clario-demo.com) - Kinesthetic, Developer, Very High Engagement');
  console.log('   4. Sarah Thompson (sarah.thompson@clario-demo.com) - Visual, Career Switcher, New User');
  console.log('   5. David Kumar (david.kumar@clario-demo.com) - Auditory, Graduate Student, Medium-High Engagement');
  console.log('\n🚀 Your Clario database is now ready for MVP demo!');
  console.log('\n💡 Next steps:');
  console.log('   1. Run the backend server: npm run dev');
  console.log('   2. Run the frontend: npm run dev (in frontend folder)');
  console.log('   3. Test login with any demo user email');
  console.log('   4. Showcase personalized recommendations and project management');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });