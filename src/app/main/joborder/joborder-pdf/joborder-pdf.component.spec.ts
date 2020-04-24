import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoborderPdfComponent } from './joborder-pdf.component';

describe('JoborderPdfComponent', () => {
  let component: JoborderPdfComponent;
  let fixture: ComponentFixture<JoborderPdfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoborderPdfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoborderPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
