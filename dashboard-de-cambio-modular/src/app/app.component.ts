import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { ContentComponent } from './components/content/content.component';
import { CardComponent } from './components/card/card.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, ContentComponent, CardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  
}
