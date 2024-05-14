import express from 'express';
import AppController from '../controllers/AppController';

const router = express.Router();

// Implementing get Routes
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

module.exports = router;