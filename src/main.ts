import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig} from './app/app.config';
import { MainComponent } from './app/mainComponent';


bootstrapApplication(MainComponent, appConfig)
  .catch((err) => console.error(err));
