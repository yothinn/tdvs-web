import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinechatPanelComponent } from './linechat-panel.component';

describe('LinechatPanelComponent', () => {
  let component: LinechatPanelComponent;
  let fixture: ComponentFixture<LinechatPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinechatPanelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinechatPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
