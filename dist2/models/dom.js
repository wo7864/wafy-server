"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.domSchema = void 0;
const mongoose_1 = require("mongoose");
const serializr_1 = require("serializr");
const Style_1 = __importStar(require("./Style"));
const Animation_1 = __importStar(require("./Animation"));
exports.domSchema = new mongoose_1.Schema({
    tag: String,
    id: String,
    className: [String],
    innerText: String,
    style: Style_1.styleSchema,
    animation: Animation_1.animationListSchema,
});
exports.domSchema.add({
    children: [exports.domSchema],
});
const headTagProperty = ['id', 'className', 'rel', 'type', 'href', 'src'];
const div_list = ['section', 'text'];
class Dom {
    constructor(tag) {
        this.tag = tag;
        this.children = [];
        this.id = '';
        this.className = [];
        this.style = new Style_1.default();
        this.animation = new Animation_1.default();
    }
    setChildren(domList) {
        this.children = domList;
    }
    appendChild(dom) {
        this.children.push(dom);
    }
    get innerHTML() {
        const tag = div_list.includes(this.tag) ? 'div' : this.tag;
        let headTag = tag;
        for (const attr in this) {
            if (headTagProperty.includes(attr) && this[attr]) {
                if (attr === 'className' && this.className.length) {
                    headTag += ` class='${this.className.join(' ')}'`;
                }
                else {
                    headTag += ` ${attr}='${this[attr]}'`;
                }
            }
        }
        const innerText = this.innerText ? this.innerText + '\n' : '';
        const children = this.children.map((child) => {
            return child.innerHTML;
        }).join('\n');
        const html = `<${headTag}>\n${innerText}${children}\n</${tag}>`;
        return html;
    }
    get cssStyles() {
        const children = this.children.map((child) => {
            return child.cssStyles;
        }).join('\n');
        const css = `#${this.id}{\n${this.style.css}\n}\n${children}`;
        return css;
    }
    get animationScripts() {
        const children = this.children.map((child) => {
            return child.animationScripts;
        }).join('\n');
        const snakeId = this.id.replace('-', '_');
        const haveAnimationEvent = Object.keys(this.animation).filter(event => this.animation[event] !== null);
        const animations = haveAnimationEvent.map(event => {
            if (!this.animation[event])
                return;
            const anima = this.animation[event];
            const scroll = event === 'scroll' ?
                `, ${anima.start}, ${anima.end}` : '';
            const animation = `const ${snakeId}_${event} = ${this.animation[event].name}(${JSON.stringify(anima)});
${event}Event('#${this.id}', ${snakeId}_${event}${scroll});`;
            return animation;
        }).join('\n');
        const scripts = `
${animations}
${children}
`;
        return scripts;
    }
}
__decorate([
    serializr_1.serializable(serializr_1.object(Style_1.default))
], Dom.prototype, "style", void 0);
__decorate([
    serializr_1.serializable(serializr_1.object(Animation_1.default))
], Dom.prototype, "animation", void 0);
__decorate([
    serializr_1.serializable
], Dom.prototype, "tag", void 0);
__decorate([
    serializr_1.serializable(serializr_1.list(serializr_1.object(Dom)))
], Dom.prototype, "children", void 0);
__decorate([
    serializr_1.serializable
], Dom.prototype, "id", void 0);
__decorate([
    serializr_1.serializable(serializr_1.list(serializr_1.primitive()))
], Dom.prototype, "className", void 0);
__decorate([
    serializr_1.serializable
], Dom.prototype, "innerText", void 0);
__decorate([
    serializr_1.serializable
], Dom.prototype, "rel", void 0);
__decorate([
    serializr_1.serializable
], Dom.prototype, "type", void 0);
__decorate([
    serializr_1.serializable
], Dom.prototype, "href", void 0);
__decorate([
    serializr_1.serializable
], Dom.prototype, "src", void 0);
exports.default = Dom;
