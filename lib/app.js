"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nconf = require("nconf");
nconf.file('config/default.json');
process.env.DEBUG = nconf.get("DEBUG");
const main_router_1 = require("./routes/main.router");
const prayers_controller_1 = __importDefault(require("./controllers/prayers.controller"));
const main_controller_1 = __importDefault(require("./controllers/main.controller"));
const keys_controller_1 = __importDefault(require("./controllers/keys.controller"));
let app = new main_router_1.App([new prayers_controller_1.default(), new main_controller_1.default(), new keys_controller_1.default()]);
// let eventProvider:events.ConfigEventProvider = new events.ConfigEventProvider("config/config.json");
// let eventListener:events.ConfigEventListener = new events.ConfigEventListener();
// eventProvider.registerListener(eventListener);
setTimeout(() => {
    app.listen();
}, 5000);
// setTimeout(()=>{doSomething()}, 5000);
// async function  doSomething()
// {        let err:Error, result: any, url: any;
// let queryString: any =
// {
//     uri: 'http://localhost:3005/PrayerManager/PrayersAdjustments/',
//     method: 'GET',
//     json: true,
//     resolveWithFullResponse: false
// };
// [err, result] = await to(request.get(queryString));
// console.log(result);
// console.log("Error: "+err);
// }
//# sourceMappingURL=app.js.map