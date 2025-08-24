require('dotenv').config();
const mongoose = require('mongoose');
const { 
  Profile, 
  Project, 
  Experience, 
  Education, 
  Certification, 
  ContactInfo 
} = require('../models');

// Mock data (copied from the Angular mock-data.ts file)
const mockProfile = {
  name: 'Victor Chidera Ani',
  title: 'Node.js & Angular Developer',
  bio: 'A passionate Node.js & Angular developer specializing in full-stack web application development.'
};

const mockExperiences = [
  {
    company: 'Sunrise Beach Hotel',
    role: 'Bartender',
    startDate: '2021-01-01',
    endDate: '2023-12-31',
    responsibilities: [
      'Crafted and served a wide variety of cocktails and beverages',
      'Prepared specialty coffee drinks for hotel guests',
      'Managed cashier duties and financial transactions',
      'Trained new waitstaff in service protocols and customer relations'
    ]
  },
  {
    company: 'X-el Images',
    role: 'Creative Director for Event Coverage',
    startDate: '2017-01-01',
    endDate: '2019-12-31',
    responsibilities: [
      'Provided artistic direction for event photography and videography',
      'Coordinated event coverage teams to ensure comprehensive documentation',
      'Managed client relationships and expectations for event deliverables',
      'Edited and produced final media products for client approval'
    ]
  },
  {
    company: 'Potech Electrical Engineering Limited',
    role: 'IT Manager',
    startDate: '2015-01-01',
    endDate: '2016-12-31',
    responsibilities: [
      'Implemented and maintained comprehensive data backup systems',
      'Managed daily IT department operations and resolved technical issues',
      'Coordinated technology resources and optimized system performance',
      'Provided technical support and training to staff members'
    ]
  },
  {
    company: 'Coal Camp Microfinance Bank',
    role: 'Marketer/Customer Service',
    startDate: '2013-01-01',
    endDate: '2014-12-31',
    responsibilities: [
      'Acquired new clients through targeted outreach and relationship building',
      'Developed and implemented customer retention strategies',
      'Created effective marketing strategies to increase brand awareness',
      'Provided exceptional customer service and support to clients'
    ]
  }
];

const mockCompletedProjects = [
  {
    id: 'banking-system',
    title: 'Banking Management System',
    status: 'Completed',
    imageUrl: 'https://raw.githubusercontent.com/spanexx/My-image-host/067c4954d7c4a63dd0afa7c2f8874fa61b69d985/simp.jpg',
    description: 'A comprehensive banking system with account management, transaction processing, loan management, and admin dashboard. Features secure authentication, real-time balance updates, and detailed transaction history.',
    technologies: ['Node.js', 'Express.js', 'MongoDB', 'Angular', 'TypeScript', 'JWT', 'Socket.io', 'Bootstrap'],   
    projectUrl: 'https://banking-api-cdtx.onrender.com',
    viewLink: 'https://banking.spanexx.com',
    githubLink: 'https://github.com/spanexx/banking-system',
    features: [
      'Account management with multiple account types',
      'Transaction processing with real-time updates',
      'Loan management system',
      'Admin dashboard with analytics',
      'Secure JWT authentication',
      'Real-time notifications',
      'Transaction history and reporting'
    ],
    youtubeVideos: [
      {
        url: 'https://youtu.be/iIhW2gDHoQ4?si=r7mTg4GSMrcoOfUC',
        title: 'Banking System Demo - Full Walkthrough',
        type: 'demo'
      }
    ],
    githubImages: [
      {
        url: 'https://raw.githubusercontent.com/spanexx/My-image-host/2e8103821b3c1665bcc0f4a1ce6746081d31bc78/Screenshot%202025-06-10%20071738.png',
        alt: 'Banking System Dashboard',
        caption: 'Main dashboard showing account overview',
        type: 'screenshot'
      },
      {
        url: 'https://raw.githubusercontent.com/spanexx/My-image-host/fdd718554d6981f9f0468f87c8e098e2d2f1349d/Screenshot%202025-06-10%20100928.png',
        alt: 'Transaction History',
        caption: 'Transaction history with filtering options',
        type: 'ui'
      },
      {
        url: 'https://raw.githubusercontent.com/spanexx/My-image-host/47703a6127c01c8d068176accb7c48f7c4de9230/Screenshot%202025-06-10%20101924.png',
        alt: 'System Architecture',
        caption: 'Overall system architecture and data flow',
        type: 'architecture'
      }
    ]
  },
  {
    id: 'vesta-platform',
    title: 'Vesta - Professional Adult Dating Platform (For Educational Purposes Only)',
    status: 'Completed',
    description: 'A full-stack adult dating and escort platform built with Angular 18 and Node.js. Features comprehensive user management, geolocation-based search, multi-tier subscription system, video content, payment processing with Stripe and crypto, real-time messaging, admin dashboard with content moderation, and performance-optimized virtual scrolling. Includes identity verification, automated deployment with PM2 clustering, and enterprise-grade security.',
    technologies: [
      'Angular 18', 
      'Node.js', 
      'Express.js', 
      'MongoDB', 
      'TypeScript', 
      'Angular CDK', 
      'Stripe API', 
      'Socket.IO', 
      'GridFS', 
      'JWT Authentication', 
      'Multer', 
      'GeoIP-Lite', 
      'PM2', 
      'Helmet.js', 
      'bcryptjs', 
      'Mongoose', 
      'CORS', 
      'Rate Limiting', 
      'Virtual Scrolling',
      'Progressive Loading',
      'Render Hosting'
    ],
    imageUrl: 'https://raw.githubusercontent.com/spanexx/My-image-host/ea29da53a054df351bffa14e6b1bcc1abdcc5924/VestaGirls.png',
    projectUrl: 'https://vesta-btp1.onrender.com',
    viewLink: 'https://vestagirls.online',
    githubLink: 'https://github.com/spanexx/Vesta',
    features: [
      'Multi-tier subscription system (Free, Standard, Premium, VIP)',
      'Geolocation-based user discovery and search',
      'Video content subscription and streaming',
      'Real-time messaging with Socket.IO',
      'Identity verification with document upload',
      'Payment processing (Stripe, Crypto, Manual)',
      'Admin dashboard with content moderation',
      'Performance monitoring and analytics',
      'Virtual scrolling for 10,000+ profiles',
      'Progressive image loading with skeleton states',
      'Mobile-responsive design',
      'Security headers and rate limiting',
      'Automated backup system',
      'Production deployment with PM2 clustering'
    ],
    youtubeVideos: [
      {
        url: 'https://youtu.be/ORKOjsMegGg?si=bNs8N9qNIvaMt2rQ',
        title: 'Vesta Platform Demo - User Experience',
        type: 'demo'
      }
    ],
    githubImages: [
      {
        url: 'https://raw.githubusercontent.com/spanexx/My-image-host/7d8fb2d7d068420423db1ad3bcd7716377b2a29f/Screenshot%202025-06-10%20112209.png',
        alt: 'Vesta Homepage',
        caption: 'Landing page with user discovery features',
        type: 'screenshot'
      },
      {
        url: 'https://raw.githubusercontent.com/spanexx/My-image-host/7d8fb2d7d068420423db1ad3bcd7716377b2a29f/Screenshot%202025-06-10%20112734.png',
        alt: 'User Profile Page',
        caption: 'Detailed user profile with verification status',
        type: 'ui'
      },
      {
        url: 'https://raw.githubusercontent.com/spanexx/My-image-host/ea29da53a054df351bffa14e6b1bcc1abdcc5924/Screenshot%202025-06-10%20120344.png',
        alt: 'Admin Dashboard',
        caption: 'Content moderation and user management',
        type: 'screenshot'
      },
      {
        url: 'https://raw.githubusercontent.com/spanexx/My-image-host/80b51a9cde5bd459fe8e9a1e7cb1cf857edc385f/Screenshot%202025-06-10%20122519.png',
        alt: 'System Architecture',
        caption: 'Application architecture and data flow',
        type: 'architecture'
      }
    ]
  }
];

const mockProjectsInProgress = [
  {
    id: 'personal-finance-dashboard',
    title: 'Personal Finance Dashboard',
    status: 'Active',
    description: 'A comprehensive personal finance management application built with Angular 18 and Node.js/Express. Features complete transaction management, budget tracking, savings goals, financial analytics, and real-time reporting. Includes JWT authentication, email verification, advanced security, file uploads, and production-ready deployment with 95% completion rate exceeding requirements.',
    technologies: [
      'Angular 18',
      'Node.js',
      'Express.js',
      'MongoDB',
      'TypeScript',
      'Angular Material',
      'NgRx',
      'Chart.js',
      'JWT Authentication',
      'SendGrid',
      'Multer',
      'Socket.IO',
      'bcryptjs',
      'Mongoose',
      'Winston',
      'Jest',
      'PM2',
      'ESLint',
      'Prettier'
    ],
    projectUrl: 'https://finance-dashboard-demo.onrender.com',
    inProgress: true,
    progress: 95,
    githubLink: 'https://github.com/spanexx/myPortfolio/tree/feature/personal-finance-dashboard',
    features: [
      'Complete transaction management with CRUD operations',
      'Advanced budget tracking with category allocations',
      'Savings goals with progress monitoring and analytics',
      'Financial analytics dashboard with Chart.js visualizations',
      'JWT authentication with refresh token rotation',
      'Email verification and password reset with SendGrid',
      'File upload system for transaction receipts',
      'Real-time notifications with Socket.IO',
      'Advanced security with rate limiting and monitoring',
      'Responsive design with Angular Material',
      'State management with NgRx for scalability',
      'Comprehensive API with 50+ endpoints',
      'Production-ready with PM2 clustering',
      'Full test coverage with Jest and Supertest',
      'Performance optimization and caching',
      'Professional email templates and notifications'
    ]
  },
  {
    id: 'advanced-authentication-service',
    title: 'Advanced Authentication Service',
    status: 'Active',
    description: 'A comprehensive authentication microservice built with Node.js and Express, featuring JWT token management, OAuth2 integration (Google, GitHub, Facebook), session handling, rate limiting, and secure user management. Includes refresh token rotation, password reset functionality, and enterprise-grade security features.',
    technologies: [
      'Node.js',
      'Express.js',
      'MongoDB',
      'JWT',
      'Passport.js',
      'OAuth2',
      'bcryptjs',
      'express-session',
      'rate-limiter-flexible',
      'Helmet.js',
      'CORS',
      'Mongoose',
      'Render Hosting'
    ],
    projectUrl: 'https://auth-service-5971.onrender.com',
    inProgress: true,
    progress: 85,
    githubLink: 'https://github.com/spanexx/auth-service',
    features: [
      'JWT access and refresh token system',
      'OAuth2 integration with Google, GitHub, Facebook',
      'Secure session management with express-session',
      'Rate limiting and brute force protection',
      'Password reset with email verification',
      'User profile management',
      'Role-based access control',
      'Token refresh and rotation',
      'Security headers with Helmet.js',
      'Angular client integration examples',
      'Comprehensive API documentation',
      'Production deployment on Render'
    ]
  },
  {
    id: 'kolocollect-platform',
    title: 'KoloCollect - Community Savings Platform',
    status: 'Active',
    description: 'A comprehensive community savings and investment platform built with Angular and Node.js. Features wallet management, fixed deposits, community-based savings groups, transaction history, and real-time notifications. Includes performance monitoring, member services, and secure fund management with competitive interest rates.',
    technologies: [
      'Angular 18',
      'Node.js',
      'Express.js',
      'MongoDB',
      'TypeScript',
      'Socket.IO',
      'JWT Authentication',
      'Stripe API',
      'Angular Material',
      'RxJS',
      'Chart.js',
      'PM2',
      'Mongoose',
      'bcryptjs'
    ],
    projectUrl: 'https://kolocollect-demo.onrender.com',
    inProgress: true,
    progress: 75,
    githubLink: 'https://github.com/spanexx/KolocollectV1',
    features: [
      'Wallet dashboard with balance tracking',
      'Fixed deposit system with tiered interest rates',
      'Community savings groups management',
      'Real-time transaction notifications',
      'Fund transfer and withdrawal capabilities',
      'Performance monitoring and analytics',
      'Member service integration',
      'Secure payment processing',
      'Transaction history with filtering',
      'Mobile-responsive design',
      'Database optimization for performance',
      'Backend performance monitoring'
    ]
  },
  {
    id: 'angular-advanced-ui',
    title: 'Angular Advanced UI Components (Showcase)',
    status: 'Active',
    description: 'An end-to-end implementation of reusable, configurable advanced UI components in Angular, including a feature-rich data table and dynamic form, connected to a real backend API using Node.js, Express, and MongoDB.',
    technologies: [
      'Angular 20 (standalone components)',
      'Angular Material & CDK',
      'RxJS & Observables',
      'Node.js',
      'Express',
      'MongoDB',
      'Mongoose',
      'SCSS',
      'TailwindCSS ready'
    ],
    projectUrl: 'https://github.com/spanexx/angular-advanced-ui',
    inProgress: true,
    progress: 30,
    githubLink: 'https://github.com/spanexx/angular-advanced-ui',
    features: [
      'Advanced Data Table: Pagination, sorting, filtering (client/server), dynamic columns, virtual scroll, export/import, accessibility, and more(In Progress).',
      'Dynamic Form: Schema-driven, supports all field types, validation, conditional logic, async hooks(In Progress).',
      'Stepper Wizard: Step-based UI wizard with validation (In Progress).',
      'Modal Service: Centralized modal service with injectable config (coming soon).',
      'Smart Search Bar: Intelligent search input with debounce/autocomplete (coming soon).',
      'Infinite Scroll: Lazy-loaded infinite scroll directive/component (coming soon).',
      'File Upload Zone: Drag-and-drop file upload with preview (coming soon).',
      'Notification System: Toast/snackbar system with global injection (In Progress).',
      'Editable Grid: Grid/table with inline editing (coming soon).',
      'Filter Builder: Visual query builder for dynamic filtering (coming soon).'
    ]
  }
];

const mockEducations = [
  {
    institution: 'Internapa College/University',
    degree: 'MBA',
    fieldOfStudy: 'Business Administration',
    startDate: '2023-09-01',
    endDate: 'Present',
    description: 'Advancing knowledge in business management and leadership strategies.',
    location: 'Cyprus'
  },
  {
    institution: 'Internapa College/University',
    degree: 'Bachelor of Arts',
    fieldOfStudy: 'Hospitality Management',
    startDate: '2019-09-01',
    endDate: '2023-06-30',
    description: 'Completed a comprehensive program with a focus on hospitality, tourism management, and service excellence.',
    location: 'Cyprus'
  },
  {
    institution: 'Varna University of Management',
    degree: 'ERASMUS+ Program',
    fieldOfStudy: 'Management',
    startDate: '2022-09-01',
    endDate: '2023-06-30',
    description: 'Participated in the European Union\'s student exchange program to gain international educational experience.',
    location: 'Bulgaria'
  },
  {
    institution: 'Institute of Management and Technology',
    degree: 'Diploma',
    fieldOfStudy: 'Computer Science',
    startDate: '2010-09-01',
    endDate: '2012-06-30',
    description: 'Developed a strong foundation in programming, web technology, and computer systems. Completed courses in Programming Languages (BASIC, FORTRAN), Web Technology, Computer Systems, Digital Electronics. Final project earned a "Distinction" grade with GPA ranging from 2.73 to 3.1 across semesters.',
    location: 'Nigeria'
  }
];

const mockCertifications = [
  {
    name: 'Bachelor of Arts in Hospitality Management',
    issuer: 'Internapa College, Cyprus',
    date: '2023-06-30',
    description: 'Completed a comprehensive program with a focus on hospitality, tourism management, and service excellence.',
    credentialId: 'ICHM-2023-BA'
  },
  {
    name: 'ERASMUS+ Program Participant',
    issuer: 'European Union - Varna University of Management',
    date: '2023-06-30'
  },
  {
    name: 'Angular Framework Certification',
    issuer: 'Udemy',
    date: '2024-01-15'
  },
  {
    name: 'Advanced Excel Training',
    issuer: 'BMS Computer School',
    date: '2012-08-15'
  },
  {
    name: 'Computer Science Diploma with Distinction',
    issuer: 'Institute of Management and Technology',
    date: '2012-06-30'
  }
];

const mockSocialLinks = [
  {
    platform: 'linkedin',
    url: 'https://www.linkedin.com/in/victor-ani-22326b8a'
  },
  {
    platform: 'github',
    url: 'https://github.com/spanexx'
  }
];

const mockContactInfo = {
  email: 'victorchideraani@gmail.com',
  phone: '+48 883 929 543',
  socialLinks: mockSocialLinks
};

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing data (optional - be careful in production!)
    console.log('🗑️  Clearing existing data...');
    await Promise.all([
      Profile.deleteMany({}),
      Project.deleteMany({}),
      Experience.deleteMany({}),
      Education.deleteMany({}),
      Certification.deleteMany({}),
      ContactInfo.deleteMany({})
    ]);

    // Seed Profile
    console.log('👤 Seeding profile...');
    await Profile.create(mockProfile);

    // Seed Experiences
    console.log('💼 Seeding experiences...');
    await Experience.insertMany(mockExperiences);

    // Seed Projects (both completed and in progress)
    console.log('🚀 Seeding projects...');
    const allProjects = [...mockCompletedProjects, ...mockProjectsInProgress];
    await Project.insertMany(allProjects);

    // Seed Education
    console.log('🎓 Seeding education...');
    await Education.insertMany(mockEducations);

    // Seed Certifications
    console.log('📜 Seeding certifications...');
    await Certification.insertMany(mockCertifications);

    // Seed Contact Info
    console.log('📞 Seeding contact info...');
    await ContactInfo.create(mockContactInfo);

    console.log('✅ Database seeding completed successfully!');
    
    // Display summary
    const counts = await Promise.all([
      Profile.countDocuments(),
      Project.countDocuments(),
      Experience.countDocuments(),
      Education.countDocuments(),
      Certification.countDocuments(),
      ContactInfo.countDocuments()
    ]);
    
    console.log('\n📊 Seeding Summary:');
    console.log(`- Profiles: ${counts[0]}`);
    console.log(`- Projects: ${counts[1]} (${mockCompletedProjects.length} completed, ${mockProjectsInProgress.length} in progress)`);
    console.log(`- Experiences: ${counts[2]}`);
    console.log(`- Education: ${counts[3]}`);
    console.log(`- Certifications: ${counts[4]}`);
    console.log(`- Contact Info: ${counts[5]}`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the seeding function
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;