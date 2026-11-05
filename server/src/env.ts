import path from 'path';
import dotenv from 'dotenv';

/* Imported first by index.ts: routes read process.env while their modules load */
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
