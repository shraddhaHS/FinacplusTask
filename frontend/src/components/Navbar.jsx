import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../store/userSlice";
import { useNavigate } from "react-router-dom";
import { Home, User, LogIn, LogOut } from "lucide-react";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.user);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/10 backdrop-blur-md shadow-lg p-4 flex justify-between items-center px-6 z-50">
      <h1 className="text-gray-900 text-2xl font-bold flex items-center">
        <Link to="/" className="flex items-center hover:text-orange-700 transition-colors duration-300">
          <Home className="mr-2" size={24} />
          Registration System
        </Link>
      </h1>

      <div className="flex space-x-6 items-center">
        {!userInfo ? (
          <Link
            to="/login"
            className="text-gray-800 hover:text-orange-700 font-medium flex items-center transition-colors duration-300"
          >
            <LogIn className="mr-2" size={20} />
            Login
          </Link>
        ) : (
          <>
            <Link
              to="/profile"
              className="text-gray-800 hover:text-orange-700 font-medium flex items-center transition-colors duration-300"
            >
              <User className="mr-2" size={20} />
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="bg-black hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-md flex items-center transition-colors duration-300"
            >
              <LogOut className="mr-2" size={20} />
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;