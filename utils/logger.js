const pino = require('pino');

// Определяем, в каком режиме мы работаем
const isDev = process.env.NODE_ENV !== 'production';

// Базовая конфигурация логгера
const logger = pino(
  isDev
    ? {
        level: 'info',
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
            messageFormat: '{msg}' // важно для корректной кириллицы
          }
        }
      }
    : {
        level: 'info',
        formatters: {
          level(label) {
            return { level: label };
          }
        },
        timestamp: pino.stdTimeFunctions.isoTime
      }
);

module.exports = logger;
