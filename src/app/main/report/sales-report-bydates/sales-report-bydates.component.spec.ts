import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesReportBydatesComponent } from './sales-report-bydates.component';

describe('SalesReportBydatesComponent', () => {
  let component: SalesReportBydatesComponent;
  let fixture: ComponentFixture<SalesReportBydatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesReportBydatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesReportBydatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
