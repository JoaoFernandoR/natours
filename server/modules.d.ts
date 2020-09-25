declare namespace NodeJS {
    export interface ProcessEnv {
        NODE_ENV:string;
        USERNAME:string;
        PASSWORD:string;
        PORT:string;
        DATABASE_PASSWORD:string;
        DATABASE:string;
        JWT_SECRET: string;
        JWT_EXPIRES_IN: string;
        EMAIL_USERNAME: string;
        EMAIL_PASSWORD: string;
        EMAIL_HOST: string;
        EMAIL_PORT: string;
    }
}

declare global {
    namespace Express {
      interface Request {
        body: { user: string };
      }
    }
  }

