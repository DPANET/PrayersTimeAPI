const debug = require('debug')('app:router');
import {IController} from "./controllers.interface";
import express from 'express';
import path from 'path';
import config from "nconf";
export default class MainController implements IController

{

    path: string;
    router: express.Router;
    private _filePath:string;
    private _fileName:string;
    constructor()
    {
        this.path = "/";
        this.router= express.Router();
        this._filePath = config.get("MAIN_FILE_PATH");
        this._fileName = config.get("MAIN_FILE_NAME");

        this.initializeRoutes();
        
    }
    private initializeRoutes() {
        this.router.get(this.path, this.mainPageRoute);
      }
    private mainPageRoute=  (request: express.Request, response: express.Response)=>
    {
        response.sendFile(path.join(__dirname,this._filePath),{index:false,dotfiles:"allow",redirect:true});
    }

}