import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCarAndDateComponent } from './select-car-and-date.component';

describe('SelectCarAndDateComponent', () => {
  let component: SelectCarAndDateComponent;
  let fixture: ComponentFixture<SelectCarAndDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectCarAndDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectCarAndDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
