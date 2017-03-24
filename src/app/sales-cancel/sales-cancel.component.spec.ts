import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesCancelComponent } from './sales-cancel.component';

describe('SalesCancelComponent', () => {
  let component: SalesCancelComponent;
  let fixture: ComponentFixture<SalesCancelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesCancelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesCancelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
