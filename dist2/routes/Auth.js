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
exports.emailAuth = exports.sendAuthEmail = exports.logout = exports.login = exports.authUser = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const JwtService_1 = require("@shared/JwtService");
const constants_1 = require("@shared/constants");
const User_1 = __importDefault(require("../models/User"));
const functions_1 = require("@shared/functions");
const jwtService = new JwtService_1.JwtService();
const { BAD_REQUEST, OK, UNAUTHORIZED, } = http_status_codes_1.default;
function authUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!req.cookies) {
            return res.status(BAD_REQUEST).json({
                error: constants_1.cookieNotFoundError
            });
        }
        const token = req.cookies.wafy;
        const guestUser = {
            user: { id: 'guest' }
        };
        if (!token) {
            return res.status(OK).json(guestUser);
        }
        const { id } = yield jwtService.decodeJwt(token);
        if (!id) {
            return res.status(OK).json(guestUser);
        }
        yield User_1.default.findById(id)
            .then((user) => {
            const projects = user.projects.map((project) => {
                return {
                    id: project._id,
                    title: project.title,
                    thumbnail: project.thumbnail,
                    update_date: project.update_date
                };
            });
            return res.status(OK).json({
                user: {
                    id: user.id,
                    email: user.email,
                    projects: projects
                }
            });
        })
            .catch(e => res.status(BAD_REQUEST).json(e));
    });
}
exports.authUser = authUser;
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // Check email and password present
        const { email, password } = req.body;
        if (!(email && password)) {
            return res.status(BAD_REQUEST).json({
                error: constants_1.paramMissingError,
            });
        }
        const user = yield User_1.default.findOne({ email: email });
        // Fetch user
        if (!user) {
            return res.status(UNAUTHORIZED).json({
                error: constants_1.loginFailedErr,
            });
        }
        // Check password
        const pwdPassed = yield functions_1.comparePassword(password, user.pwdHash, user.salt);
        if (!pwdPassed) {
            return res.status(UNAUTHORIZED).json({
                error: constants_1.loginFailedErr,
            });
        }
        // Setup Admin Cookie
        const jwt = yield jwtService.getJwt({
            id: user.id
        });
        const { key, options } = constants_1.cookieProps;
        res.cookie(key, jwt, options);
        // Return
        const projects = user.projects.map((project) => {
            return {
                id: project._id,
                title: project.title,
                thumbnail: project.thumbnail,
                update_date: project.update_date
            };
        });
        return res.status(OK).json({
            user: {
                id: user.id,
                email: user.email,
                isAuthEmail: user.isAuthEmail,
                projects: projects
            }
        });
    });
}
exports.login = login;
function logout(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { key, options } = constants_1.cookieProps;
        res.clearCookie(key, options);
        return res.status(OK).end();
    });
}
exports.logout = logout;
function sendAuthEmail(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id, email } = req.body;
        const transporter = nodemailer_1.default.createTransport({
            port: 587,
            host: "smtp.gmail.com",
            service: 'gmail',
            secure: false,
            requireTLS: true,
            auth: {
                user: process.env.HOST_EMAIL,
                pass: process.env.HOST_EMAIL_PW,
            },
        });
        const token = functions_1.getUuid();
        yield User_1.default.findById(id)
            .then((user) => {
            user.authEmailToken = token;
            user.save();
        })
            .catch(e => {
            return res.status(BAD_REQUEST).json(e);
        });
        const authURL = `http://localhost:3000/api/auth/email-auth/${id}/${token}`;
        const html = `
    <h1 style="border-bottom:1px solid #000">가입을 환영합니다!</h1>
    <p>Wafy에 가입을 진행한 본인이 맞으시면, 아래 버튼을 눌러 계정을 활성화 할 수 있어요!</p>
    <a href="${authURL}">본인 인증하기</a>
`;
        const mailData = {
            from: process.env.HOST_EMAIL,
            to: email,
            subject: '[Wafy] 이메일 계정 인증 요청',
            html: html,
        };
        transporter.sendMail(mailData, (error, info) => {
            if (error) {
                return res.status(BAD_REQUEST).json(error);
            }
        });
        return res.status(OK).json({
            message: "Mail send",
            from: process.env.HOST_EMAIL,
            to: email
        });
    });
}
exports.sendAuthEmail = sendAuthEmail;
function emailAuth(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id, token } = req.params;
        yield User_1.default.findById(id)
            .then((user) => {
            if (user.authEmailToken === token) {
                user.isAuthEmail = true;
                user.save();
                res.status(OK).end();
            }
            else {
                res.status(BAD_REQUEST).json({
                    error: constants_1.notFoundError
                });
            }
        })
            .catch(e => res.status(BAD_REQUEST).send(e));
    });
}
exports.emailAuth = emailAuth;
