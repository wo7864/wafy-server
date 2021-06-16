import crypto from 'crypto'
import logger from './Logger';

interface iPassword{
    pwdHash:string;
    salt:string;
}

export const pErr = (err: Error) => {
    if (err) {
        logger.err(err);
    }
};


export const getRandomInt = (): Number => {
    return Math.floor(Math.random() * 1_000_000_000_000);
};

export const createAuthCode = (email: string): string => {
    const key_one = crypto.randomBytes(256).toString('hex').substr(100, 5);
    const key_two = crypto.randomBytes(256).toString('base64').substr(50, 5);
    return email + key_one + key_two;
};

export const createAuthNumber = (): string => {
    const max = 999999
    const min = 100000
    return String(Math.floor(Math.random() * (max - min + 1)) + min);
};


export function toUnderscore(str: string) {

    return str.replace(/[A-Z]/g, function (upp: string, i: Number) {
        return (i === 0 ? '' : '-') + upp.toLowerCase()
    })
}

export function addNumberUnit(num: Number) {
    if (typeof num == 'number') {
        return num.toString() + 'px';
    }
    return num;
}

export const camelToSnakeCase = (str: string) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
export const camelToKebabCase = (str: string) => str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);

export function getUuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export function createSalt():Promise<string>{
    return new Promise<string>((resolve:any, reject:any) => {
        crypto.randomBytes(64, (err, buf) => {
            if (err) reject(err);
            resolve(buf.toString('base64'));
        });
    });
}

export function hashPassword(password: string):Promise<iPassword>{

    return new Promise<iPassword>(async (resolve, reject) => {
        const salt = await createSalt();
        crypto.pbkdf2(password, salt, 9999, 64, 'sha512', (err, key) => {
            if (err) reject(err);
            resolve({ pwdHash: key.toString('base64'), salt });
        });
    });
}

export function comparePassword(password: string, pwdHash:string, salt:string):Promise<boolean>{
    
    return new Promise<boolean>(async (resolve, reject) => {
        crypto.pbkdf2(password, salt, 9999, 64, 'sha512', (err, key) => {
            if (err) reject(err);
            resolve(key.toString('base64') === pwdHash);
        });
    });
}