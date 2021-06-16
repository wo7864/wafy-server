"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = exports.createSalt = exports.getUuid = exports.camelToKebabCase = exports.camelToSnakeCase = exports.addNumberUnit = exports.toUnderscore = exports.createAuthNumber = exports.createAuthCode = exports.getRandomInt = exports.pErr = void 0;
const crypto_1 = __importDefault(require("crypto"));
const Logger_1 = __importDefault(require("./Logger"));
const pErr = (err) => {
    if (err) {
        Logger_1.default.err(err);
    }
};
exports.pErr = pErr;
const getRandomInt = () => {
    return Math.floor(Math.random() * 1000000000000);
};
exports.getRandomInt = getRandomInt;
const createAuthCode = (email) => {
    const key_one = crypto_1.default.randomBytes(256).toString('hex').substr(100, 5);
    const key_two = crypto_1.default.randomBytes(256).toString('base64').substr(50, 5);
    return email + key_one + key_two;
};
exports.createAuthCode = createAuthCode;
const createAuthNumber = () => {
    const max = 999999;
    const min = 100000;
    return String(Math.floor(Math.random() * (max - min + 1)) + min);
};
exports.createAuthNumber = createAuthNumber;
function toUnderscore(str) {
    return str.replace(/[A-Z]/g, function (upp, i) {
        return (i === 0 ? '' : '-') + upp.toLowerCase();
    });
}
exports.toUnderscore = toUnderscore;
function addNumberUnit(num) {
    if (typeof num == 'number') {
        return num.toString() + 'px';
    }
    return num;
}
exports.addNumberUnit = addNumberUnit;
const camelToSnakeCase = (str) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
exports.camelToSnakeCase = camelToSnakeCase;
const camelToKebabCase = (str) => str.replace(/[A-Z]/g, letter => `-${letter.toLowerCase()}`);
exports.camelToKebabCase = camelToKebabCase;
function getUuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
exports.getUuid = getUuid;
function createSalt() {
    return new Promise((resolve, reject) => {
        crypto_1.default.randomBytes(64, (err, buf) => {
            if (err)
                reject(err);
            resolve(buf.toString('base64'));
        });
    });
}
exports.createSalt = createSalt;
function hashPassword(password) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        const salt = yield createSalt();
        crypto_1.default.pbkdf2(password, salt, 9999, 64, 'sha512', (err, key) => {
            if (err)
                reject(err);
            resolve({ pwdHash: key.toString('base64'), salt });
        });
    }));
}
exports.hashPassword = hashPassword;
function comparePassword(password, pwdHash, salt) {
    return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
        crypto_1.default.pbkdf2(password, salt, 9999, 64, 'sha512', (err, key) => {
            if (err)
                reject(err);
            console.log(key.toString('base64'), password, pwdHash, salt);
            resolve(key.toString('base64') === pwdHash);
        });
    }));
}
exports.comparePassword = comparePassword;
