import {CreateDateColumn, DeleteDateColumn, UpdateDateColumn} from 'typeorm';

export class Base {

    @CreateDateColumn({type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)",})
    public created_at: Date | string;

    @UpdateDateColumn({type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)"})
    public updated_at: Date | string;

    @DeleteDateColumn({type: "timestamp", select: false})
    public deleted_at: Date | string;

    setProps(data) {
        Object.keys(data).forEach((value) => {
            this[value] = data[value];
        });
    }

    getDateString(date: Date | string): string {
        let str: string;
        if (typeof date === 'string') {
            str = date;
        } else {
            str = date.toISOString();
        }
        return str.split('T')[0];
    }

    bindDate() {
        this.created_at = this.getDateString(this.created_at);
        this.updated_at = this.getDateString(this.updated_at);
    }
}