import express from 'express';
import * as newsletterController from '../controllers/newsletter.controller.js';
import isAuthenticated from '../middlewares/isAuthenticated.js';  
// import { isAdmin } from '../middlewares/auth.js';  // Assuming we have an admin authentication middleware

const router = express.Router();

// Newsletter routes

// Subscribe to the newsletter
router.post(
  '/newsletter/subscribe',
  isAuthenticated,
  newsletterController.subscribe
);

// Unsubscribe from the newsletter
router.post(
  '/newsletter/unsubscribe',
  isAuthenticated,
  newsletterController.unsubscribe
);

// Admin route to send the newsletter to all subscribers
router.post(
  '/newsletter/send',
  newsletterController.sendNewsletter
);

// Admin route to get the list of subscribers with pagination
router.get(
  '/newsletter/subscribers',
  newsletterController.getSubscribers
);

export default router;
