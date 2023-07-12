const {Pool} = require('pg');

const pool = new Pool({
    host: 'localhost',  
    user: 'postgres',
    password: 'anna2018',
    database: 'ConcesionariosTY',
    port: '5432'
});

module.exports = {
    pool
}

