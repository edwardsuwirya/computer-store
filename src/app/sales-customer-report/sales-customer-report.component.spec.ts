import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesCustomerReportComponent } from './sales-customer-report.component';

describe('SalesCustomerReportComponent', () => {
  let component: SalesCustomerReportComponent;
  let fixture: ComponentFixture<SalesCustomerReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesCustomerReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesCustomerReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
