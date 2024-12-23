import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SideWindowState {
  private isOpenSubject = new BehaviorSubject<boolean>(true);
  private isSelectionsSubject = new BehaviorSubject<string>("");
  private TeethAlphabet = new BehaviorSubject<boolean>(false);
  isOpen$ = this.isOpenSubject.asObservable();
  selectedoptions$ = this.isSelectionsSubject.asObservable();
  teethalphabet$ = this.TeethAlphabet.asObservable();
  toggle() {
    this.isOpenSubject.next(!this.isOpenSubject.value);
  }

  setSideWindowState(isOpen: boolean) {
    this.isOpenSubject.next(isOpen);
  }

  getSideWindowState(): boolean {
    return this.isOpenSubject.value;
  }

  setOptionsSelected(selections:string){
    this.isSelectionsSubject.next(selections);
  }

  getOptionsSelected():string{
    return this.isSelectionsSubject.value;
  }

  setOptionsTeethAlphabets(Teethalphabet:boolean){
    this.TeethAlphabet.next(Teethalphabet);
  }
}
