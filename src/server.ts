import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import open from 'open';
import type { BoardData } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const webDir = join(__dirname, '..', 'web');

export async function startServer(data: BoardData, port: number): Promise<void> {
  const app = express();

  app.use(express.json());

  app.get('/api/board', (req, res) => {
    res.json(data);
  });

  app.use(express.static(webDir));

  return new Promise((resolve) => {
    app.listen(port, async () => {
      console.log(`Opening board at http://localhost:${port}`);
      await open(`http://localhost:${port}`);
      resolve();
    });
  });
}