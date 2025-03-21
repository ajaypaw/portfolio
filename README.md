
# Portfolio Website with Admin Dashboard

A modern, responsive portfolio website with an admin dashboard for content management.

## Project Structure

This project is organized into two main parts:

- **Frontend**: React application built with Vite
- **Backend**: Node.js/Express API

### Frontend (React + Vite)

The frontend is a React application using modern libraries and best practices:

- React with functional components and hooks
- React Router for navigation
- Tailwind CSS for styling
- Framer Motion for animations
- Axios for API requests

### Backend (Node.js + Express + MongoDB)

The backend is a REST API built with:

- Node.js and Express
- MongoDB for database
- JWT for authentication
- Multer for file uploads
- Mongoose for MongoDB object modeling

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local instance or Atlas)

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd portfolio
   ```

2. Install frontend dependencies
   ```
   npm install
   ```

3. Install backend dependencies
   ```
   cd backend
   npm install
   ```

4. Set up environment variables:
   
   Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/portfolio
   JWT_SECRET=your_jwt_secret_key_change_this_in_production
   NODE_ENV=development
   ```

### Running the Application

1. Run the entire application (frontend + backend)
   ```
   npm run dev:all
   ```

2. Or run them separately:
   
   Frontend only:
   ```
   npm run dev
   ```
   
   Backend only:
   ```
   npm run server
   ```

## Features

- Responsive portfolio website
- Admin dashboard for content management
- Authentication system
- Blog system with CRUD operations
- Project showcase
- Skills section
- Achievements/Certifications section
- Contact form

## API Documentation

See the [Backend README](./backend/README.md) for detailed API documentation.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

