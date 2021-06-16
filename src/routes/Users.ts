import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import {
    paramMissingError,
    emailConflictError,
    notFoundError,
} from '@shared/constants';

import User from '../models/User'
import { hashPassword } from '@shared/functions';

const {
    BAD_REQUEST,
    CREATED,
    OK,
    CONFLICT,
    NOT_FOUND
} = StatusCodes;




export async function getAllUsers(req: Request, res: Response) {
    const users = await User.find({})
    return res.status(OK).json(users);
}

export async function getUser(req: Request, res: Response) {
    const { id } = req.params;
    if (!id) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }
    const user = await User.findOne({ _id: id })
    return res.status(OK).json({ user });
}

export async function addUser(req: Request, res: Response) {

    const { email, password } = req.body;
    if (!(email)) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }

    await User.findOne({ email: email })
        .then((duplicateUser: any) => {
            if (duplicateUser !== null) {
                return res.status(CONFLICT).json({
                    error: emailConflictError,
                });
            }
        })

    const user: any = {
        email: email,
    };
    if (password) {
        const { salt, pwdHash } = await hashPassword(password);
        user.pwdHash = pwdHash;
        user.salt = salt;
    }


    const user_ = new User(user)
    user_.save(function (err, user) {
        if (err) return console.error(err);
        else return res.status(CREATED).json(user);
    })


}

export async function updateUser(req: Request, res: Response) {
    const { id } = req.params;
    const { user } = req.body;

    if (!user || !id) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }
    const originUser = await User.findOne({ _id: id })
    if (!originUser) {
        return res.status(NOT_FOUND).json({
            error: notFoundError,
        })
    }

    await User.updateOne({ _id: id }, user)

    return res.status(OK).end();
}

export async function deleteUser(req: Request, res: Response) {
    const { id } = req.params;
    const originUser = await User.findOne({ _id: id })
    if (!originUser) {
        return res.status(NOT_FOUND).json({
            error: notFoundError,
        })
    }
    await User.deleteOne({ _id: id })
    return res.status(OK).end();
}


export async function setPassword(req: Request, res: Response) {
    const { id } = req.params;
    const { password } = req.body;
    if (!(id && password)) {
        return res.status(BAD_REQUEST).json({
            error: paramMissingError,
        });
    }

    await User.findById(id)
        .then(async (user: any) => {
            const { salt, pwdHash } = await hashPassword(password);
            user.pwdHash = pwdHash;
            user.salt = salt;
            user.save()
            return res.status(OK).send({ user })
        })
        .catch(e => res.status(BAD_REQUEST).send(e))

    return res.status(OK).end();
}
