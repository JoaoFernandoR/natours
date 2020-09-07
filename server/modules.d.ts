declare namespace NodeJS {
    export interface ProcessEnv {
        NODE_ENV:string;
        USERNAME:string;
        PASSWORD:string;
        PORT:string;
        DATABASE_PASSWORD:string;
        DATABASE:string;
    }
}

declare namespace Express {
    export interface Request {
        requestTime: string[];
    }
}
