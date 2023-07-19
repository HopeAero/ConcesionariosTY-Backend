const {pool} = require('./../../databases/db');

const posterState = async (req, res) => {
    try {
        const { nombre } = req.body;

        const response = await pool.query('INSERT INTO estado (nombre) VALUES ($1)  RETURNING *', [nombre]);

        res.status(200).json({
            success: true,
            message: "Estado creado con éxito",
            items: response.rows
        });

    } catch(error) {
        res.status(500).json({
            success: false,
            message: "Ha ocurrido un problema",
        });
        console.log(error);
    }
}

module.exports = {
    posterState
}
