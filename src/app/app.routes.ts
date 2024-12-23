import { Routes } from '@angular/router';
import {MainComponent} from './mainComponent'
import {DentalChart} from './DentalChart/DentalChart';


export const routes: Routes = [
    { path: '', component: MainComponent },
    { path: 'dentalchart', component: DentalChart },
];


