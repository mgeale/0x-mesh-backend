import { Config } from '../config';

import { meshSnapshot } from './meshSnapshot';

import { initDBConnectionAsync } from '../connections/dbConnection';
import { initMeshConnectionAsync } from '../connections/meshConnection';
import { logger } from '../common/logger';

export class Jobs {
    public static async init(config: Config) {
        await initMeshConnectionAsync(config);
        logger.info('mesh connection created');
        await initDBConnectionAsync(config);
        logger.info('db connection created');
        this.recordOrders(config);
    }

    private static recordOrders(config: Config) {
        setInterval(async () => {
            await meshSnapshot(config);
        }, config.timeoutInterval);
    }
}
