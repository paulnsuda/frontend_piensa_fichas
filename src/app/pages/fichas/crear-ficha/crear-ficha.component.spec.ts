import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearFichaComponent } from './crear-ficha.component';

describe('CrearFichaComponent', () => {
  let component: CrearFichaComponent;
  let fixture: ComponentFixture<CrearFichaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearFichaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearFichaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
