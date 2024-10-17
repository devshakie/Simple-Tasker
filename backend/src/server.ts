import express, { Request, Response } from 'express';

const app = express();
const port = 8000;

app.use(express.json());  

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
