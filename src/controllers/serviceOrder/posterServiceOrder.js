const { pool } = require("../../databases/db");
const moment = require("moment");

const posterServiceOrder = async (req, res) => {
    try {
        const cod = req.body.codigo ?? null;
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

        fechaIn = moment(fechaIn, "YYYY-MM-DD");
        fechaSalEst = moment(fechaSalEst, "YYYY-MM-DD");
        fechaSalReal = moment(fechaSalReal, "YYYY-MM-DD");

        const regexIntervalo =
            /^P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?(T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/;

        const verify = await pool.query(
            "SELECT * FROM orden_de_servicio WHERE codigo = $1",
            [cod]
        );

        if (verify.rows.length !== 0) {
            res.status(404).json({
                success: false,
                message: "Ya existe una orden de servicio con este codigo",
            });
        } else {
            const validate = await pool.query(
                "SELECT * FROM vehiculo WHERE placa = $1",
                [placa]
            );

            if (validate.rows.length === 0) {
                res.status(404).json({
                    success: false,
                    message: "Debe colocar la placa de un vehiculo existente",
                });
            } else {
                const validate2 = await pool.query(
                    "SELECT * FROM analista WHERE ci_empleado = $1",
                    [ci_emp]
                );

                if (validate2.rows.length === 0) {
                    res.status(404).json({
                        success: false,
                        message: "Debe colocar la cedula de un analista existente",
                    });
                } else {
                    if (fechaSalEst < fechaIn || fechaSalReal < fechaIn) {
                        res.status(404).json({
                            success: false,
                            message:
                                "La fecha de entrada debe ser antes de la fecha de salida",
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
                            const response = await pool.query(
                                "INSERT INTO orden_de_servicio (codigo, fecha_entrada, fecha_salida_real, fecha_salida_est, retirante_ci, retirante_nombre, placa_vehiculo, kilometraje, tiempo_de_uso, ci_empleado) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
                                [
                                    cod,
                                    fechaIn,
                                    fechaSalReal,
                                    fechaSalEst,
                                    retirante_ci,
                                    retirante_nombre,
                                    placa,
                                    kilometraje,
                                    tiempo_de_uso,
                                    ci_emp,
                                ]
                            );
                            res.status(200).json({
                                success: true,
                                message: "Orden de servicio registrada con exito",
                                items: response.rows,
                            });
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: `Ha ocurrido un problema ${error.message}`
        });
    }
};

module.exports = {
    posterServiceOrder,
};
