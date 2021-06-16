"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectSchema = void 0;
const mongoose_1 = require("mongoose");
const dom_1 = require("./dom");
const Asset_1 = require("./Asset");
exports.projectSchema = new mongoose_1.Schema({
    _id: mongoose_1.Schema.Types.ObjectId,
    data: [dom_1.domSchema],
    title: { type: String, default: "새로운 웹사이트" },
    thumbnail: { type: String, default: "noImage.jpg" },
    assets: { type: Asset_1.assetsSchema, default: {} },
    create_date: Date,
    update_date: Date,
}, {
    timestamps: { currentTime: () => Date.now() }
});
exports.default = mongoose_1.model('Project', exports.projectSchema);
