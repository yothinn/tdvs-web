import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoborderReportComponent } from './joborder-report.component';

describe('JoborderReportComponent', () => {
  let component: JoborderReportComponent;
  let fixture: ComponentFixture<JoborderReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoborderReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoborderReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
