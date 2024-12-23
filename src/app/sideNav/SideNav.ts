import { Component,ElementRef,ChangeDetectionStrategy,ChangeDetectorRef, ViewChild,Renderer2,Input,SimpleChanges} from '@angular/core';
import { MatInputModule } from "@angular/material/input"; 
import { MatChipsModule } from "@angular/material/chips"; 
import { MatIconModule } from '@angular/material/icon'; 
import { ThemePalette } from '@angular/material/core';  
import { CommonModule } from '@angular/common';
import { MatMenuTrigger } from '@angular/material/menu';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { SideWindowState} from '../sideWindowState/sideWindow.service';
import {MatTabsModule} from '@angular/material/tabs';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatSelectModule,MatSelectChange} from '@angular/material/select';
import { Subject } from 'rxjs';
import {DentalDrawingSelectionService} from '../dataService/dentalDrawingSelection.service';
import {MatCheckboxModule,MatCheckboxChange} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';

import {
    trigger,
    state,
    style,
    animate,
    transition
  } from '@angular/animations';


export interface chartRowsSelection { 
    name: string; 
    color: ThemePalette; 
    selected:boolean;
    alphabet:boolean;
} 

@Component({
    selector: 'Sidenav',
    templateUrl: './SideNav.html',
    styleUrl: './SideNav.scss',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports:[MatChipsModule,MatIconModule,CommonModule,MatTabsModule,MatButtonModule,MatDividerModule,MatInputModule,MatFormFieldModule,FormsModule,MatSelectModule,MatCheckboxModule,MatRadioModule], 
})

export class SideNav {
    dentalGroups: chartRowsSelection[] = [ 
        { name: 'PD', color: 'primary',selected:true,alphabet:false }, 
        { name: 'PTD', color: 'primary',selected:true,alphabet:false }, 
        { name: 'DD', color: 'primary',selected:true,alphabet:true }, 
        { name: 'DTD', color: 'primary',selected:true,alphabet:true }, 
    ];   
    @Input() categories:any;
    @Input() listcategories:any;
    

    clonecategories:any = [];
    clonelistcategories:any = [];
    isOpen = false;
    isNewOpen = false;
    isSortOpen=false;
    isSideWindowOpen=true;
    selectedcategory:any = null;
    selectedlistcategory:any = null;
    items = ['Option 1', 'Option 2', 'Option 3'];
    sortItems = [{"name":"Sort by Code","isselected":true},{"name":"Sort by Nomenclature","isselected":false}];
    ArrowDropUpIcon = '<svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 0 24 24" width="40px" fill="#5f6368"><path d="M0 0h24v24H0z" fill="none"/><path d="M7 14l5-5 5 5z"/></svg>';
    ArrowDropDownIcon = '<svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 0 24 24" width="40px" fill="#5f6368"><path d="M0 0h24v24H0z" fill="none"/><path d="M7 10l5 5 5-5z"/></svg>';
    CollapseSideWindowIcon = '<svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg" class="tw-w-5"><path fill-rule="evenodd" clip-rule="evenodd" d="M1 0a1 1 0 011 1v12a1 1 0 11-2 0V1a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L7.414 6H15a1 1 0 110 2H7.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" fill="currentColor"></path></svg>';
    ExpandSideWindowIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 14" height="14" width="16" class="tw-w-5"><path fill-rule="evenodd" clip-rule="evenodd" d="M15 14a1 1 0 01-1-1V1a1 1 0 112 0v12a1 1 0 01-1 1zm-7.707-3.293a1 1 0 010-1.414L8.586 8H1a1 1 0 110-2h7.586L7.293 4.707a1 1 0 011.414-1.414l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414 0z" fill="currentColor" xmlns="http://www.w3.org/2000/svg"></path></svg>';
    StarPlainIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" stroke-width="1.5" fill="none" stroke="#000000"><g transform="scale(.8)"><path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"></path></g></svg>';
    StarIconFilled = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" stroke-width="1.5" fill="#F9CC80" stroke="#F9CC80"><g transform="scale(.8)"><path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"></path></g></svg>';
    SortIcon = '<svg transform="scale(.8)" xmlns="http://www.w3.org/2000/svg" height="30" viewBox="0 0 20 20" fill="currentColor"><path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zm0 4a1 1 0 000 2h7a1 1 0 100-2H3zm0 4a1 1 0 100 2h4a1 1 0 100-2H3zm12-3a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z"></path></svg>';
    SortFilledIcon = '<svg transform="scale(.8)" xmlns="http://www.w3.org/2000/svg" height="30" viewBox="0 0 20 20" fill="white"><path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zm0 4a1 1 0 000 2h7a1 1 0 100-2H3zm0 4a1 1 0 100 2h4a1 1 0 100-2H3zm12-3a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z"></path></svg>';
    PersonalIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="currentColor" class="tw-w-5 tw-ml-1" data-test-label="user-svg-icon"><path fill-rule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clip-rule="evenodd"></path></svg>';
    SharedIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="currentColor" class="tw-w-5 tw-ml-1" data-test-label="practice-group-svg-icon"><path fill-rule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zm7.5 3a3 3 0 116 0 3 3 0 01-6 0zm-13.5 0a3 3 0 116 0 3 3 0 01-6 0zm4.06 5.367A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75a12.69 12.69 0 01-6.337-1.684.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z" clip-rule="evenodd"></path><path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zm15.144 5.135a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z"></path></svg>';
    selectedItem: string | null = null;
    sortselected = "Sort by Code";
    isfiltered = false;
    searchvalue:string = ""

    downArrow: SafeHtml;
    upArrow:SafeHtml;
    openSideWindow:SafeHtml;
    closeSideWindow:SafeHtml;
    starIcon:SafeHtml;
    starFilledIcon:SafeHtml;
    sortIcon:SafeHtml;
    sortFilledIcon:SafeHtml;
    personalIcon:SafeHtml;
    sharedIcon:SafeHtml;

    treatments:any[]=[];
    treatmentsclone:any[]=[];
    selectedfavourites:string[] = [];
    public observeTreatment = new Subject<boolean>();
    public observeTreatmentReset = new Subject<boolean>();
    setfavourite = false;
    isfavouritechecked = false;
    Teethalphabets = false;

    constructor(private sanitizer: DomSanitizer,private sidewindowstate: SideWindowState,private renderer: Renderer2, private dentaldrawing:DentalDrawingSelectionService) {
       this.downArrow = this.sanitizer.bypassSecurityTrustHtml(this.ArrowDropDownIcon);
       this.upArrow = this.sanitizer.bypassSecurityTrustHtml(this.ArrowDropUpIcon);
       this.openSideWindow = this.sanitizer.bypassSecurityTrustHtml(this.ExpandSideWindowIcon);
       this.closeSideWindow = this.sanitizer.bypassSecurityTrustHtml(this.CollapseSideWindowIcon);
       this.starIcon = this.sanitizer.bypassSecurityTrustHtml(this.StarPlainIcon);
       this.starFilledIcon = this.sanitizer.bypassSecurityTrustHtml(this.StarIconFilled);
       this.sortIcon = this.sanitizer.bypassSecurityTrustHtml(this.SortIcon);
       this.sortFilledIcon = this.sanitizer.bypassSecurityTrustHtml(this.SortFilledIcon);
       this.personalIcon = this.sanitizer.bypassSecurityTrustHtml(this.PersonalIcon);
       this.sharedIcon = this.sanitizer.bypassSecurityTrustHtml(this.SharedIcon);
       this.sidewindowstate.isOpen$.subscribe(state => this.isOpen = state);
       this.dentalGroups.forEach((dgroup:any)=>{
          if (dgroup.selected){
              this.selectedGroups.add(dgroup);
          }
       });
       const groups: string[] = Array.from(this.selectedGroups);
       let grp:string = "";
       groups.forEach((group:any)=>{
           grp += group.name+",";
       });    
       this.sidewindowstate.setOptionsSelected(grp);   
       this.observeTreatment.subscribe((val:any) => {
           this.treatments.push(val);
           this.treatmentsclone.push(val);   
       }) 
       this.observeTreatmentReset.subscribe((val:any) => {
          this.treatments = [];
          this.treatmentsclone = [];
       });
    }

    tabclicked(event:any){
        if (event.tab.textLabel === "Treatment List"){
            this.isNewOpen = false;  
        }
    }

    dentalCategoryFormatMainkeys(){
        return this.clonecategories;
    }

    setfavouriteoption(event:MatCheckboxChange){
        if (event.source.checked){
            this.isfavouritechecked = event.source.checked;
            if (this.isfiltered){
                let filtered = this.treatments.filter((treatment:any)=>treatment.name.toLowerCase().indexOf(this.searchvalue.toLowerCase()) > -1);
                this.treatments = filtered;
            }            
            let favchecked:any = [];
            let favnotchecked:any = [];
            this.treatments.forEach((treatment:any)=>{
                if (this.selectedfavourites.includes(treatment.id)){
                    favchecked.push(treatment);
                }else{
                    favnotchecked.push(treatment);
                }
            });
            this.treatments = [];
            this.treatments = this.treatments.concat(favchecked);
            this.treatments = this.treatments.concat(favnotchecked); 
        }else{
            this.isfavouritechecked = false;
            if (this.isfiltered){
                let filtered = this.treatments.filter((treatment:any)=>treatment.name.toLowerCase().indexOf(this.searchvalue.toLowerCase()) > -1);
                this.treatments = filtered;
            }               
            this.sortItems.forEach((selected:any)=>{
               if (selected.isselected){
                   if (selected.name.toLowerCase() === "Sort by Code".toLowerCase()){
                        this.treatments = this.treatments.sort((a,b)=>{
                            if (a.id > b.id){
                                return 1
                            }
                            return -1;
                        })                    
                    }
                    if (selected.name.toLowerCase() === "Sort by Nomenclature".toLowerCase()){
                        this.treatments = this.treatments.sort((a,b)=>{
                            if (a.name > b.name){
                                return 1
                            }
                            return -1;
                        })
                    }
               }
            });             
        }
    };

    TriggerSelectedCategory(){
        if (!this.selectedcategory){
            return;
        }
        if (this.selectedcategory.toUpperCase() === "ALL"){
            this.observeTreatmentReset.next(false);
            Object.keys(this.categories).forEach((category:string) => {
                this.categories[category].forEach((categoryrow:any)=>{
                   // this.treatments.push(categoryrow);
                   this.observeTreatment.next(categoryrow);
                });    
            });
        }else{
            this.observeTreatmentReset.next(false);
            this.categories[this.selectedcategory].forEach((category:any) => {
               // this.treatments.push(category);
               this.observeTreatment.next(category);               
            })            
        }         
    }

    selectedSort(event:any,name:string){
        if (this.isfiltered){
            let filtered = this.treatments.filter((treatment:any)=>treatment.name.toLowerCase().indexOf(this.searchvalue.toLowerCase()) > -1);
            this.treatments = filtered;
        }             
        this.sortItems.map((selected:any)=>{
            let select = selected;
            select.isselected = false;
            if (select.name.toLowerCase() === name.toLowerCase()){
                select.isselected = true;
                if (select.name.toLowerCase() === "Sort by Code".toLowerCase()){
                    this.treatments = this.treatments.sort((a,b)=>{
                        if (a.id > b.id){
                            return 1
                        }
                        return -1;
                    })                    
                }
                if (select.name.toLowerCase() === "Sort by Nomenclature".toLowerCase()){
                    this.treatments = this.treatments.sort((a,b)=>{
                        if (a.name > b.name){
                            return 1
                        }
                        return -1;
                    })
                }      
            }
            return select;            
        });
        if (this.isfavouritechecked){
            let favchecked:any = [];
            let favnotchecked:any = [];
            this.treatments.forEach((treatment:any)=>{
                if (this.selectedfavourites.includes(treatment.id)){
                    favchecked.push(treatment);
                }else{
                    favnotchecked.push(treatment);
                }
            });
            this.treatments = [];
            this.treatments = this.treatments.concat(favchecked);
            this.treatments = this.treatments.concat(favnotchecked); 
        }
    }

    selectedlistCategory(event: MatSelectChange){
        this.selectedlistcategory = event.value;
    }    

    selectedCategory(event: MatSelectChange){
        this.selectedcategory = event.value;
        if (this.selectedcategory.toUpperCase() == "FAVOURITES"){
            this.observeTreatmentReset.next(false);            
            Object.keys(this.categories).forEach((category:string) => {
                this.categories[category].forEach((categoryrow:any)=>{       
                   let treatmentfound = this.treatments.filter((treatment:any)=>treatment.id === categoryrow.id)          
                   if (this.selectedfavourites.includes(categoryrow.id) && treatmentfound.length === 0){
                   //    this.treatments.push(categoryrow);    
                       this.observeTreatment.next(categoryrow);                           
                   }  
                })
            });        
            return;
        }
        if (this.selectedcategory.toUpperCase() === "ALL"){
            this.observeTreatmentReset.next(false);
            Object.keys(this.categories).forEach((category:string) => {
                this.categories[category].forEach((categoryrow:any)=>{
                 //   this.treatments.push(categoryrow);
                   this.observeTreatment.next(categoryrow);
                });    
            });
        }else{
            this.observeTreatmentReset.next(false);
            this.categories[this.selectedcategory].forEach((category:any) => {
              //  this.treatments.push(category);
              this.observeTreatment.next(category);
            })            
        }    
    }


    addtoFavourites(event:any,id:string){
        event.stopPropagation();
        event.preventDefault();
        let filtereditem = this.selectedfavourites.filter((value)=>value === id);
        if (filtereditem.length > 0){
            event.target.setAttribute("selected","0");
            this.selectedfavourites = this.selectedfavourites.filter((value)=>value !== id);
            if (this.selectedcategory.toLowerCase() === "favourites"){
                this.treatments = this.treatments.filter((treatment:any)=>treatment.id !== id);
            }   
        }else{
            event.target.setAttribute("selected","1");       
            this.selectedfavourites.push(id);            
        }
    }

    selectTreatment(event:any,id:string){
       this.categories[this.selectedcategory].forEach((category:any)=>{
         if (category.id === id){
             this.dentaldrawing.setDrawing(category);
         }
       })
    }    

    getArrowIcon(){
        if (this.isOpen){
            return this.downArrow;
        }else{
            return this.upArrow;            
        }
    }

    getSideWindowActionIcon(){
        if (this.isSideWindowOpen){
             return this.openSideWindow;
        }else{
            return this.closeSideWindow;            
        }
    }

    categorysearch(event:any){        
        let filtered = Object.keys(this.categories).filter((option:any) => option.toLowerCase().includes(event.target.value.toLowerCase()));      
        this.clonecategories = filtered;
    }

    categorylistsearch(event:any){        
        let filtered = Object.keys(this.listcategories).filter((option:any) => option.toLowerCase().includes(event.target.value.toLowerCase()));
        this.clonelistcategories = filtered;
    }


    treatmentsearch(event:any){
        this.searchvalue = event.target.value;
        let filtered = this.treatmentsclone.filter((treatment:any)=>treatment.name.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1);
        this.isfiltered = true;
        this.treatments = filtered;
    }
  
    toggleDropdown(event:any) {
      this.isOpen = !this.isOpen;
    }

    toggleNewDropdown(event:any){
      this.isNewOpen = !this.isNewOpen;      
    }

    toggleSortDropdown(event:any) {
        this.isSortOpen = !this.isSortOpen;
    }

    toggleSideWindow(event:any) {
        this.isSideWindowOpen = !this.isSideWindowOpen;
        this.sidewindowstate.setSideWindowState(this.isSideWindowOpen);
        if (!this.isSideWindowOpen){
            this.isNewOpen = false;
        }
    }    
  
    selectItem(item: string) {
      this.selectedItem = item;
      this.isOpen = false; // Close the menu after selection
    }    


    selectedGroups = new Set<any>();

    isSelected(dgroup: any): boolean {
      return this.selectedGroups.has(dgroup);
    }
  
    toggleSelection(dgroup: any): void {
      if (this.isSelected(dgroup)) {
          this.selectedGroups.delete(dgroup);
      } else {
          this.selectedGroups.add(dgroup);
      }
      const groups: string[] = Array.from(this.selectedGroups);
      let grp:string = "";
      groups.forEach((group:any)=>{
          grp += group.name+",";
      });    
      this.sidewindowstate.setOptionsSelected(grp);  
      let thalpha = true;
      groups.forEach((group:any)=>{
        if (!group.alphabet){
            thalpha  = false;
        }
      });
      console.log(thalpha);
      this.Teethalphabets = thalpha;
      this.sidewindowstate.setOptionsTeethAlphabets(this.Teethalphabets);  
    }

    ngOnInit(){
 
    }

    ngOnChanges(){
        let ncategory:any = {};
        Object.keys(this.categories).forEach((category:any)=>{
          ncategory[category] = [];
          this.categories[category].forEach((sublevel:any)=>{
             let mcat:any = sublevel;
             mcat["base"] = category;  
             ncategory[category].push(mcat);
          });  
        });
        this.categories = ncategory;
        this.listcategories = ncategory;
        let catkeys = Object.keys(this.categories);
        catkeys.unshift("All");
        this.clonecategories = catkeys; 
        this.clonelistcategories = catkeys;
        this.selectedcategory = catkeys[2];
        this.TriggerSelectedCategory();
    }
}    