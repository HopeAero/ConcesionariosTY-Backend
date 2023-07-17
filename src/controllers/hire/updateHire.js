const {pool} = require('../../databases/db');

const updateHire = async (req, res) => {
    try {
        const reserva = req.params.idRes;
        const servicio = req.params.codSer;
        const fecha_ingresada = new Date(req.body.tiempo_reserva);
        const fechaActual = new Date();

        const verify = await pool.query('SELECT * FROM contrata WHERE id_reserva = $1 AND codigo_servicio = $2', [reserva, servicio]);

        if (verify.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe combinación de esta reserva con este servicio",
            });
        } else {
            if (fecha_ingresada.getTime() < (fechaActual.getTime())) {
                res.status(404).json({
                    success: false,
                    message: "La fecha ingresada ya pasó",
                });
            }else{
                const tiempo = await pool.query('SELECT servicio.tiempo_reserva FROM servicio WHERE codigo = $1', [servicio]);
                const tiempoReserva = tiempo.rows[0].tiempo_reserva;
                const duracionEnMilisegundos = tiempoReserva.days * 24 * 60 * 60 * 1000; 
                
                if (fecha_ingresada.getTime() > (fechaActual.getTime() + duracionEnMilisegundos)) {
                    res.status(404).json({
                        success: false,
                        message: "La fecha ingresada excede el tiempo que se puede reservar el servicio",
                    });
                }else{
                    const tiempo_reserva = req.body.tiempo_reserva;
                    const response = await pool.query('UPDATE contrata SET tiempo_reserva = $1 WHERE id_reserva = $2 AND codigo_servicio = $3  RETURNING *', [tiempo_reserva, reserva, servicio]);

                    res.status(200).json({
                        success: true,
                        message: "Reserva de servicio actualizada con exito",
                        items: response.rows
                    });
                }
            }
        }

    } catch(error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Ha ocurrido un problema",
        });
    }
}

module.exports = {
    updateHire
}