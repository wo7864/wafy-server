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
exports.downloadProject = exports.deleteProject = exports.updateProject = exports.createProject = exports.getProject = exports.getAllProjects = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const constants_1 = require("@shared/constants");
const converter_1 = require("@shared/converter");
const User_1 = __importDefault(require("../models/User"));
const Project_1 = __importDefault(require("../models/Project"));
const { BAD_REQUEST, CREATED, OK, NOT_FOUND } = http_status_codes_1.default;
function getAllProjects(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        if (!id) {
            return res.status(BAD_REQUEST).json({
                error: constants_1.paramMissingError,
            });
        }
        yield User_1.default.findById(id)
            .then((user) => {
            return res.status(OK).send(user.projects);
        })
            .catch(e => res.status(BAD_REQUEST).send(e));
    });
}
exports.getAllProjects = getAllProjects;
function getProject(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id, project_key } = req.params;
        if (!(id && project_key)) {
            return res.status(BAD_REQUEST).json({
                error: constants_1.paramMissingError,
            });
        }
        yield User_1.default.findById(id)
            .then((user) => {
            return res.status(OK).send(user.projects.id(project_key));
        })
            .catch(e => res.status(BAD_REQUEST).send(e));
        return;
    });
}
exports.getProject = getProject;
function createProject(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const { project } = req.body;
            if (!(project && id)) {
                return res.status(BAD_REQUEST).json({
                    error: constants_1.paramMissingError,
                });
            }
            const project_ = yield new Project_1.default(project);
            const user = yield User_1.default.findOne({ _id: id });
            if (!user) {
                return res.status(NOT_FOUND).json({
                    error: constants_1.notFoundError,
                });
            }
            if (user.projects.length >= 3) {
                return res.status(BAD_REQUEST).json({
                    error: constants_1.meximumExceededError,
                });
            }
            user.projects.push(project_);
            user.save();
        }
        catch (e) {
            console.error(e);
        }
        return res.status(CREATED).end();
    });
}
exports.createProject = createProject;
/**
* Update one project.
*
* @param req
* @param res
* @returns
*/
function updateProject(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id, project_key } = req.params;
        const { project } = req.body;
        if (!(id && project_key && project)) {
            return res.status(BAD_REQUEST).json({
                error: constants_1.paramMissingError,
            });
        }
        yield User_1.default.findById(id)
            .then((user) => {
            const originProject = user.projects.id(project_key);
            originProject.set(project);
            return user.save();
        })
            .then((user) => {
            return res.status(OK).send({ user });
        })
            .catch(e => res.status(BAD_REQUEST).send(e));
        return;
    });
}
exports.updateProject = updateProject;
/**
* Delete one project.
*
* @param req
* @param res
* @returns
*/
function deleteProject(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id, project_key } = req.params;
        const { project } = req.body;
        if (!(project && id && project_key)) {
            return res.status(BAD_REQUEST).json({
                error: constants_1.paramMissingError,
            });
        }
        yield User_1.default.findById(id)
            .then((user) => {
            user.projects.id(project_key).remove();
            return user.save();
        })
            .then((user) => {
            return res.status(OK).send({ user });
        })
            .catch(e => res.status(BAD_REQUEST).send(e));
        return;
    });
}
exports.deleteProject = deleteProject;
function downloadProject(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id, project_key } = req.params;
        if (!(id && project_key)) {
            return res.status(BAD_REQUEST).json({
                error: constants_1.paramMissingError,
            });
        }
        yield User_1.default.findById(id)
            .then((user) => {
            if (!user) {
                return res.status(NOT_FOUND).json({
                    error: constants_1.notFoundError,
                });
            }
            const project = user.projects.id(project_key);
            console.log('hi');
            converter_1.converter(project);
            //const {html, css, js} = converter(project.data);
        })
            .then((user) => {
            return res.status(OK).send({ user });
        })
            .catch(e => res.status(BAD_REQUEST).json({
            error: 'findError or promise Error',
            contents: e
        }));
        //return res.status(OK).end();
    });
}
exports.downloadProject = downloadProject;
