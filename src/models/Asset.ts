import { Schema } from 'mongoose';

export interface IAssets{
    images:[String],
    images_min:[String],
    videos:[String],
    videos_min:[String],
}

export const assetsSchema = new Schema({
    images:{type:[String], default: []},
    images_min:{type:[String], default: []},
    videos:{type:[String], default: []},
    videos_min:{type:[String], default: []},
});

