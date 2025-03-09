import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, resetError } from "../store/userSlice";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, User, Lock, Calendar } from "lucide-react";

const LoginForm = () => {
  const [credentials, setCredentials] = useState({
    name: "",
    password: "",
    dateOfBirth: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(resetError());
  }, [dispatch]);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser(credentials));
    if (loginUser.fulfilled.match(result)) {
      navigate("/profile");
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 pt-20"
      style={{
        backgroundImage: "url('/bg.jpg')", 
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#f3e8d2", 
      }}
    >
      <div className="bg-white/20 backdrop-blur-md rounded-lg shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center flex items-center justify-center">
          <User className="mr-2" size={24} />
          Login
        </h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1 flex items-center">
              <User className="mr-2" size={16} />
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={credentials.name}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md bg-white/50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1 flex items-center">
              <Lock className="mr-2" size={16} />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••••"
                value={credentials.password}
                onChange={handleChange}
                required
                className="w-full p-2 border border-gray-300 rounded-md bg-white/50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 pr-10"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={20} className="text-gray-500" />
                ) : (
                  <Eye size={20} className="text-gray-500" />
                )}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-800 mb-1 flex items-center">
              <Calendar className="mr-2" size={16} />
              Date of Birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={credentials.dateOfBirth}
              onChange={handleChange}
              required
              className="w-full p-2 border border-gray-300 rounded-md bg-white/50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black hover:bg-orange-500 text-white font-medium py-2 rounded-md transition-colors duration-300"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;