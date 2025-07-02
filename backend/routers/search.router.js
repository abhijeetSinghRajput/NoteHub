import express from "express";
import { searchUsers, searchNotes } from "../controller/search.controller.js";
const router = express.Router();

router.get("/users", searchUsers);
router.get("/notes", searchNotes);

export default router;
