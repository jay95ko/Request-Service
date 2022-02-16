import {Injectable} from '@nestjs/common';
import {PermissionDeniedError} from "./errors/permission-denied.error";
import {PermissionCheckableInterface} from "./interfaces/permission-checkable.interface";

@Injectable()
export class AuthService {

    googleLogin(req) {
        if (!req.user) {
            return 'No user from google';
        }
        return {
            message: 'User information from google',
            user: req.user,
        };
    }

    /**
     * req 에 저장되어 있는 member 가
     * 해당 Entity 를 수정할 권한이 있는지 확인
     */
    checkPermission(req, entity: PermissionCheckableInterface) {
        let target = entity.getMember();
        // if (!(req.member.isAdmin() || req.member.idx == target.idx)) {
        if (!(req.member.idx == target.idx)) {
            throw new PermissionDeniedError();
        }
    }

}
