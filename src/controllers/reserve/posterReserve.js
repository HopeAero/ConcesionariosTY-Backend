const {pool} = require('../../databases/db');

const posterReserve = async (req, res) => {
    try {
        const {placa_vehiculo} = req.body;
        const verify = await pool.query('SELECT * FROM vehiculo WHERE placa = $1', [placa_vehiculo]);
        const id = await pool.query('SELECT COUNT(id_reserva) FROM reserva');
        const id_reserva = parseInt(id.rows[0].count) + 1;

        if (verify.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe un vehiculo con esta placa",
            });
            } else {
                const response = await pool.query('INSERT INTO reserva (id_reserva, placa_vehiculo) VALUES ($1, $2) RETURNING *', [id_reserva, placa_vehiculo]);
                res.status(200).json({
                    success: true,
                    message: "Reserva insertada con exito",
                    items: response.rows
                });
            }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Ha ocurrido un problema ${error.message}`
        });
        console.log(error);
    }
}

module.exports = {
    posterReserve
}