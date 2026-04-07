<div align="center">
  <h1>🚀 Career Command Center (Job Application Tracker)</h1>
  <p>A premium, comprehensive job application tracking system powered by AI.</p>
</div>

## 📖 Overview

The **Career Command Center** is a full-stack, AI-integrated web application designed to help users track and manage their job applications effortlessly. Move away from messy spreadsheets and organize your career search with intuitive drag-and-drop Kanban boards, insightful analytics, and intelligent tools like AI Resume Scoring and auto-scraping for job postings.

## ✨ Features

- **🛡 JWT Authentication & Multi-Tenancy**: Secure user signup and login to keep job data private and organized per user.
- **📋 Interactive Kanban Board**: Visualize your job search progress with drag-and-drop functionality (powered by `@dnd-kit`).
- **📊 Analytics Dashboard**: Gain insights into your job search success rate with visual data charts (using `recharts`).
- **🤖 AI Resume Checker**: Upload PDF resumes and receive automated scoring and feedback via the Hugging Face Inference API.
- **🌐 Job Posting Auto-Scraping**: Automatically extract job details from URLs to quickly add them to your tracker.
- **✨ Dynamic & Premium Animations**: Smooth user interface transitions leveraging `framer-motion`.

## 🛠️ Tech Stack

**Frontend (Client)**
- React (v19)
- Vite
- Framer Motion
- Recharts
- @dnd-kit
- React Router DOM

**Backend (Server)**
- Node.js & Express
- MongoDB (Mongoose)
- Hugging Face Inference API (`@huggingface/inference`)
- PDF-Parse & Multer (for resume reading & handling)
- Cheerio (for web scraping)
- JSON Web Token (JWT) & Bcrypt (for authentication)

## 📁 Repository Structure

```
job_application_tracker/
├── frontend/             # React/Vite Frontend Application
│   ├── src/              # Source files (components, pages, utils)
│   ├── public/           # Static assets
│   └── package.json      # Frontend dependencies
│
└── backend/              # Node.js/Express Backend Server
    ├── models/           # Mongoose Database Models
    ├── routes/           # Express API Routes
    ├── middleware/       # Custom middleware (Auth, File uploads)
    ├── server.js         # Entry point for backend
    └── package.json      # Backend dependencies
```

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or using MongoDB Atlas)
- Hugging Face API Key (for the AI features)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd job_application_tracker
   ```

2. **Install Backend Dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

### Environment Configuration

1. **Backend `.env`:** 
   Navigate to the `backend` folder and create a `.env` file with the following variables:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   HUGGINGFACE_API_KEY=your_huggingface_key
   ```

### Running the Application

1. **Start the Backend Server:**
   ```bash
   cd backend
   npm run dev
   ```
   *The backend should default to `http://localhost:5000`.*

2. **Start the Frontend Server:**
   ```bash
   cd frontend
   npm run dev
   ```
   *The frontend will typically run at `http://localhost:5173`.*

## 📄 License

This project is licensed under the ISC License.
