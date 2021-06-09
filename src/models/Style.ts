
import { Schema } from 'mongoose';
import {
    serializable,
    list,
    primitive,
} from "serializr";
import { camelToKebabCase } from '@shared/functions'

export interface IStyle {
    [key: string]: any

    locked: Array<string>;

    left: Number;
    top: Number;
    width: Number;
    height: Number;

    leftUnit: string;
    topUnit: string;
    widthUnit: string;
    heightUnit: string;

    minWidth: Number;
    minHeight: Number;

    paddingLeft: Number;
    paddingRight: Number;
    paddingTop: Number;
    paddingBottom: Number;

    position: string;
    display: string;

    backgroundColor: string;
    color: string;

    /* section & button Style */
    flexDirection?: string;
    flexWrap?: string;
    justifyContent?: string;
    alignItems?: string;
    alignContent?: string;

    /* text & button Style */
    textAlign?: string;
    fontFamily?: string;
    fontWeight?: string;
    fontSize?: string;
    fontStyle?: string;
    textDecoration?: string;

    /* section & image & video & button Style */
    boxShadow?: string;

    /* section Style */
    backdropFilter?: string;


}


export const styleSchema = new Schema({
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


})



const notCssProperty = ['leftUnit', 'topUnit', 'widthUnit', 'heightUnit', 'locked', 'lock', 'unlock']
const haveUnitProperty = ['left', 'top', 'width', 'height'];

export default class Style implements IStyle {
    [key: string]: any

    @serializable(list(primitive()))
    locked: Array<string>;

    @serializable
    left: Number;
    @serializable
    top: Number;
    @serializable
    width: Number;
    @serializable
    height: Number;

    @serializable
    leftUnit: string;
    @serializable
    topUnit: string;
    @serializable
    widthUnit: string;
    @serializable
    heightUnit: string;

    @serializable
    minWidth: Number;
    @serializable
    minHeight: Number;

    @serializable
    paddingLeft: Number;
    @serializable
    paddingRight: Number;
    @serializable
    paddingTop: Number;
    @serializable
    paddingBottom: Number;

    @serializable
    position: string;
    @serializable
    display: string;

    @serializable
    backgroundColor: string;
    @serializable
    color: string;

    /* section style */
    @serializable
    flexDirection?: string;
    @serializable
    flexWrap?: string;
    @serializable
    justifyContent?: string;
    @serializable
    alignItems?: string;
    @serializable
    alignContent?: string;

    /* text & button Style */
    @serializable
    textAlign?: string;
    @serializable
    fontFamily?: string;
    @serializable
    fontWeight?: string;
    @serializable
    fontSize?: string;
    @serializable
    fontStyle?: string;
    @serializable
    textDecoration?: string;

    /* section & image & video & button Style */
    @serializable
    boxShadow?: string;

    /* section Style */
    @serializable
    backdropFilter?: string;
    constructor() {

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


    lock = (attr: string) => {
        if (!this.locked.includes(attr)) this.locked.push(attr)
    }
    unlock = (attr: string) => {
        const index = this.locked.indexOf(attr)
        if (index > -1) this.locked.splice(index, 1)
    }

    get css(): string {

        let data = ''
        Object.keys(this).map(key => {

        })
        for (const attr in this) {
            if (!notCssProperty.includes(attr) && this[attr] !== null) {
                if (haveUnitProperty.includes(attr)) {
                    data += `${camelToKebabCase(attr)}:${this[attr] + this[attr + 'Unit']};\n`
                } else {
                    data += `${camelToKebabCase(attr)}:${this[attr]};\n`
                }
            }
        }
        return data
    }

}
