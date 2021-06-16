import { Request, Response } from 'express';
import StatusCodes from 'http-status-codes';
import nodemailer from 'nodemailer';

import { JwtService } from '@shared/JwtService';
import {
    paramMissingError,
    loginFailedErr,
    cookieProps,
    notFoundError,
    cookieNotFoundError
} from '@shared/constants';
import User from '../models/User'
import { comparePassword, getUuid } from '@shared/functions';

const jwtService = new JwtService();
const {
    BAD_REQUEST,
    OK,
    UNAUTHORIZED,
} = StatusCodes;


export async function authUser(req: Request, res: Response) {
    if (!req.cookies) {
        return res.status(BAD_REQUEST).json({
            error: cookieNotFoundError
        })
    }
    const token = req.cookies.wafy;
    const guestUser = {
        user: { id: 'guest' }
    }
    if (!token) {
        return res.status(OK).json(guestUser)
    }

    const { id } = await jwtService.decodeJwt(token);

    if (!id) {
        return res.status(OK).json(guestUser)
    }

    await User.findById(id)
        .then((user: any) => {
            const projects = user.projects.map((project: any) => {
                return {
                    id: project._id,
                    title: project.title,
                    thumbnail: project.thumbnail,
                    update_date: project.update_date
                }
            })
            return res.status(OK).json({
                user: {
                    id: user.id,
                    email: user.email,
                    projects: projects
                }
            })
        })
        .catch(e => res.status(BAD_REQUEST).json(e))
}

export async function login(req: Request, res: Response) {
    // Check email and password present
    const { email, password } = req.body;
    if (!(email && password)) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }

    const user = await User.findOne({ email: email })
    // Fetch user
    if (!user) {
        return res.status(UNAUTHORIZED).json({
            error: loginFailedErr,
        });
    }
    // Check password
    const pwdPassed = await comparePassword(password, user.pwdHash, user.salt);
    if (!pwdPassed) {
        return res.status(UNAUTHORIZED).json({
            error: loginFailedErr,
        });
    }
    // Setup Admin Cookie
    const jwt = await jwtService.getJwt({
        id: user.id
    });
    const { key, options } = cookieProps;
    res.cookie(key, jwt, options);
    // Return


    const projects = user.projects.map((project: any) => {
        return {
            id: project._id,
            title: project.title,
            thumbnail: project.thumbnail,
            update_date: project.update_date
        }
    })

    return res.status(OK).json({
        user: {
            id: user.id,
            email: user.email,
            isAuthEmail:user.isAuthEmail,
            projects: projects
        }
    })
}

export async function logout(req: Request, res: Response) {
    const { key, options } = cookieProps;
    res.clearCookie(key, options);
    return res.status(OK).end();
}

export async function sendAuthEmail(req: Request, res: Response) {
    const { id, email } = req.body;
    const transporter = nodemailer.createTransport({
        port: 587,               // true for 465, false for other ports
        host: "smtp.gmail.com",
        service: 'gmail',
        secure: false, // true for 587, false for other ports
        requireTLS: true,
        auth: {
            user: process.env.HOST_EMAIL,
            pass: process.env.HOST_EMAIL_PW,
        },
    });


    const token = getUuid()
    await User.findById(id)
        .then((user: any) => {
            user.authEmailToken = token;
            user.save();
        })
        .catch(e => {
            return res.status(BAD_REQUEST).json(e)
        })


    const authURL = `http://localhost:3000/api/auth/email-auth/${id}/${token}`;
    const html =
        `
    <h1 style="border-bottom:1px solid #000">가입을 환영합니다!</h1>
    <p>Wafy에 가입을 진행한 본인이 맞으시면, 아래 버튼을 눌러 계정을 활성화 할 수 있어요!</p>
    <a href="${authURL}">본인 인증하기</a>
`
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
    })
    return res.status(OK).json({
        message: "Mail send",
        from: process.env.HOST_EMAIL,
        to: email
    });


}
export async function emailAuth(req: Request, res: Response) {
    const { id, token } = req.params;
    await User.findById(id)
        .then((user: any) => {
            if (user.authEmailToken === token) {
                user.isAuthEmail = true;
                user.save();
                res.status(OK).end();
            } else {
                res.status(BAD_REQUEST).json({
                    error: notFoundError
                })
            }
        })
        .catch(e => res.status(BAD_REQUEST).send(e))
}

