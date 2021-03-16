import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinechatLoginDialogComponent } from './linechat-login-dialog.component';

describe('LinechatLoginDialogComponent', () => {
  let component: LinechatLoginDialogComponent;
  let fixture: ComponentFixture<LinechatLoginDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinechatLoginDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinechatLoginDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
