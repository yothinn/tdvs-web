import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoborderDataComponent } from './joborder-data.component';

describe('JoborderDataComponent', () => {
  let component: JoborderDataComponent;
  let fixture: ComponentFixture<JoborderDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoborderDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoborderDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
