#!/usr/bin/env node

import { Command } from 'commander';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { startServer } from './server.js';
import type { BoardData } from './types.js';

const program = new Command();

program
  .name('agent-board')
  .description('JSON-based task visualization CLI with local web view')
  .version('1.0.0');

program
  .command('view')
  .description('View task board from JSON')
  .option('-i, --input <path>', 'Input JSON file path')
  .option('-s, --stdin', 'Read JSON from stdin')
  .option('-p, --port <port>', 'Server port (default: 3030)', '3030')
  .action(async (options) => {
    let data: BoardData;

    if (options.input) {
      const content = readFileSync(options.input, 'utf-8');
      data = JSON.parse(content);
    } else if (options.stdin) {
      let stdinData = '';
      process.stdin.setEncoding('utf-8');
      for await (const chunk of process.stdin) {
        stdinData += chunk;
      }
      data = JSON.parse(stdinData);
    } else {
      console.error('Error: Please specify --input <path> or --stdin');
      process.exit(1);
    }

    const port = parseInt(options.port) || 3030;
    await startServer(data, port);
  });

program.parse();