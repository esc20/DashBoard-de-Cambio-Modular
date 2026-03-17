import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cards-mundi',
  imports: [],
  templateUrl: './cards-mundi.component.html',
  styleUrl: './cards-mundi.component.scss'
})
export class CardsMundiComponent {
@Input() titulocard: string = ''; 
}
