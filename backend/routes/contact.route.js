import express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated.js';  // Assuming you have this middleware
import * as contactController from '../controllers/contact.controller.js';

const router = express.Router();

// Contact routes

// Submit contact form (requires authentication)
router.post('/contact', isAuthenticated, contactController.submitContact);

// Admin protected routes to manage contacts
router.get('/contacts', contactController.getContacts);

router.patch('/contacts/:id', contactController.updateContactStatus);

export default router;
