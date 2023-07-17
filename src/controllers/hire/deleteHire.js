const {pool} = require('../../databases/db');

const deleteHire = async (req, res) => {
    try {
        const reserva = req.params.idRes;
        const servicio = req.params.codSer;
        const verify = await pool.query('SELECT * FROM contrata WHERE id_reserva = $1 AND codigo_servicio = $2', [reserva, servicio]);

        if (verify.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe combinación de esta reserva con este servicio",
            });
        } else {
            await pool.query('DELETE FROM contrata WHERE id_reserva = $1 AND codigo_servicio = $2', [reserva, servicio]);
            res.status(200).json({
                success: true,
                message: "Reservación eliminada con exito",
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
    deleteHire
}
