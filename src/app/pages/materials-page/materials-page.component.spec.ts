import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialsPageComponent } from './materials-page.component';

describe('MaterialsPageComponent', () => {
  let component: MaterialsPageComponent;
  let fixture: ComponentFixture<MaterialsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MaterialsPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MaterialsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
