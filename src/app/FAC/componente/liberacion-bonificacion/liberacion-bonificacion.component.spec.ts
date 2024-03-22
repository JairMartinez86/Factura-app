import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiberacionBonificacionComponent } from './liberacion-bonificacion.component';

describe('LiberacionBonificacionComponent', () => {
  let component: LiberacionBonificacionComponent;
  let fixture: ComponentFixture<LiberacionBonificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiberacionBonificacionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LiberacionBonificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
