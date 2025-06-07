import express from 'express';
import { getOneYearContribution } from '../controller/contribution.controller.js';

const router = new express.Router();

router.get('/:username', getOneYearContribution);
export default router;