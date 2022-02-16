import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {Base} from "./base.entity";
import {Team} from "./team.entity";
import {Grade} from "./grade.entity";
import {PermissionCheckableInterface} from "../auth/interfaces/permission-checkable.interface";

@Entity()
export class Member extends Base implements PermissionCheckableInterface {
    @PrimaryGeneratedColumn()
    idx: number

    @ManyToOne(() => Grade)
    @JoinColumn()
    grade: Grade

    @ManyToOne(() => Team)
    @JoinColumn()
    team: Team

    @Column("varchar", {length: 16})
    name: string

    @Column("varchar", {length: 32, unique: true})
    email: string

    @Column("varchar", {length: 16})
    department: string

    @Column("varchar", {length: 256, select: false, unique: true})
    auth_key: string

    getMember(): Member {
        return this;
    }

    isAdmin(): boolean {
        return this.grade.code == 'admin';
    }
}