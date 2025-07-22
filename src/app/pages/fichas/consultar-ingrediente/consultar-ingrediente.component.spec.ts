import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarIngredienteComponent } from './consultar-ingrediente.component';

describe('ConsultarIngredienteComponent', () => {
  let component: ConsultarIngredienteComponent;
  let fixture: ComponentFixture<ConsultarIngredienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultarIngredienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultarIngredienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
