// config/google.ts
import { google } from 'googleapis';
import { config } from '../../config';

export const oauth2Client = new google.auth.OAuth2(
  config.google.oauth2.id,
  config.google.oauth2.secret,
  'http://localhost:8000/api/v1/auth/google/callback',
);

// scopes: profile and email
export const googleAuthUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent',
  scope: ['profile', 'email'],
});
