import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./components/Navbar";
import RegisterForm from "./components/RegistrationForm.jsx";
import LoginForm from "./components/LoginForm.jsx";
import Profile from "./components/Profile.jsx";
import { Toaster } from "react-hot-toast";


const App = () => {
    const { userInfo } = useSelector((state) => state.user);

    return (
        <Router>
            <Navbar />
            <Toaster />
            <Routes>
                <Route path="/" element={userInfo ? <Navigate to="/profile" /> : <RegisterForm />} />
                <Route path="/login" element={userInfo ? <Navigate to="/profile" /> : <LoginForm />} />
                
                <Route path="/profile" element={<Profile/> } />
            </Routes>
        </Router>
    );
};

export default App;