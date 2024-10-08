import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentaPorLineaNegocioComponent } from './venta-por-linea-negocio.component';

describe('VentaPorLineaNegocioComponent', () => {
  let component: VentaPorLineaNegocioComponent;
  let fixture: ComponentFixture<VentaPorLineaNegocioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VentaPorLineaNegocioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VentaPorLineaNegocioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
