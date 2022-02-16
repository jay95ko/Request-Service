import {AuthService} from "../../auth/auth.service";

export class BaseController {
    authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }
}