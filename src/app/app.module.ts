import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {SupplierComponent} from './supplier/supplier.component';
import {Routes, RouterModule} from "@angular/router";
import {SupplierUpdateComponent} from './supplier-update/supplier-update.component';
import {PleaseWaitComponent} from './shared/component/please-wait/please-wait.component';
import {CustomerComponent} from './customer/customer.component';
import {CustomerUpdateComponent} from './customer-update/customer-update.component';
import {HomeComponent} from './home/home.component';
import {ProductComponent} from './product/product.component';
import {ProductUpdateComponent} from './product-update/product-update.component';
import {SalesComponent} from './sales/sales.component';
import {TabNewRowDirective} from './shared/directive/tab-new-row.directive';
import {TabDelRowDirective} from './shared/directive/tab-del-row.directive';
import {NumberFormatDirective} from './shared/directive/number-format.directive';
import {FindCustomerDirective} from './shared/directive/find-customer.directive';
import {FindProductDirective} from './shared/directive/find-product.directive';
import {SalesForPrintingComponent} from './sales-for-printing/sales-for-printing.component';
import {SalesForPrintingService} from "./sales-for-printing/sales-for-printing.service";
import { PricePipe } from './shared/pipe/price.pipe';

const appRoutes:Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {path: 'home', component: HomeComponent},
  {path: 'supplier', component: SupplierComponent},
  {path: 'supplierUpdate', component: SupplierUpdateComponent},
  {path: 'supplierUpdate/:supplier', component: SupplierUpdateComponent},
  {path: 'customer', component: CustomerComponent},
  {path: 'customerUpdate', component: CustomerUpdateComponent},
  {path: 'customerUpdate/:customer', component: CustomerUpdateComponent},
  {path: 'product', component: ProductComponent},
  {path: 'productUpdate', component: ProductUpdateComponent},
  {path: 'productUpdate/:product', component: ProductUpdateComponent},
  {path: 'sales', component: SalesComponent},
  {path: 'salesPrint', component: SalesForPrintingComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    SupplierComponent,
    SupplierUpdateComponent,
    PleaseWaitComponent,
    CustomerComponent,
    CustomerUpdateComponent,
    HomeComponent,
    ProductComponent,
    ProductUpdateComponent,
    SalesComponent,
    TabNewRowDirective,
    TabDelRowDirective,
    NumberFormatDirective,
    FindCustomerDirective,
    FindProductDirective,
    SalesForPrintingComponent,
    PricePipe,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes, {useHash: true})
  ],
  providers: [SalesForPrintingService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
