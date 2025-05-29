import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNewExerciseComponent } from './admin-new-exercise.component';

describe('AdminNewExerciseComponent', () => {
  let component: AdminNewExerciseComponent;
  let fixture: ComponentFixture<AdminNewExerciseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminNewExerciseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminNewExerciseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
