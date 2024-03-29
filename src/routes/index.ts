import { Router } from 'express';
import multer from 'multer';
import { getUuid } from '@shared/functions';
import {
    login,
    logout,
    emailAuth,
    sendAuthEmail,
    authUser,
} from './Auth';

import {
    getAllUsers,
    getUser,
    addUser,
    updateUser,
    deleteUser,
    setPassword,
} from './Users'

import {
    getAllProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject,
    downloadProject,
    getSimpleProjects,
    createTemplateProject,
    saveProject,
} from './Projects';

import {
    getAllAssetImages,
    addAssetImage,
    deleteAssetImage,
    getAllAssetVideos,
    addAssetVideos,
    deleteAssetVideos,
    splitAssetVideo,
} from './Assets';

const imageStorage = multer.diskStorage({
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
        if(mimeType !== 'error'){
            const filename = getUuid().replace(/-/gi, "")
            cb(null, filename + "." + mimeType);
        }else{
            return cb(new Error("wrong on the mimetype"), "error!");
        }
    }
});

const videoStorage = multer.diskStorage({
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

        if(mimeType !== 'error'){
            const filename = getUuid().replace(/-/gi, "")
            cb(null, filename + "." + mimeType);
        }else{
            return cb(new Error("wrong on the mimetype"), "error!");
        }

    }
});

const imagesUpload = multer({ storage: imageStorage })
const videosUpload = multer({ storage: videoStorage })


const baseRouter = Router();
const userRouter = Router();
const authRouter = Router();
const projectRouter = Router();
const assetRouter = Router();
const assetImageRouter = Router();
const assetVideoRouter = Router();


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

userRouter.patch('/password/:id', setPassword);
userRouter.get('/', getAllUsers);
userRouter.get('/:id', getUser);
userRouter.post('/', addUser);
userRouter.patch('/:id', updateUser);
userRouter.delete('/:id', deleteUser);

/*******************************************************
*                   프로젝트 관련 라우팅                 *
*                   [url]/api/users/projects           *
********************************************************/
projectRouter.get('/simple/:id', getSimpleProjects);
projectRouter.get('/download/:id/:project_id', downloadProject);
projectRouter.post('/template/:id/:template_oid/:project_id', createTemplateProject);
projectRouter.patch('/save/:id/:project_id', saveProject);
projectRouter.get('/:id', getAllProjects);
projectRouter.get('/:id/:project_id', getProject);
projectRouter.post('/:id', createProject);
projectRouter.patch('/:id/:project_id', updateProject);
projectRouter.delete('/:id/:project_id', deleteProject);



/********************************************************************
*                   프로젝트 Assets Image 관련 라우팅                 *
*                   [url]/api/users/projects/assets/images          *
*********************************************************************/

assetImageRouter.get('/:id/:project_id', getAllAssetImages);
assetImageRouter.post('/:id/:project_id', imagesUpload.array('image'), addAssetImage);
assetImageRouter.delete('/:id/:project_id/:filename', deleteAssetImage);


/********************************************************************
*                   프로젝트 Assets Video 관련 라우팅               * *
*                   [url]/api/users/projects/assets/videos          *
*********************************************************************/

assetVideoRouter.get('/split/:id/:project_id/:filename', splitAssetVideo);
assetVideoRouter.get('/:id/:project_id', getAllAssetVideos);
assetVideoRouter.post('/:id/:project_id', videosUpload.array('video'), addAssetVideos);
assetVideoRouter.delete('/:id/:project_id/:filename', deleteAssetVideos);

/*******************************************************
*                   인증 관련 라우팅                    *
*                   [url]/api/auth/                    *
********************************************************/
authRouter.get('/user', authUser);
authRouter.post('/login', login);
authRouter.get('/logout', logout);
authRouter.post('/email-auth', sendAuthEmail);
authRouter.get('/email-auth/:id/:token', emailAuth);


export default baseRouter;
