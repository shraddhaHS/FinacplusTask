import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../store/userSlice.js";
import { axiosInstance } from "../utils/axios.js";
import toast from "react-hot-toast";
import { Eye, EyeOff, User, Calendar, Lock, Info, Smile } from "lucide-react";
import { resetError } from "../store/userSlice.js";

const RegistrationForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, userInfo } = useSelector((state) => state.user);
  
  
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    dateOfBirth: "",
    password: "",
    gender: "",
    about: "",
  });

  const [errors, setErrors] = useState({});
  const [genders, setGenders] = useState([]);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    dispatch(resetError());
  }, [dispatch]);

  useEffect(() => {
    const fetchGenders = async () => {
      try {
        const response = await axiosInstance.get("/user/genders");
        setGenders(response.data.genders);
      } catch (error) {
        toast.error("Failed to load gender options");
      }
    };
    fetchGenders();
  }, []);

  useEffect(() => {
    if (userInfo) {
      navigate("/login");
    }
  }, [userInfo, navigate]);

  const calculateAge = (dob) => {
    if (!dob) return "";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    const dayDiff = today.getDate() - birthDate.getDate();
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }
    return age;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "dateOfBirth") {
      const age = calculateAge(value);
      setFormData((prev) => ({ ...prev, dateOfBirth: value, age: age || "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (formData.name.trim().length < 2) newErrors.name = "Name must be at least 2 characters";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of Birth is required";
    if (new Date(formData.dateOfBirth) > new Date()) newErrors.dateOfBirth = "Date cannot be in the future";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password.length < 10) newErrors.password = "Must be at least 10 characters";
    if (!/(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])/.test(formData.password)) {
      newErrors.password = "Must contain at least one letter, one number & one special character";
    }
    if (!formData.gender) newErrors.gender = "Gender is required";
    if (formData.about.length > 5000) newErrors.about = "Max 5000 characters";
    if(!formData.about) newErrors.about = "Write something about yourself"
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const resultAction = await dispatch(registerUser(formData));
    if (registerUser.fulfilled.match(resultAction)) {
      toast.success("Registration successful! 🎉");
    } else {
      toast.error(resultAction.payload || "Registration failed");
    }
  };

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
          Register
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-800 mb-1 flex items-center">
              <User className="mr-2" size={16} />
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md bg-white/50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className=" text-sm font-medium text-gray-800 mb-1 flex items-center">
              <Calendar className="mr-2" size={16} />
              Date of Birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              min={new Date(new Date().setFullYear(new Date().getFullYear() - 120)).toISOString().split("T")[0]}
              max={new Date().toISOString().split("T")[0]}
              className="w-full p-2 border border-gray-300 rounded-md bg-white/50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
          </div>

          <div>
            <label className=" text-sm font-medium text-gray-800 mb-1 flex items-center">
              <Smile className="mr-2" size={16} />
              Age
            </label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-md bg-white/50 text-gray-900 cursor-not-allowed"
            />
          </div>

          <div>
            <label className=" text-sm font-medium text-gray-800 mb-1 flex items-center">
              <Lock className="mr-2" size={16} />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md bg-white/50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 pr-10"
                placeholder="••••••••••"
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} className="text-gray-500" /> : <Eye size={20} className="text-gray-500" />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className=" text-sm font-medium text-gray-800 mb-1 flex items-center">
              <Smile className="mr-2" size={16} />
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md bg-white/50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select Gender</option>
              {Array.isArray(genders) && genders.length > 0 ? (
  genders.map((gender, index) => (
    <option key={index} value={gender}>
      {gender}
    </option>
  ))
) : (
  <option disabled>Loading...</option>
)}

              {/* {genders.map((g, index) => (
                <option key={index} value={g}>
                  {g}
                </option>
              ))} */}
            </select>
            {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-800 mb-1 flex items-center">
              <Info className="mr-2" size={16} />
              About
            </label>
            <textarea
              name="about"
              value={formData.about}
              placeholder="Tell us something about yourself"
              onChange={handleChange}
              maxLength="5000"
              className="w-full p-2 border border-gray-300 rounded-md bg-white/50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
            ></textarea>
            {errors.about && <p className="text-red-500 text-sm mt-1">{errors.about}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black hover:bg-orange-400 text-white font-medium py-2 rounded-md transition-colors duration-300"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;