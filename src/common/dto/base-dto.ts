export class BaseDto {

    getProps() {
        let result = {};
        Object.keys(this).forEach((value => {
            result[value] = this[value];
        }));
        return result;
    }
}