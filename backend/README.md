# Portfolio Backend

This is the backend server for a portfolio website with an admin dashboard. It provides API endpoints for managing projects, skills, achievements, blog posts, and user authentication.

## Features

- **Authentication**: JWT-based authentication for admin access
- **Projects Management**: CRUD operations for portfolio projects
- **Skills Management**: CRUD operations for skills with categories
- **Achievements Management**: CRUD operations for achievements and certifications
- **Blog System**: CRUD operations for blog posts with publish/unpublish functionality
- **Profile Management**: Update profile information and change password
- **File Uploads**: Image uploads for projects, blog posts, and profile picture

## Technologies Used

- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB ODM
- **JWT**: Authentication
- **Bcrypt**: Password hashing
- **Multer**: File uploads

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local instance or Atlas)

### Installation

1. Install dependencies
   ```
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/portfolio
   JWT_SECRET=your_secret_key_change_this_in_production
   NODE_ENV=development
   ```

### Running the Server

Development mode:
```
npm run dev
```

Production mode:
```
npm start
```

## API Endpoints

### Authentication
- `POST /api/init-admin`: Initialize the first admin user
- `POST /api/auth/login`: Login with username and password
- `GET /api/auth/user`: Get current user information

### Profile
- `PUT /api/profile`: Update profile information
- `PUT /api/profile/password`: Change password

### Projects
- `GET /api/projects`: Get all projects
- `GET /api/projects/:id`: Get a specific project
- `POST /api/projects`: Create a new project
- `PUT /api/projects/:id`: Update a project
- `DELETE /api/projects/:id`: Delete a project

### Skills
- `GET /api/skills`: Get all skills
- `GET /api/skills/:id`: Get a specific skill
- `POST /api/skills`: Create a new skill
- `PUT /api/skills/:id`: Update a skill
- `DELETE /api/skills/:id`: Delete a skill

### Achievements
- `GET /api/achievements`: Get all achievements
- `GET /api/achievements/:id`: Get a specific achievement
- `POST /api/achievements`: Create a new achievement
- `PUT /api/achievements/:id`: Update an achievement
- `DELETE /api/achievements/:id`: Delete an achievement

### Blog
- `GET /api/blog`: Get all blog posts
- `GET /api/blog/:id`: Get a specific blog post
- `POST /api/blog`: Create a new blog post
- `PUT /api/blog/:id`: Update a blog post
- `PATCH /api/blog/:id`: Update blog post publication status
- `DELETE /api/blog/:id`: Delete a blog post

## Project Structure

- `server.js`: Main entry point
- `routes/`: API routes
- `controllers/`: Route handlers
- `models/`: Database models
- `middleware/`: Custom middleware
- `uploads/`: Directory for file uploads
- `.env`: Environment variables
- `package.json`: Dependencies and scripts 