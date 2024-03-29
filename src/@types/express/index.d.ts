import { IUser } from 'src/models/User';
import { IClientData } from '@shared/JwtService';



declare module 'express' {
    export interface Request  {
        body: {
            id:string;
            user: any
            email: string;
            password: string;
            project:String;
            template: String;
            image:any;
            data:string;
        };

    }
    export interface Response{
        cookie:any
    }
}


declare module 'Mongoose' {
    export interface Document  {
        pwdHash:String,
        
    }
}
