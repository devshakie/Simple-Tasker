import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// Load environment variables
dotenv.config();

const app = express();
//const port = 8000;

// Set up CORS
app.use(cors({ origin: 'http://localhost:5173' }));

import AuthRoutes from './routes/authRoutes';
import ProjectRoutes from './routes/projectRoutes';
 import TeamRoutes from './routes/teamRoutes';

// Middleware to parse JSON
app.use(express.json());

// Use the auth routes
app.use('/api/auth', AuthRoutes);

// Use the project routes
app.use('/api/project', ProjectRoutes);

// Use the team routes (if needed)
 app.use('/api/teams', TeamRoutes);

// Start the server
const port = 8000;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
