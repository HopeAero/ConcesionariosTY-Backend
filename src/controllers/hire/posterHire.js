const {pool} = require('../../databases/db');

const posterHire = async (req, res) => {
    try {
        const reserva = req.body.id_reserva;
        const servicio = req.body.codigo_servicio;
        const fecha_ingresada = new Date(req.body.tiempo_reserva);
        const fechaActual = new Date();

        const verify = await pool.query('SELECT * FROM contrata WHERE id_reserva = $1 AND codigo_servicio = $2', [reserva, servicio]);

        if (verify.rows.length !== 0) {
            res.status(404).json({
                success: false,
                message: "Ya existe esta reserva con este servicio",
            });
        } else {
            const validate = await pool.query('SELECT * FROM reserva WHERE id_reserva = $1', [reserva]);
            
            if (validate.rows.length === 0) {
                res.status(404).json({
                    success: false,
                    message: "No existe reserva con dicho id",
                });
            } else {
                const validate2 = await pool.query('SELECT * FROM servicio WHERE codigo = $1', [servicio]);
                
                if (validate2.rows.length === 0) {
                    res.status(404).json({
                        success: false,
                        message: "No existe servicio con este codigo",
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
                            const response = await pool.query(
                                'INSERT INTO contrata (id_reserva, codigo_servicio, tiempo_reserva) VALUES ($1, $2, $3) RETURNING *', [reserva, servicio, tiempo_reserva]);
                            res.status(200).json({
                                success: true,
                                message: "Reserva de servicio registrada con exito",
                                items: response.rows
                            });
                        }
                    }
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
    posterHire
}