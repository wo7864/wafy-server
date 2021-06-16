"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.animationListSchema = void 0;
const mongoose_1 = require("mongoose");
const serializr_1 = require("serializr");
const animationSchema = new mongoose_1.Schema({
    name: String,
    target: String,
    duration: Number,
    timing: Number,
    easingFunction: String,
    imageSrc: String,
    imageWidth: String,
    imageHeight: String,
    cursor: Boolean,
    bright: Number,
    blur: Number,
    maxLetterSpacing: Number,
    height: Number,
    afterText: String,
    color: String,
    backgroundColor: String,
    gap: Number,
    cutCount: Number,
    start: Number,
    end: Number,
});
exports.animationListSchema = new mongoose_1.Schema({
    view: animationSchema,
    scroll: animationSchema,
    hover: animationSchema,
    click: animationSchema,
    dbclick: animationSchema,
});
class Animation {
    constructor() {
        this.name = '';
        this.target = 'self';
    }
}
__decorate([
    serializr_1.serializable
], Animation.prototype, "name", void 0);
__decorate([
    serializr_1.serializable
], Animation.prototype, "target", void 0);
__decorate([
    serializr_1.serializable
], Animation.prototype, "duration", void 0);
__decorate([
    serializr_1.serializable
], Animation.prototype, "timing", void 0);
__decorate([
    serializr_1.serializable
], Animation.prototype, "easingFunction", void 0);
__decorate([
    serializr_1.serializable
], Animation.prototype, "imageSrc", void 0);
__decorate([
    serializr_1.serializable
], Animation.prototype, "imageWidth", void 0);
__decorate([
    serializr_1.serializable
], Animation.prototype, "imageHeight", void 0);
__decorate([
    serializr_1.serializable
], Animation.prototype, "cursor", void 0);
__decorate([
    serializr_1.serializable
], Animation.prototype, "bright", void 0);
__decorate([
    serializr_1.serializable
], Animation.prototype, "blur", void 0);
__decorate([
    serializr_1.serializable
], Animation.prototype, "maxLetterSpacing", void 0);
__decorate([
    serializr_1.serializable
], Animation.prototype, "height", void 0);
__decorate([
    serializr_1.serializable
], Animation.prototype, "afterText", void 0);
__decorate([
    serializr_1.serializable
], Animation.prototype, "color", void 0);
__decorate([
    serializr_1.serializable
], Animation.prototype, "backgroundColor", void 0);
__decorate([
    serializr_1.serializable
], Animation.prototype, "gap", void 0);
__decorate([
    serializr_1.serializable
], Animation.prototype, "cutCount", void 0);
__decorate([
    serializr_1.serializable
], Animation.prototype, "start", void 0);
__decorate([
    serializr_1.serializable
], Animation.prototype, "end", void 0);
class AnimationList {
    constructor() {
        this.view = null;
        this.scroll = null;
        this.hover = null;
        this.click = null;
        this.dbclick = null;
    }
}
__decorate([
    serializr_1.serializable(serializr_1.object(Animation))
], AnimationList.prototype, "view", void 0);
__decorate([
    serializr_1.serializable(serializr_1.object(Animation))
], AnimationList.prototype, "scroll", void 0);
__decorate([
    serializr_1.serializable(serializr_1.object(Animation))
], AnimationList.prototype, "hover", void 0);
__decorate([
    serializr_1.serializable(serializr_1.object(Animation))
], AnimationList.prototype, "click", void 0);
__decorate([
    serializr_1.serializable(serializr_1.object(Animation))
], AnimationList.prototype, "dbclick", void 0);
exports.default = AnimationList;
