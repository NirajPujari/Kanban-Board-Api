const knex = require('knex');
const db = knex({
  client: 'pg',
  connection: {
    connectionString: 'postgres://data_zqi7_user:LnTOurPTB7MUsJVlUC3i3MaUVrOCqwrx@dpg-cjuolp5175es73amis9g-a.singapore-postgres.render.com/data_zqi7',
    ssl: {
      rejectUnauthorized: false
    }
  }
});

module.exports = db;