import {OpaqueToken} from "@angular/core";

export let APP_CONFIG = new OpaqueToken("app.config");

export const appConfig = {
  'serviceBaseUrl': 'http://139.59.112.176:2403',
  // 'serviceBaseUrl': 'http://128.199.228.221:2403',
}
