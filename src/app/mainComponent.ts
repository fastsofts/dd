import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DentalDataService } from './dataService/dentalData.service';
import { DentalFormat } from './dataService/dentalFormat.model';
import { DentalCategoryFormat } from './dataService/dentalCategoryFormat.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './mainComponent.html',
  styleUrl: './mainComponent.scss',
  providers: [DentalDataService]
})
export class MainComponent {
  dentalFormat: DentalFormat | undefined; 
  dentalCategoryFormat:DentalCategoryFormat | undefined;

  constructor(private dentalDataService:  DentalDataService,private router: Router) { }  

  ngOnInit() {
    this.dentalDataService.getDentalFormats().subscribe({
      next: (data) => {
        this.dentalFormat = data;
      },
      error: (error) => {
        console.error('Error:', error);
      },
      complete: () => {
        let root:any = this;
        this.dentalDataService.getDentalCategories().subscribe({  
            next: (data) => {
              this.dentalCategoryFormat = data;
            },
            error: (error) => {
              console.error('Error:', error);
            },    
            complete: () => {                        
               this.router.navigate(['/dentalchart'], { state: { dentalformat: JSON.stringify(this.dentalFormat), dentalcategoryformat: JSON.stringify(this.dentalCategoryFormat) } });
            }   
        });    
      }
    });   
  }
}
