// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  hrm:false,
  staging: false,
  appName: "tvds-dev",

  // SOCKET_ENDPOINT: 'http://localhost:3000'
  authApiUrl: "https://authen-service-7lgq2xsobq-de.a.run.app",
  apiUrl: "https://tvds-service-prod-7lgq2xsobq-de.a.run.app",
  // apiUrl: 'http://localhost:3000',
  
  // linechatUrl: 'http://localhost:3100',
  linechatUrl: 'https://linechat-service-prod-7lgq2xsobq-de.a.run.app',
  thamDeliveryChatRoomId: 'U9b2714c1a2fa39646c1bb25e674aa0b3',   // Test รถธรรมธุรกิจ
  // thamDeliveryChatRoomId: 'U6c026b2dba9af0ae072658289156c9ca',
  joborderLiff: 'https://liff.line.me/1654123512-vPZoKZA8',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


