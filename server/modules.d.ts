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
    }
}


