import {HttpException, HttpStatus} from "@nestjs/common";

export class PermissionDeniedError extends HttpException {

    constructor() {
        super('permission denied', HttpStatus.FORBIDDEN);
    }
}