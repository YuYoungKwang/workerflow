import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import open from 'open';
import type { BoardData } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const webDir = join(__dirname, '..', 'web');

export async function startServer(data: BoardData, port: number): Promise<void> {
  let currentPort = port;
  const maxAttempts = 10;
  const app = express();

  app.use(express.json());

  app.get('/api/board', (req, res) => {
    res.json(data);
  });

  app.use(express.static(webDir));

  return new Promise((resolve, reject) => {
    const tryListen = (attempt: number) => {
      const server = app.listen(currentPort, async () => {
        console.log(`Opening board at http://localhost:${currentPort}`);
        await open(`http://localhost:${currentPort}`);
        resolve();
      });

      server.on('error', async (err: NodeJS.ErrnoException) => {
        if (err.code === 'EADDRINUSE' && attempt < maxAttempts) {
          console.log(`Port ${currentPort} in use, trying ${currentPort + 1}...`);
          currentPort++;
          tryListen(attempt + 1);
        } else {
          reject(err);
        }
      });
    };

    tryListen(0);
  });
}