import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobordersuggestionComponent } from './jobordersuggestion.component';

describe('JobordersuggestionComponent', () => {
  let component: JobordersuggestionComponent;
  let fixture: ComponentFixture<JobordersuggestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobordersuggestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobordersuggestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
