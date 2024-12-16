import express from "express";

import {
  createUser,
  getAllUsers,
  getUserInfoByID,
  updateUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.route("/").get(getAllUsers);
router.route("/").post(createUser);
router.route("/update").post(updateUser);
router.route("/:id").get(getUserInfoByID);

export default router;
