import { spawn } from 'node:child_process';
import process from 'node:process';

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const tasks = [
  {
    name: 'client',
    args: ['run', 'dev', '--prefix', 'client'],
    env: { ...process.env, NAPI_RS_FORCE_WASI: '1' },
  },
  {
    name: 'server',
    args: ['run', 'dev', '--prefix', 'server'],
    env: process.env,
  },
];

const children = tasks.map((task) => {
  const child = spawn(npmCmd, task.args, {
    stdio: 'inherit',
    windowsHide: true,
    shell: process.platform === 'win32',
    env: task.env,
  });

  child.on('exit', (code, signal) => {
    if (signal || code !== 0) {
      for (const other of children) {
        if (other !== child && !other.killed) {
          other.kill();
        }
      }
      process.exit(code ?? 0);
    }
  });

  return child;
});

const shutdown = () => {
  for (const child of children) {
    if (!child.killed) {
      child.kill();
    }
  }
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
