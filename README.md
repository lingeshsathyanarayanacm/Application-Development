# Mock Interview Platform 🎤

A full-stack web application designed to simulate real-time mock interviews for students, interviewers, and administrators. This project helps track interview performance, analyze communication quality, and manage interview logistics with role-based dashboards.

## 🚀 Features

- 👨‍🎓 **Student Portal**
  - Attend mock interviews
  - Track progress and feedback
  - View performance reports and charts

- 🧑‍💼 **Interviewer Dashboard**
  - Add/edit/delete MCQs and interview rounds
  - Evaluate student responses
  - Schedule interviews and monitor activity

- 🧑‍💼 **Admin Panel**
  - Role-based access control (User, Interviewer, Admin)
  - Manage users, interviews, and configurations
  - Analytics and monitoring tools

- 📊 **Real-Time Analytics**
  - Charts for performance tracking
  - Attendance and monthly reports
  - Interview quality metrics (grammar, fluency, relevance)

- 🔐 **Authentication & Authorization**
  - Secure JWT-based authentication
  - Role-based route protection

- 🎥 **Video Recording (Client-Side)**
  - Start/stop recording during interviews
  - Interview disturbance detection
  - Tab switch tracking with auto termination

## 🛠️ Tech Stack

### Backend
- Java 17
- Spring Boot
- Spring Security + JWT
- MySQL
- JPA/Hibernate
- REST APIs

### Frontend
- React.js
- Material-UI (MUI)
- Recharts
- Axios

## 📁 Project Structure

backend/
├── controller/
├── service/
├── model/
├── repository/
└── config/
frontend/
├── components/
├── pages/
├── services/
└── utils/

## 📦 Setup & Run

### Backend
bash
cd backend
./mvnw spring-boot:run 
### Frontend
cd frontend
npm install
npm start
### Future Enhancement
🧠 Future Enhancements
AI-based feedback analysis
Real-time chat system
Automated email notifications
Interview scheduling with calendar integration
