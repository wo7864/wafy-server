import { Schema } from 'mongoose';

const videoSchema = new Schema({
    filename:{type:String, required:true},
    isSplited:{type:Boolean, default:false},
    maxFrame:{type:Number, default: -1},
})



export interface IAssets{
    images:[String],
    images_min:[String],
    videos:[String],
    videos_min:[String],
}

export const assetsSchema = new Schema({
    images:{type:[String], default: []},
    images_min:{type:[String], default: []},
    videos:{type:[videoSchema], default: []},
    videos_min:{type:[String], default: []},
});


