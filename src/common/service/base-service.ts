import {getConnection} from "typeorm";

export class BaseService {

    async transaction(callback, error = (err) => {
        return err;
    }) {
        const queryRunner = await getConnection().createQueryRunner()
        await queryRunner.startTransaction()

        try {
            let result = callback(queryRunner.manager);
            await queryRunner.commitTransaction();
            return await result;
        } catch (err) {
            await queryRunner.rollbackTransaction();
            return await error(err);
        } finally {
            await queryRunner.release();
        }
    }
}