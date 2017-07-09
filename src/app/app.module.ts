import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {AppComponent} from "./app.component";
import {SupplierComponent} from "./supplier/supplier.component";
import {Routes, RouterModule} from "@angular/router";
import {SupplierUpdateComponent} from "./supplier-update/supplier-update.component";
import {PleaseWaitComponent} from "./shared/component/please-wait/please-wait.component";
import {CustomerComponent} from "./customer/customer.component";
import {CustomerUpdateComponent} from "./customer-update/customer-update.component";
import {HomeComponent} from "./home/home.component";
import {ProductComponent} from "./product/product.component";
import {ProductUpdateComponent} from "./product-update/product-update.component";
import {SalesComponent} from "./sales/sales.component";
import {TabNewRowDirective} from "./shared/directive/tab-new-row.directive";
import {TabDelRowDirective} from "./shared/directive/tab-del-row.directive";
import {NumberFormatDirective} from "./shared/directive/number-format.directive";
import {SalesForPrintingComponent} from "./sales-for-printing/sales-for-printing.component";
import {SalesForPrintingService} from "./sales-for-printing/sales-for-printing.service";
import {PricePipe} from "./shared/pipe/price.pipe";
import {DateFormatDirective} from "./shared/directive/date-format.directive";
import {SalesReportComponent} from "./sales-report/sales-report.component";
import {SalesPaymentReportPipe} from "./sales-report/sales-payment-report.pipe";
import {SalesCustomerReportComponent} from "./sales-customer-report/sales-customer-report.component";
import {SalesCancelComponent} from "./sales-cancel/sales-cancel.component";
import {appConfig, APP_CONFIG} from "./shared/model/app-properties";
import {PurchaseComponent} from "./purchase/purchase.component";
import {PurchaseReportComponent} from "./purchase-report/purchase-report.component";
import {HomeMenuComponent} from "./home-menu/home-menu.component";
import {LoginComponent} from "./login/login.component";
import {RouterGuard} from "./login/router-guard";
import {PurchaseCancelComponent} from "./purchase-cancel/purchase-cancel.component";
import { OverdueReportComponent } from './overdue-report/overdue-report.component';
import { SalesTotalReportComponent } from './sales-total-report/sales-total-report.component';

const appRoutes:Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeMenuComponent, canActivate: [RouterGuard]},
  {path: 'supplier', component: SupplierComponent, canActivate: [RouterGuard]},
  {path: 'supplierUpdate', component: SupplierUpdateComponent, canActivate: [RouterGuard]},
  {path: 'supplierUpdate/:supplier', component: SupplierUpdateComponent, canActivate: [RouterGuard]},
  {path: 'customer', component: CustomerComponent, canActivate: [RouterGuard]},
  {path: 'customerUpdate', component: CustomerUpdateComponent, canActivate: [RouterGuard]},
  {path: 'customerUpdate/:customer', component: CustomerUpdateComponent, canActivate: [RouterGuard]},
  {path: 'product', component: ProductComponent, canActivate: [RouterGuard]},
  {path: 'productUpdate', component: ProductUpdateComponent, canActivate: [RouterGuard]},
  {path: 'productUpdate/:product', component: ProductUpdateComponent, canActivate: [RouterGuard]},
  {path: 'sales', component: SalesComponent, canActivate: [RouterGuard]},
  {path: 'salesPrint', component: SalesForPrintingComponent, canActivate: [RouterGuard]},
  {path: 'salesReport', component: SalesReportComponent, canActivate: [RouterGuard]},
  {path: 'overdueReport', component: OverdueReportComponent, canActivate: [RouterGuard]},
  {path: 'salesTotalReport', component: SalesTotalReportComponent, canActivate: [RouterGuard]},
  {path: 'salesCustomerReport', component: SalesCustomerReportComponent, canActivate: [RouterGuard]},
  {path: 'salesCancel', component: SalesCancelComponent, canActivate: [RouterGuard]},
  {path: 'salesCancel/:salesNo', component: SalesCancelComponent, canActivate: [RouterGuard]},
  {path: 'purchase', component: PurchaseComponent, canActivate: [RouterGuard]},
  {path: 'purchaseReport', component: PurchaseReportComponent, canActivate: [RouterGuard]},
  {path: 'purchaseCancel', component: PurchaseCancelComponent, canActivate: [RouterGuard]},
  {path: 'purchaseCancel/:purchaseNo', component: PurchaseCancelComponent, canActivate: [RouterGuard]}
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
    SalesForPrintingComponent,
    PricePipe,
    DateFormatDirective,
    SalesReportComponent,
    SalesPaymentReportPipe,
    SalesCustomerReportComponent,
    SalesCancelComponent,
    PurchaseComponent,
    PurchaseReportComponent,
    HomeMenuComponent,
    LoginComponent,
    PurchaseCancelComponent,
    OverdueReportComponent,
    SalesTotalReportComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes, {useHash: true})
  ],
  providers: [
    {provide: APP_CONFIG, useValue: appConfig},
    SalesForPrintingService,
    RouterGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
