import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarFichasComponent } from './consultar-fichas.component';

describe('ConsultarFichasComponent', () => {
  let component: ConsultarFichasComponent;
  let fixture: ComponentFixture<ConsultarFichasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultarFichasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultarFichasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
