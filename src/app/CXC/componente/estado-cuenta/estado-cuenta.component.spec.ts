import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoCuentaComponent } from './estado-cuenta.component';

describe('EstadoCuentaComponent', () => {
  let component: EstadoCuentaComponent;
  let fixture: ComponentFixture<EstadoCuentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstadoCuentaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstadoCuentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
