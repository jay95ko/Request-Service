import {Column, Entity, PrimaryColumn} from 'typeorm';
import {Base} from "./base.entity";

@Entity()
export class RequestType extends Base {
    @PrimaryColumn("varchar", {length: 32})
    code: string

    @Column("varchar", {length: 32})
    name: string

}