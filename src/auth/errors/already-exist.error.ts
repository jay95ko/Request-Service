import {HttpException, HttpStatus} from "@nestjs/common";

export class AlreadyExistError extends HttpException {

    constructor() {
        super({
            status: HttpStatus.UNAUTHORIZED,
            error: "Already exist member"
        }, HttpStatus.UNAUTHORIZED);
    }

}