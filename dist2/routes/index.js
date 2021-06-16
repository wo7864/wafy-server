"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const functions_1 = require("@shared/functions");
const Auth_1 = require("./Auth");
const Users_1 = require("./Users");
const Projects_1 = require("./Projects");
const Assets_1 = require("./Assets");
const imageStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'src/public/assets/images');
    },
    filename: function (req, file, cb) {
        let mimeType;
        switch (file.mimetype) {
            case "image/jpeg":
                mimeType = "jpg";
                break;
            case "image/png":
                mimeType = "png";
                break;
            case "image/gif":
                mimeType = "gif";
                break;
            case "image/bmp":
                mimeType = "bmp";
                break;
            default:
                mimeType = 'error';
                break;
        }
        if (mimeType !== 'error') {
            const filename = functions_1.getUuid().replace(/-/gi, "");
            cb(null, filename + "." + mimeType);
        }
        else {
            return cb(new Error("wrong on the mimetype"), "error!");
        }
    }
});
const videoStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) { cb(null, 'src/public/assets/videos'); },
    filename: function (req, file, cb) {
        let mimeType;
        switch (file.mimetype) {
            case 'video/gif':
                mimeType = 'gif';
                break;
            case 'video/mp4':
                mimeType = 'mp4';
                break;
            case 'video/ogg':
                mimeType = 'ogg';
                break;
            case 'video/wmv':
                mimeType = 'wmv';
                break;
            case 'video/x-flv':
                //mimeType = mime.getExtension('video/flv');
                mimeType = 'flv';
                break;
            case 'video/avi':
                mimeType = 'avi';
                break;
            case 'video/webm':
                mimeType = 'webm';
                break;
            case 'video/mkv':
                mimeType = 'mkv';
                break;
            case 'video/avchd':
                mimeType = 'avchd';
                break;
            case 'video/mov':
                mimeType = 'mov';
                break;
            default:
                mimeType = 'error';
                break;
        }
        if (mimeType !== 'error') {
            const filename = functions_1.getUuid().replace(/-/gi, "");
            cb(null, filename + "." + mimeType);
        }
        else {
            return cb(new Error("wrong on the mimetype"), "error!");
        }
    }
});
const imagesUpload = multer_1.default({ storage: imageStorage });
const videosUpload = multer_1.default({ storage: videoStorage });
const baseRouter = express_1.Router();
const userRouter = express_1.Router();
const authRouter = express_1.Router();
const projectRouter = express_1.Router();
const assetRouter = express_1.Router();
const assetImageRouter = express_1.Router();
const assetVideoRouter = express_1.Router();
/*******************************************************
*                   기본 라우팅                         *
*                   [url]/api/                         *
********************************************************/
baseRouter.use('/auth', authRouter);
baseRouter.use('/users', userRouter);
userRouter.use('/projects', projectRouter);
projectRouter.use('/assets', assetRouter);
assetRouter.use('/images', assetImageRouter);
assetRouter.use('/videos', assetVideoRouter);
/*******************************************************
*                   사용자 관련 라우팅                    *
*                   [url]/api/users/                    *
********************************************************/
userRouter.get('/', Users_1.getAllUsers);
userRouter.get('/:id', Users_1.getUser);
userRouter.post('/', Users_1.addUser);
userRouter.patch('/:id', Users_1.updateUser);
userRouter.delete('/:id', Users_1.deleteUser);
userRouter.patch('/password/:id', Users_1.setPassword);
/*******************************************************
*                   프로젝트 관련 라우팅                 *
*                   [url]/api/users/projects           *
********************************************************/
projectRouter.get('/:id', Projects_1.getAllProjects);
projectRouter.get('/:id/:project_key', Projects_1.getProject);
projectRouter.post('/:id', Projects_1.createProject);
projectRouter.patch('/:id/:project_key', Projects_1.updateProject);
projectRouter.delete('/:id/:project_key', Projects_1.deleteProject);
projectRouter.get('/download/:id/:project_key', Projects_1.downloadProject);
/********************************************************************
*                   프로젝트 Assets Image 관련 라우팅                 *
*                   [url]/api/users/projects/assets/images          *
*********************************************************************/
assetImageRouter.get('/:id/:project_key', Assets_1.getAllAssetImages);
assetImageRouter.post('/:id/:project_key', imagesUpload.array('image'), Assets_1.addAssetImage);
assetImageRouter.delete('/:id/:project_key/:filename', Assets_1.deleteAssetImage);
/********************************************************************
*                   프로젝트 Assets Video 관련 라우팅               * *
*                   [url]/api/users/projects/assets/videos          *
*********************************************************************/
assetVideoRouter.get('/:id/:project_key', Assets_1.getAllAssetVideos);
assetVideoRouter.post('/:id/:project_key', videosUpload.array('video'), Assets_1.addAssetVideos);
assetVideoRouter.delete('/:id/:project_key/:filename', Assets_1.deleteAssetVideos);
assetVideoRouter.get('/split/:id/:project_key/:filename', Assets_1.splitAssetVideo);
/*******************************************************
*                   인증 관련 라우팅                    *
*                   [url]/api/auth/                    *
********************************************************/
authRouter.get('/user', Auth_1.authUser);
authRouter.post('/login', Auth_1.login);
authRouter.get('/logout', Auth_1.logout);
authRouter.post('/email-auth', Auth_1.sendAuthEmail);
authRouter.get('/email-auth/:id/:token', Auth_1.emailAuth);
exports.default = baseRouter;
