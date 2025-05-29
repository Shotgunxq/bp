import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentovoComponent } from './studentovo.component';

describe('StudentovoComponent', () => {
  let component: StudentovoComponent;
  let fixture: ComponentFixture<StudentovoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentovoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentovoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
