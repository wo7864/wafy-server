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
exports.setPassword = exports.deleteUser = exports.updateUser = exports.addUser = exports.getUser = exports.getAllUsers = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const constants_1 = require("@shared/constants");
const User_1 = __importDefault(require("../models/User"));
const functions_1 = require("@shared/functions");
const { BAD_REQUEST, CREATED, OK, CONFLICT, NOT_FOUND } = http_status_codes_1.default;
function getAllUsers(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const users = yield User_1.default.find({});
        return res.status(OK).json(users);
    });
}
exports.getAllUsers = getAllUsers;
function getUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        if (!id) {
            return res.status(BAD_REQUEST).json({
                error: constants_1.paramMissingError,
            });
        }
        const user = yield User_1.default.findOne({ _id: id });
        return res.status(OK).json({ user });
    });
}
exports.getUser = getUser;
function addUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        if (!(email)) {
            return res.status(BAD_REQUEST).json({
                error: constants_1.paramMissingError,
            });
        }
        yield User_1.default.findOne({ email: email })
            .then((duplicateUser) => {
            if (duplicateUser !== null) {
                return res.status(CONFLICT).json({
                    error: constants_1.emailConflictError,
                });
            }
        });
        const user = {
            email: email,
        };
        if (password) {
            const { salt, pwdHash } = yield functions_1.hashPassword(password);
            user.pwdHash = pwdHash;
            user.salt = salt;
        }
        const user_ = new User_1.default(user);
        user_.save(function (err, user) {
            if (err)
                return console.error(err);
            else
                return res.status(CREATED).json(user);
        });
    });
}
exports.addUser = addUser;
function updateUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        const { user } = req.body;
        if (!user || !id) {
            return res.status(BAD_REQUEST).json({
                error: constants_1.paramMissingError,
            });
        }
        const originUser = yield User_1.default.findOne({ _id: id });
        if (!originUser) {
            return res.status(NOT_FOUND).json({
                error: constants_1.notFoundError,
            });
        }
        yield User_1.default.updateOne({ _id: id }, user);
        return res.status(OK).end();
    });
}
exports.updateUser = updateUser;
function deleteUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        const originUser = yield User_1.default.findOne({ _id: id });
        if (!originUser) {
            return res.status(NOT_FOUND).json({
                error: constants_1.notFoundError,
            });
        }
        yield User_1.default.deleteOne({ _id: id });
        return res.status(OK).end();
    });
}
exports.deleteUser = deleteUser;
function setPassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        const { password } = req.body;
        if (!(id && password)) {
            return res.status(BAD_REQUEST).json({
                error: constants_1.paramMissingError,
            });
        }
        yield User_1.default.findById(id)
            .then((user) => __awaiter(this, void 0, void 0, function* () {
            const { salt, pwdHash } = yield functions_1.hashPassword(password);
            user.pwdHash = pwdHash;
            user.salt = salt;
            user.save();
            return res.status(OK).send({ user });
        }))
            .catch(e => res.status(BAD_REQUEST).send(e));
        return res.status(OK).end();
    });
}
exports.setPassword = setPassword;
