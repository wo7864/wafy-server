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
exports.splitAssetVideo = exports.deleteAssetVideos = exports.addAssetVideos = exports.getAllAssetVideos = exports.deleteAssetImage = exports.addAssetImage = exports.getAllAssetImages = void 0;
const fs_1 = __importDefault(require("fs"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const constants_1 = require("@shared/constants");
const User_1 = __importDefault(require("../models/User"));
const { BAD_REQUEST, CREATED, OK, NOT_FOUND } = http_status_codes_1.default;
function getAllAssetImages(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id, project_key } = req.params;
        yield User_1.default.findById(id)
            .then((user) => {
            const project = user.projects.id(project_key);
            return res.status(OK).json(project.assets.images);
        })
            .catch(e => res.status(BAD_REQUEST).send(e));
    });
}
exports.getAllAssetImages = getAllAssetImages;
function addAssetImage(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id, project_key } = req.params;
        const images = req.files;
        if (!(images && id && project_key)) {
            return res.status(BAD_REQUEST).json({
                error: constants_1.paramMissingError,
            });
        }
        yield User_1.default.findById(id)
            .then((user) => {
            const project = user.projects.id(project_key);
            project.assets.images.push(images[0].filename);
            user.save();
            return res.status(CREATED).json(images[0].filename);
        })
            .catch(e => res.status(BAD_REQUEST).send(e));
    });
}
exports.addAssetImage = addAssetImage;
function deleteAssetImage(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id, project_key, filename } = req.params;
        if (!(id && project_key && filename)) {
            return res.status(BAD_REQUEST).json({
                error: constants_1.paramMissingError,
            });
        }
        fs_1.default.unlink(`./src/public/assets/images/${filename}`, (err) => {
            if (!err)
                return;
            console.error(`${filename} delete fail`);
            return res.status(BAD_REQUEST).json({
                error: constants_1.notFoundError
            });
        });
        yield User_1.default.findById(id)
            .then((user) => {
            const project = user.projects.id(project_key);
            project.assets.images = project.assets.images.filter((image) => image != filename);
            user.save();
            return res.status(CREATED).end();
        })
            .catch(e => res.status(BAD_REQUEST).send(e));
        //await projectDao.delete(Number(id));
        return res.status(OK).end();
    });
}
exports.deleteAssetImage = deleteAssetImage;
function getAllAssetVideos(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id, project_key } = req.params;
        yield User_1.default.findById(id)
            .then((user) => {
            const project = user.projects.id(project_key);
            return res.status(OK).json(project.assets.videos);
        })
            .catch(e => res.status(BAD_REQUEST).send(e));
    });
}
exports.getAllAssetVideos = getAllAssetVideos;
function addAssetVideos(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id, project_key } = req.params;
        const videos = req.files;
        if (!(videos && id && project_key)) {
            return res.status(BAD_REQUEST).json({
                error: constants_1.paramMissingError,
            });
        }
        yield User_1.default.findById(id)
            .then((user) => {
            const project = user.projects.id(project_key);
            project.assets.videos.push(videos[0].filename);
            user.save();
            return res.status(CREATED).json(videos[0].filename);
        })
            .catch(e => res.status(BAD_REQUEST).send(e));
    });
}
exports.addAssetVideos = addAssetVideos;
function deleteAssetVideos(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id, project_key, filename } = req.params;
        if (!(id && project_key && filename)) {
            return res.status(BAD_REQUEST).json({
                error: constants_1.paramMissingError,
            });
        }
        fs_1.default.unlink(`./src/public/assets/videos/${filename}`, (err) => {
            if (!err)
                return;
            console.error(`${filename} delete fail`);
            return res.status(BAD_REQUEST).json({
                error: constants_1.notFoundError,
                detail: err
            });
        });
        yield User_1.default.findById(id)
            .then((user) => {
            const project = user.projects.id(project_key);
            project.assets.videos = project.assets.videos.filter((image) => image != filename);
            user.save();
            return res.status(CREATED).end();
        })
            .catch(e => res.status(BAD_REQUEST).send(e));
    });
}
exports.deleteAssetVideos = deleteAssetVideos;
function splitAssetVideo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id, project_key, filename } = req.params;
        if (!(id && project_key && filename)) {
            return res.status(BAD_REQUEST).json({
                error: constants_1.paramMissingError,
            });
        }
    });
}
exports.splitAssetVideo = splitAssetVideo;
