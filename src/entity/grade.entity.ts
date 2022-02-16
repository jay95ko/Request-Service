import {Column, Entity, PrimaryColumn, Unique} from "typeorm";
import {Base} from "./base.entity";

@Entity()
export class Grade extends Base {
    @PrimaryColumn("varchar", {length: 32})
    code: string

    @Column("varchar", { length: 32 })
    name: string
}