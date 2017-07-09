import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverdueReportComponent } from './overdue-report.component';

describe('OverdueReportComponent', () => {
  let component: OverdueReportComponent;
  let fixture: ComponentFixture<OverdueReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverdueReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverdueReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
