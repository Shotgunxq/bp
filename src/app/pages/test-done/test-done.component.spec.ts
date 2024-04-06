import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestDoneComponent } from './test-done.component';

describe('TestDoneComponent', () => {
  let component: TestDoneComponent;
  let fixture: ComponentFixture<TestDoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestDoneComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestDoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
