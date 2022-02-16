import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Base} from "./base.entity";
import {Request} from "./request.entity";
import {RequestStatus} from "./request-status.entity";
import {Member} from "./member.entity";
import {PermissionCheckableInterface} from "../auth/interfaces/permission-checkable.interface";

@Entity()
export class Response extends Base implements PermissionCheckableInterface {
    @PrimaryGeneratedColumn()
    idx: number

    @ManyToOne(() => Request)
    @JoinColumn()
    request: Request

    @ManyToOne(() => RequestStatus)
    @JoinColumn()
    status: RequestStatus

    @ManyToOne(() => Member)
    @JoinColumn()
    admin: Member

    @Column("varchar", {length: 32})
    response: string

    getMember(): Member {
        return this.admin;
    }
}