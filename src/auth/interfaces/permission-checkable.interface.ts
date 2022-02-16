import {Member} from "../../entity/member.entity";

export interface PermissionCheckableInterface {

    getMember(): Member;
}