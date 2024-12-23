export interface DentalCategoryState {
    dentalCategoryFormat: object;  // or whatever type 'dentalFormat' is
}

export interface DentalCategoryFormat {
    [key: string] : Categories;
}

export interface Categories{
    id:string;
    name:string;
    drawing:Drawing;
}

export interface Drawing{
    type:string;
    x:number;
    y:number;
    moveX:number
    moveY:number;
    radiusratioX:number;
    radiusratioY:number;
    fill:string;
    stroke:string;
    strokewidth:number;
    pathString:string;
    width:number|null;
    height:number|null;
    categories:Array<string>;
    text:Text;
    base:string;
}

export interface Text{
    name:string;
    fill:string;
    stroke:string;
    strokewidth:number;
    dx:number;
    dy:number;
    x:number;
    y:number;
    font:Font;
    categories:Array<string>;
}

export interface Font{
    name:string;
    size:string;
    weight:number,
}




