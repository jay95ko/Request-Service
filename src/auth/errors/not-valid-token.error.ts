import {HttpException, HttpStatus} from "@nestjs/common";

export class NotValidTokenError extends HttpException {

    constructor() {
        super({
            status: HttpStatus.UNAUTHORIZED,
            error: "Token is not valid"
        }, HttpStatus.UNAUTHORIZED);
    }

}