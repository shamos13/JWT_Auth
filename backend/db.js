const Pool = require('pg').Pool

const pool = new Pool({
    user:"cfreak97",
    password:"tarak#23h!",
    host:"localhost",
    port:5432,
    database:"jwttutorial"
})

module.exports = pool;