import { Schema } from "mongoose";
import {
    serializable,
    object,
} from "serializr";
export interface IAnimation{
    name:String,
    target:string;
    duration?:Number;
    timing?:Number;
    easingFunction?:string;

    imageSrc?:string;
    imageWidth?:string;
    imageHeight?:string;
    cursor?:boolean;

    bright?:Number;
    blur?:Number;
    maxLetterSpacing?:Number;
    height?:Number;

    afterText?:string;

    color?:string;
    backgroundColor?:string;

    gap?:Number;
    cutCount?:Number;

    start?:Number;
    end?:Number;
}

export interface IAnimationList{
    view:Animation|null;
    scroll:Animation|null;
    hover:Animation|null;
    click:Animation|null;
    dbclick:Animation|null;
}

const animationSchema = new Schema({
    name:String,
    target:String,
    duration:Number,
    timing:Number,
    easingFunction:String,

    imageSrc:String,
    imageWidth:String,
    imageHeight:String,
    cursor:Boolean,

    bright:Number,
    blur:Number,
    maxLetterSpacing:Number,
    height:Number,

    afterText:String,

    color:String,
    backgroundColor:String,

    gap:Number,
    cutCount:Number,
    start:Number,
    end:Number,
})

export const animationListSchema = new Schema({
    view:animationSchema,
    scroll:animationSchema,
    hover:animationSchema,
    click:animationSchema,
    dbclick:animationSchema,
})


class Animation implements IAnimation{

    [key:string]:any
    @serializable
    name:string;

    @serializable
    target:string;

    @serializable
    duration?:Number;

    @serializable
    timing?:Number;

    @serializable
    easingFunction?:string;

    @serializable
    imageSrc?:string;
    @serializable
    imageWidth?:string;
    @serializable
    imageHeight?:string;
    @serializable
    cursor?:boolean;

    @serializable
    bright?:Number;
    @serializable
    blur?:Number;
    @serializable
    maxLetterSpacing?:Number;
    @serializable
    height?:Number;

    @serializable
    afterText?:string;

    @serializable
    color?:string;
    @serializable
    backgroundColor?:string;

    @serializable
    gap?:Number;
    @serializable
    cutCount?:Number;

    @serializable
    start?:Number;
    @serializable
    end?:Number;

    constructor(){
        this.name = '';
        this.target = 'self';

    }
}

export default class AnimationList implements IAnimationList{
    [key:string]:any
    @serializable(object(Animation))
    view:Animation|null;
    @serializable(object(Animation))
    scroll:Animation|null;
    @serializable(object(Animation))
    hover:Animation|null;
    @serializable(object(Animation))
    click:Animation|null;
    @serializable(object(Animation))
    dbclick:Animation|null;
    constructor(){
        this.view = null;
        this.scroll = null;
        this.hover = null;
        this.click = null;
        this.dbclick = null;
    }

}