const {Pool} = require('pg');
const fs = require('fs');

const pool = new Pool({
    host: process.env.HOST || 'localhost',  
    user: process.env.USER || 'postgres',
    password: process.env.PASSWORD || '1234',
    database: process.env.DATABASE || 'ConcesionariosTY',
    port: process.env.PORT || 5432,
    connectionString: process.env.DATABASE_URL || 'postgres://postgres:1234@localhost:5432/ConcesionariosTY',
    ssl : {
        require: true,
        rejectUnauthorized: false
    }
});

module.exports = {
    pool
}

