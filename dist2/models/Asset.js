"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assetsSchema = void 0;
const mongoose_1 = require("mongoose");
exports.assetsSchema = new mongoose_1.Schema({
    images: { type: [String], default: [] },
    images_min: { type: [String], default: [] },
    videos: { type: [String], default: [] },
    videos_min: { type: [String], default: [] },
});
