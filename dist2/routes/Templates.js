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
exports.deleteTemplate = exports.updateTemplate = exports.addTemplate = exports.getTemplate = exports.getAllTemplates = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const express_1 = require("express");
const constants_1 = require("@shared/constants");
const { BAD_REQUEST, CREATED, OK } = http_status_codes_1.default;
const router = express_1.Router();
/**
 * Get all templates.
 *
 * @param req
 * @param res
 * @returns
 */
function getAllTemplates(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //const templates = await templateDao.getAll();
        const templates = {};
        return res.status(OK).json({ templates });
    });
}
exports.getAllTemplates = getAllTemplates;
/**
* Get templates.
*
* @param req
* @param res
* @returns
*/
function getTemplate(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        //const templates = await templateDao.getAll();
        const template = {};
        return res.status(OK).json({ template });
    });
}
exports.getTemplate = getTemplate;
/**
* Add one template.
*
* @param res
* @returns
*/
function addTemplate(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { template } = req.body;
        if (!template) {
            return res.status(BAD_REQUEST).json({
                error: constants_1.paramMissingError,
            });
        }
        //await templateDao.add(template);
        return res.status(CREATED).end();
    });
}
exports.addTemplate = addTemplate;
/**
* Update one template.
*
* @param req
* @param res
* @returns
*/
function updateTemplate(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { template } = req.body;
        if (!template) {
            return res.status(BAD_REQUEST).json({
                error: constants_1.paramMissingError,
            });
        }
        //await templateDao.update(template);
        return res.status(OK).end();
    });
}
exports.updateTemplate = updateTemplate;
/**
* Delete one template.
*
* @param req
* @param res
* @returns
*/
function deleteTemplate(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        //await templateDao.delete(Number(id));
        return res.status(OK).end();
    });
}
exports.deleteTemplate = deleteTemplate;
router.get('/', getAllTemplates);
router.get('/:template_key', getTemplate);
router.post('/', addTemplate);
router.put('/:template_key', updateTemplate);
router.delete('/:template_key', deleteTemplate);
exports.default = router;
