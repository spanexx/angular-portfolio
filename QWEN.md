# Angular Portfolio Project Context

## Project Overview
This is a full-stack portfolio application built with Angular (frontend) and Node.js/Express (backend), using MongoDB Atlas for data storage. The project has been migrated from static mock data to a dynamic backend with RESTful API endpoints.

### Key Technologies
- **Frontend**: Angular 20, Angular Material, SCSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas with Mongoose ODM
- **Deployment**: Oracle Cloud ready
- **Security**: Helmet, CORS, rate limiting, input validation

### Architecture
The application follows a client-server architecture:
1. **Frontend (Angular)**: Serves the user interface and communicates with the backend API
2. **Backend (Node.js/Express)**: Provides RESTful API endpoints and connects to MongoDB
3. **Database (MongoDB Atlas)**: Stores all portfolio data including profile, projects, experiences, education, certifications, and contact info

## Development Workflow

### Starting the Development Servers
1. **Backend Server**:
   ```bash
   cd backend
   npm run dev
   ```
   This starts the Express server on `http://localhost:3000` with auto-reload.

2. **Frontend Server**:
   ```bash
   ng serve
   ```
   This starts the Angular development server on `http://localhost:4200` with auto-reload.

### Environment Configuration
The application uses different environment configurations:
- **Development**: `src/environments/environment.ts` (API URL: `http://localhost:3000/api`)
- **Production**: `src/environments/environment.prod.ts` (API URL: `https://your-oracle-cloud-backend.com/api`)

The backend also supports multiple environments through `.env` files:
- `.env.development`
- `.env.staging`
- `.env.production`

### Building for Production
1. **Backend**: 
   ```bash
   cd backend
   npm start
   ```

2. **Frontend**:
   ```bash
   ng build --configuration production
   ```

### Testing
- **Unit Tests**: `ng test` (runs Karma test runner)
- **End-to-End Tests**: `ng e2e` (requires additional setup)
- **API Testing**: Use tools like Postman or curl to test backend endpoints

## Project Structure
```
.
├── backend/                    # Node.js/Express backend
│   ├── config/                 # Environment configuration
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # API route handlers
│   ├── scripts/                # Utility scripts (e.g., seedData.js)
│   ├── server.js               # Main application file
│   ├── package.json            # Dependencies and scripts
│   └── .env.example            # Environment variables template
├── src/                        # Angular frontend
│   ├── app/                    # Angular components and services
│   ├── environments/           # Environment configurations
│   ├── assets/                 # Static assets
│   └── styles/                 # SCSS stylesheets
├── angular.json                # Angular CLI configuration
├── package.json                # Frontend dependencies and scripts
└── README.md                   # Frontend documentation
```

## API Endpoints
The backend provides RESTful API endpoints for all portfolio data:

### Profile
- `GET /api/profile` - Get profile information
- `PUT /api/profile` - Update profile information

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/completed` - Get completed projects
- `GET /api/projects/in-progress` - Get projects in progress
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Experiences
- `GET /api/experiences` - Get all experiences
- `GET /api/experiences/:id` - Get single experience
- `POST /api/experiences` - Create new experience
- `PUT /api/experiences/:id` - Update experience
- `DELETE /api/experiences/:id` - Delete experience

### Education
- `GET /api/educations` - Get all education records
- `GET /api/educations/:id` - Get single education record
- `POST /api/educations` - Create new education record
- `PUT /api/educations/:id` - Update education record
- `DELETE /api/educations/:id` - Delete education record

### Certifications
- `GET /api/certifications` - Get all certifications
- `GET /api/certifications/:id` - Get single certification
- `POST /api/certifications` - Create new certification
- `PUT /api/certifications/:id` - Update certification
- `DELETE /api/certifications/:id` - Delete certification

### Contact
- `GET /api/contact` - Get contact information
- `PUT /api/contact` - Update contact information

### Health Check
- `GET /api/health` - API health status

## Deployment
The application is configured for deployment on Oracle Cloud Infrastructure (OCI). The backend includes environment-specific configurations for development, staging, and production deployments.

### MongoDB Atlas Setup
1. Create account at https://cloud.mongodb.com/
2. Create a free cluster
3. Create database user
4. Whitelist your IP
5. Get connection string and add to backend/.env

### Oracle Cloud Deployment
Refer to `ORACLE_CLOUD_DEPLOYMENT.md` for detailed deployment instructions.

## Key Features
1. **Dynamic Content**: Portfolio content is loaded from MongoDB database
2. **Graceful Fallback**: Uses mock data if API is unavailable
3. **Loading States**: Shows loading indicators during API requests
4. **Error Handling**: Displays user-friendly error messages with retry options
5. **Security**: Implements security best practices including helmet, CORS, and rate limiting
6. **Environment Configuration**: Supports different configurations for development, staging, and production
7. **Data Seeding**: Includes a script to populate the database with initial data

## Troubleshooting
Common issues and solutions:
1. **MongoDB Connection Error**:
   - Check your MongoDB Atlas connection string
   - Ensure your IP is whitelisted in Atlas
   - Verify database user permissions

2. **Port Already in Use**:
   - Change the PORT in your .env file
   - Kill existing processes: `lsof -ti:3000 | xargs kill -9`

3. **CORS Issues**:
   - Update FRONTEND_URL in .env
   - Check CORS configuration in backend/server.js

## Next Steps
1. Set up MongoDB Atlas cluster
2. Update `.env` file with connection string
3. Run the seeding script (`npm run seed` in backend directory)
4. Test both frontend and backend
5. Consider adding authentication for production use