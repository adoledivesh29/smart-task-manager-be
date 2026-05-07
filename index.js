require('dotenv').config({ quiet: true });
require('./globals');

const { mongodb } = require('./app/utils');
const router = require('./app/routers');

(async () => {
  try {
    console.log('\n---------------------------------');
    await mongodb.initialize();

    router.initialize();
  } catch (err) {
    log.blue(':-(');
    log.red(`reason: ${err.message}, stack: ${err.stack}`);
    process.exit(1);
  }
})();

console.log(`NODE_ENV ${process.env.NODE_ENV} 🌱,PORT ${process.env.PORT}!!! \n---------------------------------`);
