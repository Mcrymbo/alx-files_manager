import express from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';

const router = express.Router();

// Implementing get Routes
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

// POST routes
router.post('/users', UsersController.postNew);

module.exports = router;
