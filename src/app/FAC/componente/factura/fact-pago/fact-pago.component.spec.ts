import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactPagoComponent } from './fact-pago.component';

describe('FactPagoComponent', () => {
  let component: FactPagoComponent;
  let fixture: ComponentFixture<FactPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactPagoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FactPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
