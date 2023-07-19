const {pool} = require('../../databases/db');

const updateReserve = async (req, res) => {
    try {
        const id_reserva = req.params.id_reserva;
        const {placa_vehiculo} = req.body;
        const verify = await pool.query('SELECT * FROM reserva WHERE id_reserva = $1', [id_reserva]);
        const verify2 = await pool.query('SELECT * FROM vehiculo WHERE placa = $1', [placa_vehiculo]);
        if (verify.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe reserva con este id",
            });
        } else {
            if (verify2.rows.length === 0) {
                res.status(404).json({
                    success: false,
                    message: "No existe vehiculo con esta placa",
                });
            } else {
                const response = await pool.query('UPDATE reserva SET placa_vehiculo = $1 WHERE id_reserva = $2', [placa_vehiculo, id_reserva]);
                res.status(200).json({
                    success: true,
                    message: "Reserva actualizada con exito",
                    items: response.rows
                });
            }
        }
    } catch(error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: `Ha ocurrido un problema ${error.message}`
        });
    }
}

module.exports = {
    updateReserve
}