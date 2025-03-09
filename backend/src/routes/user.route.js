import express from "express"
import { registerUser, getUser,login, updateDetails, deleteUser, logout,getGenders} from "../controllers/user.controller.js"
import { protectRoute } from "../middlewares/auth.middleware.js";
const router = express.Router();


router.post("/", registerUser);
router.get("/profile", protectRoute,getUser);
router.get("/genders", getGenders);
router.put("/update-profile",protectRoute , updateDetails);
router.post("/login", login)
router.post("/logout", logout);
router.delete("/delete/:id",protectRoute , deleteUser);

export default router;
