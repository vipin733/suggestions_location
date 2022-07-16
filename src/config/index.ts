import { config } from 'dotenv';
import rateLimit from 'express-rate-limit';

config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { NODE_ENV, PORT, DB_HOST, DB_PORT, DB_DATABASE, MAX_CALL_API, MAX_TIME_API_CALL } = process.env;

export const limiterConfig = {
  windowMs: parseInt(MAX_TIME_API_CALL) * 60 * 1000, // 15 minutes
  max: parseInt(MAX_CALL_API), // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
};

export const limiter = rateLimit(limiterConfig);
