import { Profile, Project, Experience, Education, Certification, ContactInfo, ProjectStatus, SocialLink } from '../../shared/models';

export const mockProfile: Profile = {
  name: 'Victor Chidera Ani',
  title: 'Node.js & Angular Developer',
  bio: 'A passionate Node.js & Angular developer specializing in full-stack web application development.'
};


export const mockExperiences: Experience[] = [
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

export const mockCompletedProjects: Project[] = [
  {
    id: 'banking-system',
    title: 'Banking Management System',
    status: ProjectStatus.Completed,
    description: 'A comprehensive banking system with account management, transaction processing, loan management, and admin dashboard. Features secure authentication, real-time balance updates, and detailed transaction history.',
    technologies: ['Node.js', 'Express.js', 'MongoDB', 'Angular', 'TypeScript', 'JWT', 'Socket.io', 'Bootstrap'],    imageUrl: '/assets/projects/banking-system.png',
    projectUrl: 'https://banking-system-demo.herokuapp.com',
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
    ],    youtubeVideos: [
      {
        url: 'https://youtu.be/hRoAvmcHsow?si=OSAsXWFFoHGg_se_',
        title: 'Banking System Demo - Full Walkthrough',
        type: 'demo'
      }
    ],
    githubImages: [
      {
        url: 'https://raw.githubusercontent.com/spanexx/banking-system/main/screenshots/dashboard.png',
        alt: 'Banking System Dashboard',
        caption: 'Main dashboard showing account overview',
        type: 'screenshot'
      },
      {
        url: 'https://raw.githubusercontent.com/spanexx/banking-system/main/screenshots/transactions.png',
        alt: 'Transaction History',
        caption: 'Transaction history with filtering options',
        type: 'ui'
      },
      {
        url: 'https://raw.githubusercontent.com/spanexx/banking-system/main/architecture/system-diagram.png',
        alt: 'System Architecture',
        caption: 'Overall system architecture and data flow',
        type: 'architecture'
      }
    ]
  },
  {
    id: 'vesta-platform',
    title: 'Vesta - Professional Adult Dating Platform',
    status: ProjectStatus.Completed,
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
  imageUrl: '/assets/projects/vesta-platform.jpg',
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
    'Security headers and rate limiting',    'Automated backup system',
    'Production deployment with PM2 clustering'
  ],  youtubeVideos: [
    {
      url: 'https://youtu.be/hRoAvmcHsow?si=OSAsXWFFoHGg_se_',
      title: 'Vesta Platform Demo - User Experience',
      type: 'demo'
    }
  ],
  githubImages: [
    {
      url: 'https://raw.githubusercontent.com/spanexx/Vesta/main/screenshots/homepage.png',
      alt: 'Vesta Homepage',
      caption: 'Landing page with user discovery features',
      type: 'screenshot'
    },
    {
      url: 'https://raw.githubusercontent.com/spanexx/Vesta/main/screenshots/profile-page.png',
      alt: 'User Profile Page',
      caption: 'Detailed user profile with verification status',
      type: 'ui'
    },
    {
      url: 'https://raw.githubusercontent.com/spanexx/Vesta/main/screenshots/admin-dashboard.png',
      alt: 'Admin Dashboard',
      caption: 'Content moderation and user management',
      type: 'screenshot'
    },
    {
      url: 'https://raw.githubusercontent.com/spanexx/Vesta/main/architecture/system-flow.png',
      alt: 'System Architecture',
      caption: 'Application architecture and data flow',
      type: 'architecture'
    }
  ]
  },

];
export const mockProjectsInProgress: Project[] = [
  {
    id: 'personal-finance-dashboard',
    title: 'Personal Finance Dashboard',
    status: ProjectStatus.Active,
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
    imageUrl: '/assets/projects/finance-dashboard.jpg',
    projectUrl: 'https://finance-dashboard-demo.onrender.com',
    inProgress: true,
    progress: 95,
    githubLink: 'https://github.com/spanexx/personal-finance-dashboard',
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
      'State management with NgRx for scalability',      'Comprehensive API with 50+ endpoints',
      'Production-ready with PM2 clustering',
      'Full test coverage with Jest and Supertest',
      'Performance optimization and caching',
      'Professional email templates and notifications'
    ],
    youtubeVideos: [
      {
        url: 'https://youtu.be/hRoAvmcHsow?si=OSAsXWFFoHGg_se_', // Replace with actual YouTube video ID
        title: 'Personal Finance Dashboard Overview',
        type: 'overview'
      },
      {
        url: 'https://youtu.be/se7n11glWxA?si=Zbe72OLju-DK8snm', // Replace with actual YouTube video ID
        title: 'Budget Tracking Features',
        type: 'feature'
      }
    ],
    githubImages: [
      {
        url: 'https://raw.githubusercontent.com/spanexx/personal-finance-dashboard/main/screenshots/dashboard.png',
        alt: 'Finance Dashboard',
        caption: 'Main dashboard with financial overview',
        type: 'screenshot'
      },
      {
        url: 'https://raw.githubusercontent.com/spanexx/personal-finance-dashboard/main/screenshots/budget-tracking.png',
        alt: 'Budget Tracking',
        caption: 'Budget allocation and tracking interface',
        type: 'ui'
      },
      {
        url: 'https://raw.githubusercontent.com/spanexx/personal-finance-dashboard/main/screenshots/analytics.png',
        alt: 'Financial Analytics',
        caption: 'Chart.js visualizations for financial data',
        type: 'result'
      }
    ]
  },
  {
    id: 'advanced-authentication-service',
    title: 'Advanced Authentication Service',
    status: ProjectStatus.Active,
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
    imageUrl: '',
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
    status: ProjectStatus.Active,
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
    imageUrl: '/assets/projects/kolocollect-platform.jpg',
    projectUrl: 'https://kolocollect-demo.onrender.com',
    inProgress: true,
    progress: 75,
    githubLink: 'https://github.com/spanexx/kolocollect',
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
  }
];

export const mockEducations: Education[] = [
  {
    institution: 'Cyprus University',
    degree: 'MBA',
    fieldOfStudy: 'Business Administration',    startDate: '2023-09-01',
    endDate: 'Present',
    description: 'Advancing knowledge in business management and leadership strategies.',
    location: 'Cyprus'
  },
  {
    institution: 'Internapa College',
    degree: 'Bachelor of Arts',
    fieldOfStudy: 'Hospitality Management',    startDate: '2019-09-01',
    endDate: '2023-06-30',
    description: 'Completed a comprehensive program with a focus on hospitality, tourism management, and service excellence.',
    location: 'Cyprus'
  },
  {
    institution: 'Varna University of Management',
    degree: 'ERASMUS+ Program',
    fieldOfStudy: 'Management',    startDate: '2022-09-01',
    endDate: '2023-06-30',
    description: 'Participated in the European Union\'s student exchange program to gain international educational experience.',
    location: 'Bulgaria'
  },
  {
    institution: 'Institute of Management and Technology',
    degree: 'Diploma',
    fieldOfStudy: 'Computer Science',    startDate: '2010-09-01',
    endDate: '2012-06-30',
    description: 'Developed a strong foundation in programming, web technology, and computer systems. Completed courses in Programming Languages (BASIC, FORTRAN), Web Technology, Computer Systems, Digital Electronics. Final project earned a "Distinction" grade with GPA ranging from 2.73 to 3.1 across semesters.',
    location: 'Nigeria'
  }
];

export const mockCertifications: Certification[] = [
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

export const mockSocialLinks: any[] = [
  {
    platform: 'LinkedIn',
    url: 'https://www.linkedin.com/in/victor-ani-22326b8a'
  },
  {
    platform: 'GitHub',
    url: 'https://github.com/spanexx'
  },
];

export const mockContactInfo: ContactInfo = {
  email: 'victorchideraani@gmail.com',
  phone: '+48 883 929 543',
  socialLinks: mockSocialLinks
};

