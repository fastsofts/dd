import { Component,ElementRef,ChangeDetectionStrategy,ChangeDetectorRef} from '@angular/core';
import { Location } from '@angular/common';
import { CommonModule,NgStyle } from '@angular/common';
import {DentalFormat,DentalState,Diagram,Block} from '../dataService/dentalFormat.model'
import {SideNav} from '../sideNav/SideNav';
import { SideWindowState} from '../sideWindowState/sideWindow.service';
import {DentalDrawingSelectionService} from '../dataService/dentalDrawingSelection.service';
import {Drawing}  from '../dataService/dentalCategoryFormat.model'
import * as d3 from 'd3';

@Component({
    selector: 'dentalchart',
    templateUrl: './DentalChart.html',
    styleUrl: './DentalChart.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports:[SideNav,CommonModule],
    standalone: true
})

export class DentalChart {
  dentalformat:any = {};
  dentalcategoryformat:any= {};
  jsonselections:any = {};
  clickedpart:any = {};
  expandtheChart:boolean = false;
  chipsbutton:string = "";
  selectedTreatmentforDraw:any = {} as Drawing;
  dentaldrawingsubscription:any = null;
  teethalphabet:boolean = false;
  
  constructor(private location: Location,private _elementRef : ElementRef,private _cd: ChangeDetectorRef, private sidewindowstate:SideWindowState, private dentaldrawing:DentalDrawingSelectionService) {
    const state:any = this.location.getState() as DentalState;
    if (state && state.dentalformat){
        this.dentalformat = JSON.parse(state.dentalformat);
    }   
    if (state && state.dentalcategoryformat){
        this.dentalcategoryformat = JSON.parse(state.dentalcategoryformat);
    }
    this.sidewindowstate.isOpen$.subscribe(state => {
        this.expandtheChart = state;
    });
    this.sidewindowstate.selectedoptions$.subscribe(state => {
        this.chipsbutton = state;
    });  
    this.sidewindowstate.teethalphabet$.subscribe(state => {
        this.teethalphabet = state;
    });      
  }  

  ngOnInit(): void {
    // Subscribe to the observable to get updates
    this.dentaldrawingsubscription = this.dentaldrawing.dentaldrawing$.subscribe(newValue => {
        this.selectedTreatmentforDraw = newValue;
    });
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    if (this.dentaldrawingsubscription) {
        this.dentaldrawingsubscription.unsubscribe();
    }
  } 
  
  getsvgtop(){
    return `${this._elementRef.nativeElement.querySelector("#dentalchartholder").offsetHeight + 20}px`;
  }

  getChipsButtonState(chipSelected:string){
    if (chipSelected === "All"){
        return true;
    }
    if (this.sidewindowstate.getOptionsSelected()){
        return this.sidewindowstate.getOptionsSelected().indexOf(chipSelected+",") > -1?true:false;  
    }else{
        return false;
    }    
  }

  getSideWindowView(){
    return this.sidewindowstate.getSideWindowState();
  }

  dentalFormatMainkeys(): Array<string> { 
    return Object.keys(this.dentalformat); 
  }  
  
  dentalFormatMainkeyValues(key:string):Diagram{
     return this.dentalformat[key]
  }

  viewbox(width:number,height:number):string{
      return `0 0 ${width} ${height}`
  }

  gridTemplateColumns(columns:number): string {
    return `repeat(${columns}, 1fr)`;
  }

  getPathdata(keys:string,subkeys:string){
    return this.dentalformat[keys].block[subkeys].path;
  }

  getPointPathdata(keys:string,subkeys:string){
    return this.dentalformat[keys].block[subkeys].click.path;
  }

  getBlock(keys:string):Array<string>{
    return Object.keys(this.dentalformat[keys].block); 
  }

  clickedPoint(event:any,click:object,mainindex:number,subindex:number,keys:string,subkeys:string,id:string){
     if (!this.jsonselections[keys]){
         this.jsonselections[keys] = {};
     }
     if (!this.jsonselections[keys][subkeys]){
         this.jsonselections[keys][subkeys] = {}
     }
     if (!this.jsonselections[keys][subkeys].points){        
         this.jsonselections[keys][subkeys].points = [];
     }   
     let svg = this._elementRef.nativeElement.querySelector(`#${id}_${mainindex}_${subindex}`).parentNode;
     let point = svg.createSVGPoint();
     point.x = event.clientX;
     point.y = event.clientY;
     var currentposition =  point.matrixTransform(svg.getScreenCTM().inverse());
     this.jsonselections[keys][subkeys].points.push({x:currentposition.x,y:currentposition.y})
     this._cd.markForCheck();
  }

  HoverPointEntry(event:object,mainindex:number,subindex:number,id:string,color:string,click:any){


  }


  
  HoverPointExit(event:object,mainindex:number,subindex:number,id:string,color:string,click:any){
  }


  HoverEntry(event:object,mainindex:number,subindex:number,id:string,color:string,click:any,noclick:boolean){
    if (Number(this._elementRef.nativeElement.querySelector(`#${id}_${mainindex}_${subindex}`).getAttribute("selected")) > 0){
        this._elementRef.nativeElement.querySelector(`#${id}_${mainindex}_${subindex}`).classList.add("removeicon");
    }    
  //  if (this._elementRef.nativeElement.querySelector(`#${id}_${mainindex}_${subindex}`).getAttribute("rel") === "addedshape"){
  //      this._elementRef.nativeElement.querySelector(`#${id}_${mainindex}_${subindex}`).classList.add("removeicon");
  //  }
    return;
    if (noclick){
        return;
    }    
    if (Object.keys(click).length > 0){
        return;
    }
    this._elementRef.nativeElement.querySelector(`#${id}_${mainindex}_${subindex}`).setAttribute("cursor","pointer");    
    if (Number(this._elementRef.nativeElement.querySelector(`#${id}_${mainindex}_${subindex}`).getAttribute("selected")) > 0){
        return;
    }         
    this._elementRef.nativeElement.querySelector(`#${id}_${mainindex}_${subindex}`).setAttribute("fill",color);    
  }

  HoverExit(event:object,mainindex:number,subindex:number,id:string,color:string,click:any,noclick:boolean){
    this._elementRef.nativeElement.querySelector(`#${id}_${mainindex}_${subindex}`).classList.remove("removeicon");
  //  if (this._elementRef.nativeElement.querySelector(`#${id}_${mainindex}_${subindex}`).getAttribute("rel") === "addedshape"){
  //      this._elementRef.nativeElement.querySelector(`#${id}_${mainindex}_${subindex}`).classList.remove("removeicon");
 //   }    
    return;
    if (noclick){
        return;
    }    
    if (Object.keys(click).length > 0){
        return;
    }    
    this._elementRef.nativeElement.querySelector(`#${id}_${mainindex}_${subindex}`).setAttribute("cursor","default");        
    if (Number(this._elementRef.nativeElement.querySelector(`#${id}_${mainindex}_${subindex}`).getAttribute("selected")) > 0){
        return;
    }    
    this._elementRef.nativeElement.querySelector(`#${id}_${mainindex}_${subindex}`).setAttribute("fill","none");     
  }

  filltheDiagram(obj:any,active:number){
    if (active){
        obj.setAttribute("fill",this.selectedTreatmentforDraw && this.selectedTreatmentforDraw?.drawing && this.selectedTreatmentforDraw?.drawing?.fill);
    }else{
        obj.setAttribute("fill","none");
    }    
  }

  drawtheEllipse(obj:any,active:number){
     if (active){
         let viewbox = obj.parentNode.parentNode.getAttribute("viewBox");
         let left = Number(viewbox.split(" ")[0]) //+0.5;
         let top = Number(viewbox.split(" ")[1]) //+0.5;
         let width = Number(viewbox.split(" ")[2]) - 10 //-19.5;
         let height = Number(viewbox.split(" ")[3]) - 10 //-19.5; 
         let widthp = Number(obj.parentNode.parentNode.getAttribute("width").split("%")[0]);
         let heightp = Number(obj.parentNode.parentNode.getAttribute("height").split("%")[0]);
         width = width  * (widthp/100);
         height = height  * (heightp/100);
         left += (width/2) + 1;
         top += (height/2) + 4;
         let g = d3.select(obj.parentNode.parentNode).append("g")
           .attr("id",`${this.selectedTreatmentforDraw && this.selectedTreatmentforDraw.base}_${this.selectedTreatmentforDraw && this.selectedTreatmentforDraw.id}`)
         g  
           .append("ellipse")
           .attr("rx",width/2)
           .attr("ry",height/2)
           .attr("cx",left)
           .attr("cy",top)
           .attr("fill",this.selectedTreatmentforDraw && this.selectedTreatmentforDraw?.drawing && this.selectedTreatmentforDraw?.drawing?.fill)
           .attr("stroke",this.selectedTreatmentforDraw && this.selectedTreatmentforDraw?.drawing && this.selectedTreatmentforDraw?.drawing?.stroke)     
           .attr("stroke-width",this.selectedTreatmentforDraw && this.selectedTreatmentforDraw?.drawing && this.selectedTreatmentforDraw?.drawing?.strokewidth)
           .attr("rel","addedshapes")
           .on("mouseover",(event:any)=>{
                event?.preventDefault();
                event?.stopPropagation();            
                this._elementRef.nativeElement.querySelector(`[id="${this.selectedTreatmentforDraw && this.selectedTreatmentforDraw.base}_${this.selectedTreatmentforDraw &&  this.selectedTreatmentforDraw.id}"]`).classList.add("removeicon");
           })
           .on("mouseout",(event:any)=>{
                event?.preventDefault();
                event?.stopPropagation();
                this._elementRef.nativeElement.querySelector(`[id="${this.selectedTreatmentforDraw && this.selectedTreatmentforDraw.base}_${this.selectedTreatmentforDraw && this.selectedTreatmentforDraw.id}"]`).classList.remove("removeicon");
           })
           .on("click",(e)=>{     
                d3.select(obj.parentNode.parentNode)
                  .select(`[id="${this.selectedTreatmentforDraw && this.selectedTreatmentforDraw.base}_${this.selectedTreatmentforDraw && this.selectedTreatmentforDraw.id}"]`)
                  .remove()         
           }); 
        if (this.selectedTreatmentforDraw && this.selectedTreatmentforDraw?.drawing && this.selectedTreatmentforDraw?.drawing.text && this.selectedTreatmentforDraw?.drawing.text.name){
            let text = g
              .append("text")
              .text(this.selectedTreatmentforDraw?.drawing.text.name)
              .attr("fill",this.selectedTreatmentforDraw?.drawing.text.fill?this.selectedTreatmentforDraw?.drawing.text.fill:"mone")
              .attr("stroke",this.selectedTreatmentforDraw?.drawing.text.stroke?this.selectedTreatmentforDraw?.drawing.text.stroke:"none")
              .style("font",this.selectedTreatmentforDraw?.drawing.text.font?this.selectedTreatmentforDraw?.drawing.text.font:undefined)
            
            let bbox:any = text.node()?.getBBox();
            let twidth = (width/2) - (bbox.width/2);
            let theight = (height/2)+5;
            text.attr("dx",this.selectedTreatmentforDraw?.drawing.text.dx?Number(this.selectedTreatmentforDraw?.drawing.text.dx)+twidth:twidth)
                .attr("dy",this.selectedTreatmentforDraw?.drawing.text.dy?Number(this.selectedTreatmentforDraw?.drawing.text.dy)+theight:theight)
           }
     }else{
        d3.select(obj.parentNode.parentNode)
          .select(`[id="${this.selectedTreatmentforDraw && this.selectedTreatmentforDraw.base}_${this.selectedTreatmentforDraw && this.selectedTreatmentforDraw.id}"]`)
          .remove()
     }      
  }


  drawtheRectangle(event:any,obj:any,active:number){
    if (active){
        let width = Number(this.selectedTreatmentforDraw && this.selectedTreatmentforDraw.drawing && this.selectedTreatmentforDraw.drawing.width);
        let height = Number(this.selectedTreatmentforDraw && this.selectedTreatmentforDraw.drawing && this.selectedTreatmentforDraw.drawing.height);
        let x = Number(d3.pointer(event)[0]);
        let y = Number(d3.pointer(event)[1]);  
        d3.select(obj.parentNode.parentNode).append("g")
           .attr("id",`${this.selectedTreatmentforDraw && this.selectedTreatmentforDraw.base}_${this.selectedTreatmentforDraw && this.selectedTreatmentforDraw.id}`)
           .append("rect")
           .attr("x",x)
           .attr("y",y)
           .attr("width",width)
           .attr("height",height)
           .attr("fill",this.selectedTreatmentforDraw && this.selectedTreatmentforDraw?.drawing && this.selectedTreatmentforDraw?.drawing?.fill)
           .attr("stroke",this.selectedTreatmentforDraw && this.selectedTreatmentforDraw?.drawing && this.selectedTreatmentforDraw?.drawing?.stroke)     
           .attr("stroke-width",this.selectedTreatmentforDraw && this.selectedTreatmentforDraw?.drawing && this.selectedTreatmentforDraw?.drawing?.strokewidth)
           .attr("rel","addedshapes")
           .on("mouseover",(event:any)=>{
                event?.preventDefault();
                event?.stopPropagation();            
                this._elementRef.nativeElement.querySelector(`[id="${this.selectedTreatmentforDraw && this.selectedTreatmentforDraw.base}_${this.selectedTreatmentforDraw &&  this.selectedTreatmentforDraw.id}"]`).classList.add("removeicon");
           })
           .on("mouseout",(event:any)=>{
                event?.preventDefault();
                event?.stopPropagation();
                this._elementRef.nativeElement.querySelector(`[id="${this.selectedTreatmentforDraw && this.selectedTreatmentforDraw.base}_${this.selectedTreatmentforDraw && this.selectedTreatmentforDraw.id}"]`).classList.remove("removeicon");
           })
           .on("click",(e)=>{     
                d3.select(obj.parentNode.parentNode)
                  .select(`[id="${this.selectedTreatmentforDraw && this.selectedTreatmentforDraw.base}_${this.selectedTreatmentforDraw && this.selectedTreatmentforDraw.id}"]`)
                  .remove()         
           });
     }else{
        d3.select(obj.parentNode.parentNode)
          .select(`[id="${this.selectedTreatmentforDraw && this.selectedTreatmentforDraw.base}_${this.selectedTreatmentforDraw && this.selectedTreatmentforDraw.id}"]`)
          .remove()
     }               
  }

  ClickDiagram(event:object,mainindex:number,subindex:number,id:string,color:string,click:any,keys:string,subkeys:string,noclick:boolean){
    if (noclick){
        return;
    }
    if (Object.keys(click.click).length > 0){
        this.clickedpart = click;
        this.clickedPoint(event,click,mainindex,subindex,keys,subkeys,id);
        return;
    }  
    if (Object.keys(this.selectedTreatmentforDraw).length === 0){
        return;
    }
    if (!Object.keys(this.selectedTreatmentforDraw).includes("drawing")){
       return;
    }
    if (Number(this._elementRef.nativeElement.querySelector(`#${id}_${mainindex}_${subindex}`).getAttribute("selected")) > 0){
        if (!this.jsonselections[mainindex]){
            this.jsonselections[mainindex] = {}
        }
        if (!this.jsonselections[mainindex][subindex]){    
            this.jsonselections[mainindex][subindex] = {};
        }
        this.jsonselections[mainindex][subindex].selected = false; 
        this.jsonselections[mainindex][subindex].id = '';
        let type = (this.selectedTreatmentforDraw && this.selectedTreatmentforDraw?.drawing && this.selectedTreatmentforDraw?.drawing?.type);
        this._elementRef.nativeElement.querySelector(`#${id}_${mainindex}_${subindex}`).setAttribute("selected","0");
        switch (type) {
            case "fill":
                  this.filltheDiagram(this._elementRef.nativeElement.querySelector(`#${id}_${mainindex}_${subindex}`),0);
                  break;
            case "ellipse":
                  this.drawtheEllipse(this._elementRef.nativeElement.querySelector(`#${id}_${mainindex}_${subindex}`),0);
                  break;
            case "rectangle":
                  this.drawtheRectangle(event,this._elementRef.nativeElement.querySelector(`#${id}_${mainindex}_${subindex}`),0);
                  break;
            default:
                 break;
        }                         
      //  this._elementRef.nativeElement.querySelector(`#${id}_${mainindex}_${subindex}`).setAttribute("fill","none");
        return;       
    }
    if (!this.jsonselections[mainindex]){
        this.jsonselections[mainindex] = {}
    }
    if (!this.jsonselections[mainindex][subindex]){    
        this.jsonselections[mainindex][subindex] = {};
    }
    this.jsonselections[mainindex][subindex].selected = true;    
    this.jsonselections[mainindex][subindex].id = id;
    let type = (this.selectedTreatmentforDraw && this.selectedTreatmentforDraw?.drawing && this.selectedTreatmentforDraw?.drawing?.type);
    if (type === "fill"){
        this._elementRef.nativeElement.querySelector(`#${id}_${mainindex}_${subindex}`).setAttribute("selected","1");
    }    
    switch (type) {
        case "fill": 
              this.filltheDiagram(this._elementRef.nativeElement.querySelector(`#${id}_${mainindex}_${subindex}`),1);
              break;
        case "ellipse":
              this.drawtheEllipse(this._elementRef.nativeElement.querySelector(`#${id}_${mainindex}_${subindex}`),1);
              break;
        case "rectangle":
              this.drawtheRectangle(event,this._elementRef.nativeElement.querySelector(`#${id}_${mainindex}_${subindex}`),1);
              break;
        default:
             break;
    }        
//    this._elementRef.nativeElement.querySelector(`#${id}_${mainindex}_${subindex}`).setAttribute("fill",this.selectedTreatmentforDraw && this.selectedTreatmentforDraw?.drawing && this.selectedTreatmentforDraw?.drawing?.fill);     
  }


  get getFirstKeyNumberofColumn():number{
      if (!this.dentalformat){
          return 0;
      }
      if (Object.keys(this.dentalformat).length === 0){
          return 0;
      }
      return this.dentalformat[Object.keys(this.dentalformat)[0]].maxcolumsinarow;
  }
} 