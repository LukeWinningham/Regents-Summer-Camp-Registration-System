import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import registerRoute from './register.js';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.use('/api/register', registerRoute(prisma));

const PORT = process.env.PORT || 4000;
const server = app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});


process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing server and disconnecting Prisma.');
  await prisma.$disconnect();
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing server and disconnecting Prisma.');
  await prisma.$disconnect();
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});
