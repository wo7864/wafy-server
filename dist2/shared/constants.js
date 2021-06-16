"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookieProps = exports.pwdSaltRounds = exports.cookieNotFoundError = exports.meximumExceededError = exports.notFoundError = exports.emailConflictError = exports.loginFailedErr = exports.paramMissingError = void 0;
// Strings
exports.paramMissingError = 'One or more of the required parameters was missing.';
exports.loginFailedErr = 'Login failed';
exports.emailConflictError = 'This email already exists';
exports.notFoundError = 'Not found error';
exports.meximumExceededError = 'The maximum size of the array has been exceeded';
exports.cookieNotFoundError = 'Cookie not found';
// Numbers
exports.pwdSaltRounds = 12;
// Cookie Properties
exports.cookieProps = Object.freeze({
    key: 'wafy',
    secret: process.env.COOKIE_SECRET,
    options: {
        httpOnly: true,
        signed: false,
        path: (process.env.COOKIE_PATH),
        maxAge: Number(process.env.COOKIE_EXP),
        domain: (process.env.COOKIE_DOMAIN),
        secure: (process.env.SECURE_COOKIE === 'true'),
    },
});
