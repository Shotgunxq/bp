import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminStatsTableComponent } from './admin-stats-table.component';

describe('AdminStatsTableComponent', () => {
  let component: AdminStatsTableComponent;
  let fixture: ComponentFixture<AdminStatsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminStatsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminStatsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
