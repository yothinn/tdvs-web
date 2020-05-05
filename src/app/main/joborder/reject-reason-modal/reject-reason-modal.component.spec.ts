import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectReasonModalComponent } from './reject-reason-modal.component';

describe('RejectReasonModalComponent', () => {
  let component: RejectReasonModalComponent;
  let fixture: ComponentFixture<RejectReasonModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RejectReasonModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RejectReasonModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
