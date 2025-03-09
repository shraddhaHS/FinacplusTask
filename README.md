# 💻 User Registration System (MERN Stack)

## 🎯 Overview  
This is a **User Registration System** built with **React.js (Vite) for the frontend** and **Node.js + Express.js with MongoDB for the backend**. The system allows users to **register, log in, view profile details, update profile information, and delete their accounts**.  

---

## 📌 Table of Contents
- [Tech Stack](#-tech-stack)
- [Project Setup](#-project-setup)
  - [Backend Setup](#-backend-setup)
  - [Frontend Setup](#-frontend-setup)
- [API Documentation](#-api-documentation)

---
## 📌 Tech Stack  

### 🎨 Frontend  
- **React.js** (Created using **Vite**)  
- **TailwindCSS** (for styling)  
- **Redux Toolkit** (for state management)  
- **React Router** (for navigation)  
- **Axios** (for API requests)  
- **Lucide React** (for icons)  
- **React Hot Toast** (for User alerts)  

### ⚙ Backend  
- **Node.js** + **Express.js** (for API)  
- **MongoDB** (Database)  
- **Mongoose** (for MongoDB modeling)  
- **JWT (jsonwebtoken)** (for authentication)  
- **bcrypt** (for password hashing)  
- **cookie-parser** (for managing cookies)  
- **dotenv** (for environment variables)  
- **CORS** (for handling cross-origin requests)  

---

## 🚀 Project Setup  

This project consists of two parts:  
1️⃣ **Backend** (Node.js + Express + MongoDB)  
2️⃣ **Frontend** (React + Vite + TailwindCSS + ReduxToolkit)  


## ⚙ Backend Setup  

### 1️⃣ Prerequisites  
Ensure you have the following installed and ready:  
- **Node.js** 
- **MongoDB** 
- **Postman** 

### 2️⃣ Clone the Repository  
```bash
git clone https://github.com/shraddhaHS/RegistrationAsgmt
cd RegistrationAsgmt
```

### 3️⃣ Backend Installation  
```bash
cd backend
npm install
```

### 4️⃣ Set Up Environment Variables  
Create a `.env` file inside the **backend/** folder and add the following:  

```ini
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5001
```

### 5️⃣ Run the Backend Server Locally  
```bash
npm run dev
```

---

## 🎨 Frontend Setup  

### 1️⃣ Move to the Frontend Directory  
```bash
cd ../frontend
```

### 2️⃣ Install Dependencies  
```bash
npm install
```

### 3️⃣ Run the Frontend  
```bash
npm run dev
```

---

### 🌍 Accessing the Application  

Once both the **backend** and **frontend** are running, open:  
🔗 **`http://localhost:5173`** in your browser.  

---


## 📡 API Documentation  

The API has the following endpoints:  

| Method | Endpoint                   | Description                  |
|--------|----------------------------|------------------------------|
| POST   | `/api/user`                 | Register a new user          |
| GET    | `/api/user/profile`         | Get user profile details     |
| POST   | `/api/user/login`           | User login                   |
| POST   | `/api/user/logout`          | User logout                  |
| PUT    | `/api/user/update-profile`  | Update user profile          |
| DELETE | `/api/user/delete/:id`      | Delete user account          |

For detailed API request/response formats, check the **Postman documentation**:  
📌 [Postman API Docs](https://www.postman.com/shraddhahs/workspace/user-registration/documentation/37249712-4fabc3e8-f2ff-4c08-b836-fb8cc931bfdf)



---
