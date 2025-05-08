"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleAuthUrl = exports.oauth2Client = void 0;
// config/google.ts
const googleapis_1 = require("googleapis");
const config_1 = require("../../config");
exports.oauth2Client = new googleapis_1.google.auth.OAuth2(config_1.config.google.oauth2.id, config_1.config.google.oauth2.secret, config_1.config.google.oauth2.redirectURI);
// scopes: profile and email
exports.googleAuthUrl = exports.oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['profile', 'email'],
});
