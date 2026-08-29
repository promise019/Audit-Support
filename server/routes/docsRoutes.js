import express from 'express';
import { getChapter3, getChapter4 } from '../controllers/docsController.js';

const router = express.Router();

router.get('/chapter3', getChapter3);
router.get('/chapter4', getChapter4);

export default router;
