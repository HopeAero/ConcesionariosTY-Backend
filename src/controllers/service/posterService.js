const {pool} = require('../../databases/db');

const posterService = async (req, res) => {
    try {
        const {codigo, nombre, tiempo_reserva, descripcion_detallada, rif_agencia, ci_empleado} = req.body;
        const precioConsulta = await pool.query('SELECT SUM(costo_actual_actividad) FROM actividad WHERE codigo_servicio = $1', [codigo]);
        const verify = await pool.query('SELECT * FROM servicio WHERE codigo = $1', [codigo]);
        const verify2 = await pool.query('SELECT * FROM actividad WHERE codigo_servicio = $1', [codigo]);
        const verify3 = await pool.query('SELECT * FROM agencia WHERE rif = $1', [rif_agencia]);
        const verify4 = await pool.query('SELECT * FROM empleado WHERE ci_empleado = $1', [ci_empleado]);
        let costo_hora_hombre = parseFloat(precioConsulta.rows[0].sum);
        const fechaIngresada = new Date(tiempo_reserva); // Convertimos la cadena a un objeto Date
        const fechaActual = new Date(); // Obtenemos la fecha actual

        // Calculamos la diferencia en días entre las dos fechas
        const diferenciaMilisegundos = fechaIngresada.getTime() - fechaActual.getTime();
        const diferenciaDias = Math.ceil(Math.abs(diferenciaMilisegundos) / (1000 * 60 * 60 * 24));


        if (verify.rows.length !== 0) {
            res.status(409).json({
                success: false,
                message: "Ya existe un servicio con este codigo",
            });
        } else {
            if (verify2.rows.length === 0) {
                costo_hora_hombre = req.body.costo_hora_hombre !== undefined ? req.body.costo_hora_hombre : null;
                
                if (costo_hora_hombre === 0 || costo_hora_hombre === null || isNaN(costo_hora_hombre)) {
                    res.status(400).json({
                        success: false,
                        message: "El precio no puede ser nulo o 0"
                    });
                } else {
                    if (verify3.rows.length === 0) {
                        res.status(404).json({
                            success: false,
                            message: "No existe agencia con este rif",
                        });
                    } else {
                        if (verify4.rows.length === 0) {
                            res.status(404).json({
                                success: false,
                                message: "No existe empleado con esta cedula de identidad",
                            });
                        } else {
                            if (diferenciaDias < 1 || diferenciaDias > 7) {
                                res.status(400).json({
                                    success: false,
                                    message: "El tiempo de reserva debe ser entre 1 y 7 dias"
                                });
                            } else {
                                const response = await pool.query('INSERT INTO servicio (codigo, nombre, tiempo_reserva, descripcion_detallada, costo_hora_hombre, rif_agencia, ci_empleado) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [codigo, nombre, tiempo_reserva, descripcion_detallada, costo_hora_hombre, rif_agencia, ci_empleado]);
                                res.status(200).json({
                                    success: true,
                                    message: "Servicio insertado con exito",
                                    items: response.rows
                                });
                            }
                        }
                    }
                }
            } else {
                if (verify3.rows.length === 0) {
                    res.status(404).json({
                        success: false,
                        message: "No existe agencia con este rif",
                    });
                } else {
                    if (verify4.rows.length === 0) {
                        res.status(404).json({
                            success: false,
                            message: "No existe empleado con esta cedula de identidad",
                        });
                    } else {
                        if (diferenciaDias < 1 || diferenciaDias > 7) {
                            res.status(400).json({
                                success: false,
                                message: "El tiempo de reserva debe ser entre 1 y 7 dias"
                            });
                        } else {
                            const response = await pool.query('INSERT INTO servicio (codigo, nombre, tiempo_reserva, descripcion_detallada, costo_hora_hombre, rif_agencia, ci_empleado) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [codigo, nombre, tiempo_reserva, descripcion_detallada, costo_hora_hombre, rif_agencia, ci_empleado]);
                            res.status(200).json({
                            success: true,
                            message: "Servicio insertado con exito",
                            items: response.rows
                            });
                        }
                    }
                }
            }
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Ha ocurrido un problema",
        });
        console.log(error);
    }
}

module.exports = {
    posterService
}