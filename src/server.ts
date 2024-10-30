import express, { Request, Response } from 'express';
import * as _dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';
import morgan from 'morgan';

_dotenv.config();

import { initializeRoutes } from './initializeRoutes';
import { db } from './utils/firestore-helpers';

if (!process.env.PORT) {
  console.log('No port value specified, default port will be chosen...');
}

const PORT = parseInt(process.env.PORT as string, 10) || 8080;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:3000';

const app = express();

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  cors({
    origin: ALLOWED_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

const { usersRoute } = initializeRoutes(db);

app.use(usersRoute.createRouter());

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err: Error, req: Request, res: Response) => {
  console.error('Error:', err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}/`);
});
