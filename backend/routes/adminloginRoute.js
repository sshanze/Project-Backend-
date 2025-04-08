import express from "express"

import { adminlogincontroller } from "../controllers/adminlogin.controller.js";

const router = express.Router();

router.post('/loginAdmin', adminlogincontroller);
export default router;
