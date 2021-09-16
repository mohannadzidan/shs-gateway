import { Application } from "express";
import API from "../API";

class Testing extends API {

    constructor(protected app: Application) {
        super("Testing", app);
    }

    initialize(): void {
        throw new Error("Method not implemented.");
    }

}
export default Testing;