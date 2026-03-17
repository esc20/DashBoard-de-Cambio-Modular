import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardsMundiComponent } from './cards-mundi.component';

describe('CardsMundiComponent', () => {
  let component: CardsMundiComponent;
  let fixture: ComponentFixture<CardsMundiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardsMundiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardsMundiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
