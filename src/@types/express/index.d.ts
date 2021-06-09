import { IUser } from 'src/models/User';
import { IClientData } from '@shared/JwtService';



declare module 'express' {
    export interface Request  {
        body: {
            id:string;
            user: IUser
            email: string;
            password: string;
            project:String;
            template: String;
            image:any;
        };

    }
}


declare module 'Mongoose' {
    export interface Document  {
        pwdHash:String,
        
    }
}
