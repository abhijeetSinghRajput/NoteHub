import express from 'express';
import { protectRoute } from "../middleware/protectRoute.middleware.js";
import { getOneYearContribution } from '../controller/contribution.controller.js';

const router = express.Router();

router.get('/', protectRoute, getOneYearContribution);


export default router;