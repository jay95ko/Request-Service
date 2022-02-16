import {Responsible} from "./responsible";

export class ResponseTemplate implements Responsible {

    constructor(public data: any, public message: string, public code: number = 200) {
    }
}