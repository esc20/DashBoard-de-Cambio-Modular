import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importante para o [class.aberto]

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule], // Adicione o CommonModule aqui
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  // Cria o Signal para controlar a visibilidade da busca
  exibirBusca = signal(false);

  alternarBusca() {
    this.exibirBusca.update(valor => !valor);
  }
}