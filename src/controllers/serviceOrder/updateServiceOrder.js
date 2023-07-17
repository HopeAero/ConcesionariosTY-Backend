const { pool } = require('./../../databases/db');
const moment = require('moment');

const updateServiceOrder = async (req, res) => {
    try {
        const cod = req.params.cod;
        const placa = req.body.placa_vehiculo ?? null;
        const ci_emp = req.body.ci_empleado ?? null;
        let tiempo_de_uso =
            req.body.tiempo_de_uso !== undefined && req.body.tiempo_de_uso !== ""
                ? req.body.tiempo_de_uso
                : null;
        let fechaIn =
            req.body.fecha_entrada !== undefined && req.body.fecha_entrada !== ""
                ? req.body.fecha_entrada
                : null;
        let fechaSalEst =
            req.body.fecha_salida_est !== undefined &&
                req.body.fecha_salida_est !== ""
                ? req.body.fecha_salida_est
                : null;
        let fechaSalReal =
            req.body.fecha_salida_real !== undefined &&
                req.body.fecha_salida_real !== ""
                ? req.body.fecha_salida_real
                : null;
        const kilometraje =
            req.body.kilometraje !== undefined && req.body.kilometraje !== ""
                ? req.body.kilometraje
                : null;

        const regexIntervalo = /^P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/;
        fechaIn = moment(fechaIn, 'YYYY-MM-DD');
        fechaSalEst = moment(fechaSalEst, 'YYYY-MM-DD');
        fechaSalReal = moment(fechaSalReal, 'YYYY-MM-DD');

        const verify = await pool.query('SELECT * FROM orden_de_servicio WHERE codigo = $1', [cod]);

        if (verify.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe una orden de servicio con este codigo",
            });
        } else {
            const validate = await pool.query('SELECT * FROM vehiculo WHERE placa = $1', [placa]);

            if (validate.rows.length === 0) {
                res.status(404).json({
                    success: false,
                    message: "Debe colocar la placa de un vehiculo existente",
                });
            } else {
                const validate2 = await pool.query('SELECT * FROM analista WHERE ci_empleado = $1', [ci_emp]);

                if (validate2.rows.length === 0) {
                    res.status(404).json({
                        success: false,
                        message: "Debe colocar la cedula de un analista existente",
                    });
                } else {
                    if ((fechaSalEst < fechaIn) || (fechaSalReal < fechaIn)) {
                        res.status(404).json({
                            success: false,
                            message: "La fecha de entrada debe ser antes de la fecha de salida",
                        });
                    } else {
                        if (!regexIntervalo.test(tiempo_de_uso)) {
                            res.status(400).json({
                                success: false,
                                message:
                                    "El valor de tiempo_reserva no es un intervalo de tiempo válido.",
                            });
                        } else {
                            const { retirante_ci, retirante_nombre } = req.body;
                            const response = await pool.query('UPDATE orden_de_servicio SET fecha_entrada = $1, fecha_salida_real = $2, fecha_salida_est = $3, retirante_ci = $4, retirante_nombre = $5, placa_vehiculo = $6, ci_empleado = $7, kilometraje = $8, tiempo_de_uso = $9 WHERE codigo = $10  RETURNING *', [fechaIn, fechaSalReal, fechaSalEst, retirante_ci, retirante_nombre, placa, ci_emp, tiempo_de_uso, kilometraje, cod]);

                            res.status(200).json({
                                success: true,
                                message: "Orden de servicio actualizada con éxito",
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
            message: `Ha ocurrido un problema ${error.message}`
        });
        console.log(error);
    }
};

module.exports = {
    updateServiceOrder
}