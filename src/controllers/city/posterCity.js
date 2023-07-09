const {pool} = require('../../databases/db');

const posterCity = async (req, res) => {
    try {
            const {id_estado, nombre} = req.body;

            const verify = await pool.query('SELECT * FROM estado WHERE id = $1', [id_estado]);

            if (verify.rows.length === 0) {
                res.status(404).json({
                    success: false,
                    message: "No existe estado con este id",
                });
            } else {
                const response = await pool.query('INSERT INTO ciudad (id_estado, nombre) VALUES ($1, $2) RETURNING *', [id_estado, nombre]);

                res.status(200).json({
                    success: true,
                    message: "Ciudad insertada con exito",
                    items: response.rows
                });
            }

            
    } catch(error) {
        res.status(500).json({
            success: false,
            message: "Ha ocurrido un problema",
        });
        console.log(error);
    }
}

module.exports = {
    posterCity
}