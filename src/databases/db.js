const {Pool} = require('pg');

const pool = new Pool({
    host: process.env.HOST || 'localhost',  
    user: process.env.USER || 'postgres',
    password: process.env.PASSWORD || '1234',
    database: process.env.DATABASE || 'prueba',
    port: process.env.PORT || 5432
});

module.exports = {
    pool
}

