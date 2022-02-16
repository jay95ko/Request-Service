import {HttpException, HttpStatus} from "@nestjs/common";

export class AuthenticationError extends HttpException {
    constructor() {
        super('unauthenticated', HttpStatus.FORBIDDEN);
    }
}