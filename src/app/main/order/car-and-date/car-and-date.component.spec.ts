import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarAndDateComponent } from './car-and-date.component';

describe('CarAndDateComponent', () => {
  let component: CarAndDateComponent;
  let fixture: ComponentFixture<CarAndDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarAndDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarAndDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
