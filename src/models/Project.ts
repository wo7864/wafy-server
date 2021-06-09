
import { Schema, model } from 'mongoose';
import Dom, { domSchema } from './dom';
import {assetsSchema, IAssets} from './Asset';


export interface IProject{
    _id:Schema.Types.ObjectId,
    data:Array<Dom>,
    thumbnail:string,
    assets:IAssets,
    create_date:Date,
    update_date:Date,
}


export const projectSchema = new Schema({
    _id:Schema.Types.ObjectId,
    data:[domSchema],
    title:{type:String, default:"새로운 웹사이트"},
    thumbnail:{type:String, default:"noImage.jpg"},
    assets:{type:assetsSchema, default: {}},
    create_date:Date,
    update_date:Date,
}, {
    timestamps: { currentTime: () => Date.now()}
});

export default model<IProject & Document>('Project', projectSchema);
