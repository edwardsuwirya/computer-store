import {OpaqueToken} from "@angular/core";

export const APP_CONFIG = new OpaqueToken("app.config");

export const appConfig = {
  'serviceBaseUrl': 'http://139.59.112.176:2403',
  'userName': 'madju',
  'userPwd': 'madjucom',
  'overdue': '3.0'
  // 'serviceBaseUrl': 'http://128.199.228.221:2403',
}
