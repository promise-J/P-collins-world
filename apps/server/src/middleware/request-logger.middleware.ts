import pinoHttp from "pino-http";
import pino from "pino";

const isProduction = process.env.NODE_ENV === 'production';

export const requestLogger = pinoHttp({
  level: isProduction ? 'info' : 'debug',
  
  autoLogging: {
    ignore: (req) => req.method === 'OPTIONS'
  },

  customSuccessMessage: (req, res) => {
    const cleanUrl = req.url?.split('?')[0]; 
    if (isProduction) {
      return `${req.method} ${cleanUrl}`;
    }
    return `${req.method} ${req.url} - Status ${res.statusCode}`;
  },

  customErrorMessage: (req, res, error) => {
    const cleanUrl = req.url?.split('?')[0];
    if (isProduction) {
      return `ERROR: ${req.method} ${cleanUrl} - ${error.message}`;
    }
    return `${req.method} ${req.url} failed with error: ${error.message}`;
  },

  serializers: {
    req: () => undefined,
    res: () => undefined,
    err: pino.stdSerializers.err
  }
});
