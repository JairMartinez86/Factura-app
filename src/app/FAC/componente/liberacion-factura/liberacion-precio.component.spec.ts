import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiberacionPrecioComponent } from './liberacion-precio.component';

describe('LiberacionFacturaComponent', () => {
  let component: LiberacionPrecioComponent;
  let fixture: ComponentFixture<LiberacionPrecioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiberacionPrecioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LiberacionPrecioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
