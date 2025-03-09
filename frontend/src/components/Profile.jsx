import React, { useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Navigate, useNavigate } from "react-router-dom"
import { updateUser, logoutUser } from "../store/userSlice"
import toast from "react-hot-toast"
import { User, Calendar, Lock, Info, Edit, Trash, Smile, Eye, EyeOff } from "lucide-react"
import { axiosInstance } from "../utils/axios.js"

const Profile = () => {
  const { userInfo, loading, error } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [isEditing, setIsEditing] = useState(false)
  const [about, setAbout] = useState(userInfo?.about || "")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false) 
  const [showConfirm, setShowConfirm] = useState(false)

  const validatePassword = (password) => {
    if (password.length < 10) return "Password must be at least 10 characters."
    if (!/(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])/.test(password))
      return "Password must contain at least one letter, one special character, and one number."
    return null
  }

  const handleDeleteAccount = async () => {
    try {
      await axiosInstance.delete(`/user/delete/${userInfo._id}`)
      toast.success("Account deleted successfully!")
      navigate("/login", { replace: true })
      dispatch(logoutUser())
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong")
    }
  }

  if (!userInfo) {
    return <Navigate to="/login" replace />
  }

  const handleSave = async (e) => {
    e.preventDefault()
    const updateData = { about }
    if (password.trim() !== "") {
      const passwordError = validatePassword(password)
      if (passwordError) {
        toast.error(passwordError)
        return
      }
      updateData.password = password
    }

    const result = await dispatch(updateUser(updateData))
    if (updateUser.fulfilled.match(result)) {
      toast.success("Profile updated successfully!")
      setIsEditing(false)
      setPassword("")
    } else {
      toast.error(result.payload || "Failed to update profile")
    }
  }

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
      <div className="bg-white/20 backdrop-blur-md rounded-xl shadow-2xl p-8 w-full max-w-4xl">
        <div className="flex flex-col items-center mb-8">
          <User size={80} className="text-orange-700" />
          <h1 className="mt-4 text-3xl font-bold text-gray-900">Profile</h1>
        </div>
        <form onSubmit={handleSave} className="space-y-6">
          <div className="border border-gray-300 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-800 mb-1 flex items-center">
              <User className="mr-2" size={16} />
              Name
            </label>
            <div className="mt-1 text-gray-900">{userInfo?.name}</div>
          </div>
          <div className="border border-gray-300 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-800 mb-1 flex items-center">
              <Calendar className="mr-2" size={16} />
              Date of Birth
            </label>
            <div className="mt-1 text-gray-900">
              {new Date(userInfo?.dateOfBirth).toLocaleDateString()}
            </div>
          </div>
          <div className="border border-gray-300 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-800 mb-1 flex items-center">
              <Smile className="mr-2" size={16} />
              Age
            </label>
            <div className="mt-1 text-gray-900">{userInfo?.age}</div>
          </div>
          <div className="border border-gray-300 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-800 mb-1 flex items-center">
              <Smile className="mr-2" size={16} />
              Gender
            </label>
            <div className="mt-1 text-gray-900">{userInfo?.gender}</div>
          </div>
          <div className="border border-gray-300 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-800 mb-1 flex items-center">
              <Lock className="mr-2" size={16} />
              Password
            </label>
            {isEditing ? (
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white/50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 pr-10"
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
            ) : (
              <div className="mt-1 text-gray-900">********</div>
            )}
          </div>
          <div className="border border-gray-300 p-4 rounded-lg">
            <label className="block text-sm font-medium text-gray-800 mb-1 flex items-center">
              <Info className="mr-2" size={16} />
              About
            </label>
            {isEditing ? (
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white/50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows="4"
              />
            ) : (
              <div className="mt-1 text-gray-900 whitespace-pre-wrap">{userInfo.about}</div>
            )}
          </div>
          {isEditing && (
            <div className="text-right">
              <button
                type="submit"
                disabled={loading}
                className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-6 rounded-md transition-colors duration-300"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </form>

        <div className="flex items-center justify-between mt-6">
          <button
            className="bg-red-600 hover:bg-red-700 flex items-center text-white font-bold py-2 px-4 rounded-md transition-colors duration-300"
            onClick={() => setShowConfirm(true)}
          >
            <Trash className="mr-2" size={16} />
            Delete Account
          </button>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-black hover:bg-orange-400 flex items-center text-white py-2 px-4 rounded-md transition-colors duration-300"
          >
            <Edit className="mr-2" size={16} />
            {isEditing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {showConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white/20 backdrop-blur-md p-6 rounded-lg shadow-lg text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Are you sure?</h3>
              <p className="text-gray-800">This action cannot be undone.</p>
              <div className="mt-4 flex justify-center space-x-4">
                <button
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors duration-300"
                  onClick={handleDeleteAccount}
                >
                  Yes, Delete
                </button>
                <button
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors duration-300"
                  onClick={() => setShowConfirm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  )
}

export default Profile