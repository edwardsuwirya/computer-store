import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesForPrintingComponent } from './sales-for-printing.component';

describe('SalesForPrintingComponent', () => {
  let component: SalesForPrintingComponent;
  let fixture: ComponentFixture<SalesForPrintingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesForPrintingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesForPrintingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
