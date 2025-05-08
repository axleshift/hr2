import { Router } from 'express';
const router = Router();

import dotenv from 'dotenv';
dotenv.config();
// import verifySession from '../../middlewares/verifySession';
import { createUser, logout, verify, googleAuth, googleCallback, login, sendOTP, verifyOTP } from '../../database/v1/controllers/authController';
router.post(
  '/register',
  createUser
);

router.post(
  '/login',
  login
);

router.get(
  '/logout',
  logout
);

router.get(
  '/me',
  verify
);

router.post(
  '/send-otp',
  sendOTP
)

router.post(
  '/verify-otp',
  verifyOTP
)

// Google OAuth
router.get('/google', 
  googleAuth
);

router.get('/google/callback', 
  googleCallback
);

export default {
  metadata: {
    path: '/auth',
    description: 'This route is used to register, login, logout, and verify user',
  },
  router,
};
