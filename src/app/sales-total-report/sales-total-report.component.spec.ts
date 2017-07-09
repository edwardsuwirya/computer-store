import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesTotalReportComponent } from './sales-total-report.component';

describe('SalesTotalReportComponent', () => {
  let component: SalesTotalReportComponent;
  let fixture: ComponentFixture<SalesTotalReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesTotalReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesTotalReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
