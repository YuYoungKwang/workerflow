import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, watch as fsWatch } from 'fs';
import * as chokidar from 'chokidar';
import open from 'open';
import type { BoardData } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const webDir = join(__dirname, '..', 'web');

let currentData: BoardData;
let inputPath: string;
const sseClients: Set<express.Response> = new Set();

export async function startServer(data: BoardData, port: number, watch: boolean = false): Promise<void> {
  currentData = data;
  let currentPort = port;
  const maxAttempts = 10;
  const app = express();

  app.use(express.json());

  app.get('/api/board', (req, res) => {
    res.json(currentData);
  });

  app.get('/api/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    sseClients.add(res);

    req.on('close', () => {
      sseClients.delete(res);
    });
  });

  app.use(express.static(webDir));

  return new Promise((resolve, reject) => {
    const tryListen = (attempt: number) => {
      const server = app.listen(currentPort, async () => {
        console.log(`Opening board at http://localhost:${currentPort}`);
        if (watch && inputPath) {
          startWatcher(inputPath);
        }
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

export function setInputPath(path: string): void {
  inputPath = path;
}

function startWatcher(path: string): void {
  inputPath = path;
  console.log(`Watching file: ${path}`);

  chokidar.watch(path, { persistent: true }).on('change', () => {
    try {
      const oldData = currentData;
      const content = readFileSync(path, 'utf-8');
      currentData = JSON.parse(content);
      
      const oldTasks = oldData?.tasks || [];
      const newTasks = currentData.tasks || [];
      let changed = 0;
      for (const t of newTasks) {
        const old = oldTasks.find(o => o.id === t.id);
        if (!old || old.status !== t.status || old.title !== t.title) {
          changed++;
        }
      }
      
      console.log(`[${new Date().toLocaleTimeString()}] File reloaded: ${changed} task(s) changed`);
      broadcastEvent();
    } catch (err) {
      console.error(`[${new Date().toLocaleTimeString()}] Error reloading file: ${err}`);
    }
  });
}

function broadcastEvent(): void {
  const payload = `data: ${JSON.stringify({ type: 'reload', data: currentData })}\n\n`;
  for (const client of sseClients) {
    client.write(payload);
  }
}