import express from 'express';
import { upload } from '../middlewares/upload.js';
import * as sellRequestController from '../controllers/sellRequest.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';
// import { isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Submit sell request
router.post('/submit', isAuthenticated,
  upload.array('images', 5), // Allow up to 5 images
  sellRequestController.submitSellRequest
);

// Admin route to get all requests
router.get('/requests', sellRequestController.getSellRequests);
router.get('/download/:filename', sellRequestController.downloadFile);

export default router;