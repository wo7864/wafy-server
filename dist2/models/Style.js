"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.styleSchema = void 0;
const mongoose_1 = require("mongoose");
const serializr_1 = require("serializr");
const functions_1 = require("@shared/functions");
exports.styleSchema = new mongoose_1.Schema({
    locked: [String],
    left: Number,
    top: Number,
    width: Number,
    height: Number,
    leftUnit: String,
    topUnit: String,
    widthUnit: String,
    heightUnit: String,
    minWidth: Number,
    minHeight: Number,
    paddingLeft: Number,
    paddingRight: Number,
    paddingTop: Number,
    paddingBottom: Number,
    position: String,
    display: String,
    backgroundColor: String,
    color: String,
    /* section & button Style */
    flexDirection: String,
    flexWrap: String,
    justifyContent: String,
    alignItems: String,
    alignContent: String,
    /* text & button Style */
    textAlign: String,
    fontFamily: String,
    fontWeight: String,
    fontSize: String,
    fontStyle: String,
    textDecoration: String,
    /* section & image & video & button Style */
    boxShadow: String,
    /* section Style */
    backdropFilter: String,
});
const notCssProperty = ['leftUnit', 'topUnit', 'widthUnit', 'heightUnit', 'locked', 'lock', 'unlock'];
const haveUnitProperty = ['left', 'top', 'width', 'height'];
class Style {
    constructor() {
        this.lock = (attr) => {
            if (!this.locked.includes(attr))
                this.locked.push(attr);
        };
        this.unlock = (attr) => {
            const index = this.locked.indexOf(attr);
            if (index > -1)
                this.locked.splice(index, 1);
        };
        this.locked = [];
        this.left = 0;
        this.top = 0;
        this.width = 100;
        this.height = 100;
        this.minWidth = 1;
        this.minHeight = 1;
        this.leftUnit = 'px';
        this.topUnit = 'px';
        this.widthUnit = 'px';
        this.heightUnit = 'px';
        this.position = 'relative';
        this.paddingLeft = 0;
        this.paddingRight = 0;
        this.paddingTop = 0;
        this.paddingBottom = 0;
        this.display = 'block';
        this.backgroundColor = 'rgba(255, 255, 255, 0)';
        this.color = 'block';
    }
    get css() {
        let data = '';
        Object.keys(this).map(key => {
        });
        for (const attr in this) {
            if (!notCssProperty.includes(attr) && this[attr] !== null) {
                if (haveUnitProperty.includes(attr)) {
                    data += `${functions_1.camelToKebabCase(attr)}:${this[attr] + this[attr + 'Unit']};\n`;
                }
                else {
                    data += `${functions_1.camelToKebabCase(attr)}:${this[attr]};\n`;
                }
            }
        }
        return data;
    }
}
__decorate([
    serializr_1.serializable(serializr_1.list(serializr_1.primitive()))
], Style.prototype, "locked", void 0);
__decorate([
    serializr_1.serializable
], Style.prototype, "left", void 0);
__decorate([
    serializr_1.serializable
], Style.prototype, "top", void 0);
__decorate([
    serializr_1.serializable
], Style.prototype, "width", void 0);
__decorate([
    serializr_1.serializable
], Style.prototype, "height", void 0);
__decorate([
    serializr_1.serializable
], Style.prototype, "leftUnit", void 0);
__decorate([
    serializr_1.serializable
], Style.prototype, "topUnit", void 0);
__decorate([
    serializr_1.serializable
], Style.prototype, "widthUnit", void 0);
__decorate([
    serializr_1.serializable
], Style.prototype, "heightUnit", void 0);
__decorate([
    serializr_1.serializable
], Style.prototype, "minWidth", void 0);
__decorate([
    serializr_1.serializable
], Style.prototype, "minHeight", void 0);
__decorate([
    serializr_1.serializable
], Style.prototype, "paddingLeft", void 0);
__decorate([
    serializr_1.serializable
], Style.prototype, "paddingRight", void 0);
__decorate([
    serializr_1.serializable
], Style.prototype, "paddingTop", void 0);
__decorate([
    serializr_1.serializable
], Style.prototype, "paddingBottom", void 0);
__decorate([
    serializr_1.serializable
], Style.prototype, "position", void 0);
__decorate([
    serializr_1.serializable
], Style.prototype, "display", void 0);
__decorate([
    serializr_1.serializable
], Style.prototype, "backgroundColor", void 0);
__decorate([
    serializr_1.serializable
], Style.prototype, "color", void 0);
__decorate([
    serializr_1.serializable
], Style.prototype, "flexDirection", void 0);
__decorate([
    serializr_1.serializable
], Style.prototype, "flexWrap", void 0);
__decorate([
    serializr_1.serializable
], Style.prototype, "justifyContent", void 0);
__decorate([
    serializr_1.serializable
], Style.prototype, "alignItems", void 0);
__decorate([
    serializr_1.serializable
], Style.prototype, "alignContent", void 0);
__decorate([
    serializr_1.serializable
], Style.prototype, "textAlign", void 0);
__decorate([
    serializr_1.serializable
], Style.prototype, "fontFamily", void 0);
__decorate([
    serializr_1.serializable
], Style.prototype, "fontWeight", void 0);
__decorate([
    serializr_1.serializable
], Style.prototype, "fontSize", void 0);
__decorate([
    serializr_1.serializable
], Style.prototype, "fontStyle", void 0);
__decorate([
    serializr_1.serializable
], Style.prototype, "textDecoration", void 0);
__decorate([
    serializr_1.serializable
], Style.prototype, "boxShadow", void 0);
__decorate([
    serializr_1.serializable
], Style.prototype, "backdropFilter", void 0);
exports.default = Style;
