import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CicloDeJurosComponent } from './ciclo-de-juros.component';

describe('CicloDeJurosComponent', () => {
  let component: CicloDeJurosComponent;
  let fixture: ComponentFixture<CicloDeJurosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CicloDeJurosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CicloDeJurosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
