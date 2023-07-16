const {pool} = require('../../databases/db');

const deleteReserve = async (req, res) => {
    try {
        const id_reserva = req.params.id;
        const verify = await pool.query('SELECT * FROM reserva WHERE id_reserva = $1', [id_reserva]);
        if (verify.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe reserva con este id",
            });
        } else {
            const response = await pool.query('DELETE FROM reserva WHERE id_reserva = $1', [id_reserva]);
            res.status(200).json({
                success: true,
                message: "Reserva eliminada con exito",
            });
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
    deleteReserve
}