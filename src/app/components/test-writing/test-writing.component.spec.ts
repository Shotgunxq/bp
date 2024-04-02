import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestWritingComponent } from './test-writing.component';

describe('TestWritingComponent', () => {
  let component: TestWritingComponent;
  let fixture: ComponentFixture<TestWritingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestWritingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestWritingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
