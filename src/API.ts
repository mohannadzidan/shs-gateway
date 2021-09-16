import { Application } from "express";

abstract class API {
    constructor( protected name: string, protected app : Application) {
    }

    abstract initialize() : void;
}

export default API;