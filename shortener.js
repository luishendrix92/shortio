require('dotenv').config();

const Hapi     = require('@hapi/hapi');
const routes   = require('./routes');
const mongoose = require('mongoose');
const mongoUri = process.env.MONGOURI;

/* SERVER INITIALIZATION
 * -----------------------------------------------------------------------
 * We initialize the server once the connection to the database was set
 * with no errors; we also need to set CORS to true if we want this
 * API to be accessible in other domains. In order to serve static files
 * I used the Hapi plugin called 'inert', hence the call to 'require'.
 =======================================================================*/
const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    routes: { cors: true }
  });

  server.route(routes);

  await server.register(require('@hapi/inert'));
  await server.start();

  console.log(`Server running on port ${server.info.port}`);
};

process.on('unhandledRejection', (err) => {
  console.log(err);
  process.exit(1);
});

try {
  mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, () => { init(); });
} catch (error) {
  console.error(`Failed to connecto to db: ${error}`);
}
