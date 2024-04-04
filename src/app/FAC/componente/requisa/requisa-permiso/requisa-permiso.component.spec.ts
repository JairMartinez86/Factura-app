import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequisaPermisoComponent } from './requisa-permiso.component';

describe('RequisaPermisoComponent', () => {
  let component: RequisaPermisoComponent;
  let fixture: ComponentFixture<RequisaPermisoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequisaPermisoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RequisaPermisoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
