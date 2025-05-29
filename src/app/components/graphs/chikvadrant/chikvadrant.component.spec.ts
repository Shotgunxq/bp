import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChikvadrantComponent } from './chikvadrant.component';

describe('ChikvadrantComponent', () => {
  let component: ChikvadrantComponent;
  let fixture: ComponentFixture<ChikvadrantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChikvadrantComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChikvadrantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
