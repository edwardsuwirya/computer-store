export class Product {
  id:string;
  productId:string;
  productBarcode:string;
  productName:string;
  productSpesification:string;
  productDescription:string;
  productLastPrice:number;
  productStock:number;
  productStatus:string;

  constructor(id:string = '', productId:string = '', productBarcode:string = '',
              productName:string = '', productSpesification:string = '', productDescription:string = '',
              productLastPrice:number = 0, productStock:number = 0, productStatus:string = '0') {
    this.id = id;
    this.productId = productId;
    this.productBarcode = productBarcode;
    this.productName = productName;
    this.productSpesification = productSpesification;
    this.productDescription = productDescription;
    this.productLastPrice = productLastPrice;
    this.productStock = productStock;
    this.productStatus = productStatus;
  }
}
