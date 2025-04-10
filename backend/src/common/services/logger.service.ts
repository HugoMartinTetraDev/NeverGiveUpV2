import { Injectable, LoggerService as NestLoggerService, LogLevel } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AppLoggerService implements NestLoggerService {
  private readonly logLevels: LogLevel[] = ['error', 'warn', 'log', 'debug', 'verbose'];
  private readonly logsDir: string;

  constructor(
    private readonly context?: string,
    private readonly options: {
      logToFile?: boolean;
      logLevels?: LogLevel[];
    } = {}
  ) {
    // Utiliser les niveaux de log fournis ou par défaut
    if (options.logLevels) {
      this.logLevels = options.logLevels;
    }

    // Configurer le répertoire de logs
    this.logsDir = path.join(process.cwd(), 'logs');

    // Créer le répertoire de logs s'il n'existe pas
    if (options.logToFile && !fs.existsSync(this.logsDir)) {
      fs.mkdirSync(this.logsDir, { recursive: true });
    }
  }

  error(message: any, trace?: string, context?: string): void {
    if (!this.isLevelEnabled('error')) return;
    const ctx = context || this.context;
    console.error(`[${this.getTimestamp()}] [ERROR] ${ctx ? `[${ctx}] ` : ''}${message}`);
    if (trace) {
      console.error(trace);
    }
    this.writeToFile('error', message, trace, ctx);
  }

  warn(message: any, context?: string): void {
    if (!this.isLevelEnabled('warn')) return;
    const ctx = context || this.context;
    console.warn(`[${this.getTimestamp()}] [WARN] ${ctx ? `[${ctx}] ` : ''}${message}`);
    this.writeToFile('warn', message, undefined, ctx);
  }

  log(message: any, context?: string): void {
    if (!this.isLevelEnabled('log')) return;
    const ctx = context || this.context;
    console.log(`[${this.getTimestamp()}] [INFO] ${ctx ? `[${ctx}] ` : ''}${message}`);
    this.writeToFile('log', message, undefined, ctx);
  }

  debug(message: any, context?: string): void {
    if (!this.isLevelEnabled('debug')) return;
    const ctx = context || this.context;
    console.debug(`[${this.getTimestamp()}] [DEBUG] ${ctx ? `[${ctx}] ` : ''}${message}`);
    this.writeToFile('debug', message, undefined, ctx);
  }

  verbose(message: any, context?: string): void {
    if (!this.isLevelEnabled('verbose')) return;
    const ctx = context || this.context;
    console.info(`[${this.getTimestamp()}] [VERBOSE] ${ctx ? `[${ctx}] ` : ''}${message}`);
    this.writeToFile('verbose', message, undefined, ctx);
  }

  private isLevelEnabled(level: LogLevel): boolean {
    return this.logLevels.includes(level);
  }

  private getTimestamp(): string {
    return new Date().toISOString();
  }

  private writeToFile(level: string, message: any, trace?: string, context?: string): void {
    if (!this.options.logToFile) return;

    const date = new Date();
    const fileName = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}.log`;
    const filePath = path.join(this.logsDir, fileName);
    
    const logMessage = `[${this.getTimestamp()}] [${level.toUpperCase()}] ${context ? `[${context}] ` : ''}${message}${trace ? `\n${trace}` : ''}\n`;
    
    fs.appendFile(filePath, logMessage, (err) => {
      if (err) {
        console.error(`Erreur lors de l'écriture dans le fichier de log: ${err.message}`);
      }
    });
  }
} 