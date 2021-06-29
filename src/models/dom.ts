import { Schema } from "mongoose";
import {
    serializable,
    list,
    object,
    primitive,
} from "serializr";
import Style, {IStyle, styleSchema} from "./Style";
import AnimationList, {IAnimationList, animationListSchema} from "./Animation";

export interface IDom{
    [key:string]:any

    style:IStyle;
    animation:AnimationList;
    
    
    tag:string;
    children:Array<Dom>;
    id:string;
    className:string[];
    innerText?:string;
    rel?:string;
    type?:string;
    href?:string;
    src?:string;



}


export const domSchema = new Schema({
    style:styleSchema,
    animation:animationListSchema,

    tag:String,
    id:String,
    className:[String],
    innerText:String,
    rel:String,
    type:String,
    href:String,
    src:String,
})
domSchema.add({
    children:[domSchema],
})




const headTagProperty = ['id', 'className', 'rel', 'type', 'href', 'src']
const div_list = ['section', 'text']

export default class Dom implements IDom{

    @serializable(object(Style))
    style:Style;
    @serializable(object(AnimationList))
    animation:AnimationList;

    @serializable
    tag:string;

    @serializable(list(object(Dom)))
    children:Array<Dom>;

    @serializable
    id:string;

    @serializable(list(primitive()))
    className:string[];

    @serializable
    innerText?:string;

    @serializable
    rel?:string;

    @serializable
    type?:string;

    @serializable
    href?:string;

    @serializable
    src?:string;

    constructor(tag:string){
        this.tag = tag;
        this.children = [];
        this.id = '';
        this.className = [];

        this.style = new Style();
        this.animation = new AnimationList();
    }

    setChildren(domList:Array<Dom>){
        this.children = domList
    }

    appendChild(dom:Dom){
        this.children.push(dom)
    }

    get innerHTML():string{

        const tag = div_list.includes(this.tag) ? 'div' : this.tag;
        let headTag = tag;
        for(const attr in this){
            if(headTagProperty.includes(attr) && this[attr]){
                if(attr === 'className' && this.className.length){
                    headTag += ` class='${this.className.join(' ')}'`
                }else{
                    headTag += ` ${attr}='${this[attr]}'`
                }
            }
        }

        const innerText = this.innerText ? this.innerText+'\n' : '' ;
        const children = this.children.map((child:Dom) => {
            return child.innerHTML;
        }).join('\n');

        const html = `<${headTag}>\n${innerText}${children}\n</${tag}>`;
        return html;
    }


    get cssStyles():string{
        const children = this.children.map((child:Dom) => {
            return child.cssStyles
        }).join('\n');

        const css:string = `#${this.id}{\n${this.style.css}\n}\n${children}`;
        return css;

    }


    get animationScripts():string{
        const children = this.children.map((child:Dom) => {
            return child.animationScripts
        }).join('\n')
        const snakeId = this.id.replace('-', '_');
        const haveAnimationEvent = Object.keys(this.animation).filter(event => this.animation[event]!==null)
        const animations = haveAnimationEvent.map(event => {
            if(!this.animation[event]) return;
            const anima = this.animation[event];
            const scroll = event === 'scroll' ?
            `, ${anima.start}, ${anima.end}` : ''      
            const animation = 
`const ${snakeId}_${event} = ${this.animation[event].name}(${JSON.stringify(anima)});
${event}Event('#${this.id}', ${snakeId}_${event}${scroll});`
            return animation;
        }).join('\n')


        const scripts:string =
`
${animations}
${children}
`
        return scripts
    }

    

}