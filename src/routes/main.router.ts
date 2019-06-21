import express from "express";
import config from "nconf";
import morgan from "morgan";
import path from "path";
import compression from "compression";
import * as bodyParser from 'body-parser';
import {IController} from "../controllers/controllers.interface";
import * as exceptionMiddleware from "../middlewares/exceptions.middleware";
import helmet from "helmet";
//import proxy from "http-proxy-middleware";
export class App {
  public app: express.Application;
  private _port: number;
  private _excpetionMiddleware:exceptionMiddleware.ExceptionMiddleware;
  private _mainFolder:string;
  private _stataicFolder:string;
  constructor(controllers: IController[]) {
    this.app = express();
    this._mainFolder = config.get('WEBROOT');
    this._stataicFolder= config.get('STATIC_FILES');
    this._port = config.get("PORT");

    this.connectToTheDatabase();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeErrorMiddleware()
  }
 
  public listen():void {
    this.app.listen(this._port, () => {
      console.log(`App listening on the port ${this._port}`);
    });
  }
 
  private initializeMiddlewares():void {
    this.app.use(compression());
    // this.app.use('/Places/',
    // proxy({target:`https://maps.googleapis.com/maps/api/js?key=${config.get("GOOGLE_PLACE_KEY")}&libraries=places`,
    // changeOrigin:true,
    // ignorePath:true,
    // followRedirects:true}));
    this.app.use(helmet());
    this.app.use(bodyParser.json());
//    this.app.use(express.static(path.join(this._mainFolder,this._stataicFolder)))
    this.app.use(morgan('tiny'));
}
 
  private initializeControllers(controllers: IController[]):void {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }
  private initializeErrorMiddleware() {
    this._excpetionMiddleware = new exceptionMiddleware.ExceptionMiddleware();
   this.app.use( this._excpetionMiddleware.errorMiddleware);
} 
  private connectToTheDatabase() {

  }
}
 
