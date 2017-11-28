// (<any>global).window = global

// // require('nativescript-vue/dist/index')
require('bundle-entry-points')
require('vendor-platform')

// if ((<any>global).TNS_WEBPACK) {
//   // registers tns-core-modules UI framework modules
//   require('bundle-entry-points')

//   // register application modules
//   // This will register each xml, css, js, ts, scss etc. in the app/ folder
//   const context = (<any>require).context('~/', true, /components\/.*\.(xml|css|js|ts|scss)$/)
//   ;(<any>global).registerWebpackModules(context)
// }
