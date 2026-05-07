const console = require('console');

function prepare(color, ...logs) {
  const aLogs = [];
  for (let iter = 0; iter < logs.length; iter += 1) {
    aLogs.push(`\x1b${color}${typeof logs[iter] === 'object' ? JSON.stringify(logs[iter], null, 2) : logs[iter]}\x1b[0m`);
  }
  console.log(...aLogs);
}

const log = {
  black: (...logs) => prepare('[30m', ...logs),
  red: (...logs) => prepare('[31m', ...logs),
  green: (...logs) => prepare('[32m', ...logs),
  yellow: (...logs) => prepare('[33m', ...logs),
  blue: (...logs) => prepare('[34m', ...logs),
  magenta: (...logs) => prepare('[35m', ...logs),
  cyan: (...logs) => prepare('[36m', ...logs),
  white: (...logs) => prepare('[37m', ...logs),
  console: console.log,
  error: console.error,
  warn: console.warn,
  table: console.table,
  info: console.info,
  trace: console.trace,
};

module.exports = log;
