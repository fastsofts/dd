export interface DentalState {
    dentalFormat: object;  // or whatever type 'dentalFormat' is
}

export interface DentalFormat {
    [key: string] : Diagram;
}

export interface Click {
    "type":string,
    "radius":number,
    "defaultShapeColor" : string,
    "clickedShapeColor" : string,
    "hoveredShapeColor" : string,
    "borderColor" : string,
    "borderThick" : string|number,
    "borderLineCap" : string,
    "borderDash" : string,
    "borderLineJoin" : string,
    "verticalAlign":string,
    "horizontalAlign":string,
    "fontSize" : string,
    "text":string,
    "centerAlign":string,
    "noclick":boolean
}

export interface Diagram {
    "show":boolean,
    "row":string|number,
    "col":string|number,
    "addemptyBlock" : boolean,
    "class" : string, 
    "width":number,
    "height":number,
    "maxcolumsinarow":number,
    "type":string,
    "position":string;
    "teethID":number;
    "block" : Block
}


export interface Block{
    [key: string] : DiagramDetails;  
}

export interface DiagramDetails{
    "path": string,
    "id": string,
    "defaultShapeColor" : string,
    "clickedShapeColor" : string,
    "hoveredShapeColor" : string,
    "borderColor" : string,
    "borderThick" : string|number,
    "borderLineCap" : string,
    "borderDash" : string,
    "borderLineJoin" : string,
    "type": string,
    "width" : string|null,
    "height" : string|null,
    "moveX" : number,
    "moveY" : number,
    "radius": number|null,
    "x" : number|string|null,
    "y" : number|string|null,
    "points" :string,
    "click":Click,
    "verticalAlign":string,
    "horizontalAlign":string,
    "fontSize" : string,
    "text":string,
    "textalpha":string,
    "centerAlign":string,
    "noclick":boolean
}


