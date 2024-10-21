import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarChatsComponent } from './sidebar-charts.component';

describe('SidebarChatsComponent', () => {
  let component: SidebarChatsComponent;
  let fixture: ComponentFixture<SidebarChatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarChatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarChatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
