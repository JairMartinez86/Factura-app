import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequisaAutorizaComponent } from './requisa-autoriza.component';

describe('RequisaAutorizaComponent', () => {
  let component: RequisaAutorizaComponent;
  let fixture: ComponentFixture<RequisaAutorizaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequisaAutorizaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RequisaAutorizaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
