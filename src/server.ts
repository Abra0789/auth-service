import { app } from './app.js';
import { Config } from './config/index.js';
import { logger } from './config/logger.js';

function startServer() {
    const PORT = Config.PORT;
    try {
        app.listen(PORT, () => {
            logger.info(`server is running`, { PORT });
        });
    } catch (err) {
        logger.error(err);
        process.exit(1);
    }
}

startServer();
