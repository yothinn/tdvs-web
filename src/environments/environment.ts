// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  hrm:false,
  staging: false,
  appName: "tvds-dev",
  // apiUrl: "https://tvds-service-7lgq2xsobq-de.a.run.app",
  // apiUrl: "https://tvds-service-prod-7lgq2xsobq-de.a.run.app",
  apiUrl: 'http://localhost:3000',
  authApiUrl: "https://authen-service-7lgq2xsobq-de.a.run.app",
  // SOCKET_ENDPOINT: 'http://localhost:3000'
  linechatUrl: 'http://localhost:3100',
  thamDeliveryChatRoomId: 'U9b2714c1a2fa39646c1bb25e674aa0b3',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


