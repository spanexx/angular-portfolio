# Portfolio Backend API

A Node.js/Express REST API for the Angular Portfolio application with MongoDB Atlas integration and Oracle Cloud deployment support.

## 🚀 Features

- **RESTful API** endpoints for all portfolio data
- **MongoDB Atlas** integration with Mongoose ODM
- **Dynamic Environment Loading** - Supports development, staging, and production
- **Oracle Cloud Ready** - Optimized for OCI deployment
- **Data validation** and schema enforcement
- **Error handling** and comprehensive logging
- **Security** features (helmet, cors, rate limiting)
- **Data seeding** script to populate database
- **Environment validation** for deployment readiness

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account and cluster

## 🛠️ Installation

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your MongoDB Atlas connection string:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolio?retryWrites=true&w=majority
   PORT=3000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:4200
   ```

## 🗄️ Database Setup

1. **Create a MongoDB Atlas cluster** at [MongoDB Atlas](https://cloud.mongodb.com/)

2. **Get your connection string** from the Atlas dashboard

3. **Update the .env file** with your connection string

4. **Seed the database** with initial data:
   ```bash
   npm run seed
   ```

## 🏃‍♂️ Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The API will be available at `http://localhost:3000`

## 📡 API Endpoints

### Profile
- `GET /api/profile` - Get profile information
- `PUT /api/profile` - Update profile information

### Projects
- `GET /api/projects` - Get all projects (with optional filtering)
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

## 🗂️ Project Structure

```
backend/
├── models/           # Mongoose schemas
│   ├── Profile.js
│   ├── Project.js
│   ├── Experience.js
│   ├── Education.js
│   ├── Certification.js
│   ├── ContactInfo.js
│   └── index.js
├── routes/           # API route handlers
│   ├── profile.js
│   ├── projects.js
│   ├── experiences.js
│   ├── educations.js
│   ├── certifications.js
│   └── contact.js
├── scripts/          # Utility scripts
│   └── seedData.js   # Database seeding script
├── server.js         # Main application file
├── package.json      # Dependencies and scripts
└── .env.example      # Environment variables template
```

## 🔒 Security Features

- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing configuration
- **Rate Limiting** - Request throttling
- **Input Validation** - Mongoose schema validation
- **Error Handling** - Comprehensive error responses

## 🧪 Testing the API

You can test the API using tools like:
- **Postman** - GUI testing tool
- **curl** - Command line testing
- **Thunder Client** - VS Code extension

### Example API calls:

```bash
# Get all projects
curl http://localhost:3000/api/projects

# Get profile
curl http://localhost:3000/api/profile

# Health check
curl http://localhost:3000/api/health
```

## 🔧 Scripts

- `npm start` - Run in production mode
- `npm run dev` - Run in development mode with nodemon
- `npm run seed` - Seed the database with initial data

## 🌟 Development Notes

1. **Data Validation**: All models include comprehensive validation rules
2. **Error Handling**: Consistent error response format across all endpoints
3. **Indexing**: Database indexes for optimal query performance
4. **Logging**: Request logging with Morgan in development
5. **Compression**: Response compression for better performance

## 📝 Contributing

1. Follow the existing code structure
2. Add proper error handling for new endpoints
3. Update this README when adding new features
4. Test all endpoints before submitting changes

## 🐛 Troubleshooting

### Common Issues:

1. **MongoDB Connection Error**
   - Check your MongoDB Atlas connection string
   - Ensure your IP is whitelisted in Atlas
   - Verify database user permissions

2. **Port Already in Use**
   - Change the PORT in your .env file
   - Kill existing processes: `lsof -ti:3000 | xargs kill -9`

3. **CORS Issues**
   - Update FRONTEND_URL in .env
   - Check CORS configuration in server.js

## 📞 Support

For issues or questions, please check the main project documentation or create an issue in the repository.