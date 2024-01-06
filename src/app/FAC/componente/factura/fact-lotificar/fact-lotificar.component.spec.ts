import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FactLotificarComponent } from './fact-lotificar.component';

describe('FactLotificarComponent', () => {
  let component: FactLotificarComponent;
  let fixture: ComponentFixture<FactLotificarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FactLotificarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FactLotificarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
