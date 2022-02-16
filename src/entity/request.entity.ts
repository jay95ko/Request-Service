import {Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Base} from "./base.entity";
import {Member} from "./member.entity";
import {RequestType} from "./request-type.entity";
import {RequestStatus} from "./request-status.entity";
import {Response} from "./response.entity";
import {PermissionCheckableInterface} from "../auth/interfaces/permission-checkable.interface";

@Entity()
export class Request extends Base implements PermissionCheckableInterface{
    @PrimaryGeneratedColumn()
    idx: number

    @ManyToOne(() => RequestType)
    @JoinColumn()
    request_type: RequestType

    @ManyToOne(type => RequestStatus)
    @JoinColumn({name: 'requestStatusCode'})
    request_status: RequestStatus

    @ManyToOne(() => Member)
    @JoinColumn()
    member: Member

    @OneToMany(() => Response, response => response.request)
    @JoinColumn()
    responses: Response[]

    @Column("varchar", {length: 500})
    contents: string

    getMember(): Member {
        return this.member;
    }
}