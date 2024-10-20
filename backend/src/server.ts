import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

import AuthRoutes from './routes/authRoutes';

const app = express();
const port = 8000;


app.use(express.json());  

// Use the auth routes
app.use('/auth', AuthRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
