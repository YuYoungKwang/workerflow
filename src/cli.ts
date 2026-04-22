#!/usr/bin/env node

import { Command } from 'commander';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { startServer, setInputPath } from './server.js';
import { parseBoardData, BoardDataSchema } from './types.js';
import { z } from 'zod';

const program = new Command();

program
  .name('workerflow-cli')
  .description('JSON-based task visualization CLI with local web view')
  .version('1.0.2');

program
  .command('view')
  .description('View task board from JSON')
  .option('-i, --input <path>', 'Input JSON file path')
  .option('-s, --stdin', 'Read JSON from stdin')
  .option('-w, --watch', 'Watch input file for changes')
  .option('-p, --port <port>', 'Server port (default: 3030)', '3030')
  .action(async (options) => {
    let data;

    if (options.input) {
      const content = readFileSync(options.input, 'utf-8');
      try {
        data = parseBoardData(content);
      } catch (err) {
        if (err instanceof z.ZodError) {
          console.error('Invalid JSON schema:');
          for (const issue of err.issues) {
            console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
          }
          process.exit(1);
        }
        throw err;
      }
    } else if (options.stdin) {
      let stdinData = '';
      process.stdin.setEncoding('utf-8');
      for await (const chunk of process.stdin) {
        stdinData += chunk;
      }
      try {
        data = parseBoardData(stdinData);
      } catch (err) {
        if (err instanceof z.ZodError) {
          console.error('Invalid JSON schema:');
          for (const issue of err.issues) {
            console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
          }
          process.exit(1);
        }
        throw err;
      }
    } else {
      console.error('Error: Please specify --input <path> or --stdin');
      process.exit(1);
    }

    const port = parseInt(options.port) || 3030;
    const watch = options.watch || false;
    if (watch && options.input) {
      setInputPath(options.input);
    }
    await startServer(data, port, watch);
  });

program.parse();