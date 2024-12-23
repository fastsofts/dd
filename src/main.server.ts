import { bootstrapApplication } from '@angular/platform-browser';
import { MainComponent } from './app/mainComponent';
import { config } from './app/app.config.server';

const bootstrap = () => bootstrapApplication(MainComponent, config);

export default bootstrap;
