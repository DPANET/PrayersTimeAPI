"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// export class ConfigEventProvider extends EventProvider<string>
// {
//     private _pathName: string;
//     private _chokidar: chokidar.FSWatcher;
//     constructor(pathName: string) {
//         super();
//         this._pathName= pathName;
//         this._chokidar = chokidar.watch(this._pathName);
//         this._chokidar.options={
//         }
//         this._chokidar.on("change",this.fileChangedEvent.bind(this))
//         this._chokidar.on("error",this.fileChangeError.bind(this));
//     }
//     public registerListener(observer: IObserver<string>): void {
//         super.registerListener(observer);
//     }
//     public removeListener(observer: IObserver<string>): void {
//         super.removeListener(observer);
//     }
//     public notifyObservers(eventType: EventsType, fileName: string, error?: Error): void {
//         super.notifyObservers(eventType, fileName, error);
//     }
//     private fileChangedEvent(pathName:string)
//     {
//         try{
//         this.notifyObservers(EventsType.OnNext,pathName);
//         }
//         catch(err)
//         {
//             this.notifyObservers(EventsType.OnError,pathName,err)
//         }
//     }
//     private fileChangeError(error:Error)
//     {
//         this.notifyObservers(EventsType.OnError,this._pathName,error);
//     }
// }
// export class ConfigEventListener implements IObserver<string>
// {
//     //private _prayerAppManager: manager.PrayersAppManager
//     constructor() {
//     }
//     onCompleted(): void {
//           }
//     onError(error: Error): void {
//       debug(error);
//     }
//     onNext(value: string): void {
//         debug(`${value} config file has been saved, good job`);
//     }
// }
//# sourceMappingURL=events.js.map