const {pool} = require('../../databases/db');

const posterServiceOrder = async (req, res) => {
    try {
        const cod = req.body.codigo;
        const placa = req.body.placa_vehiculo;
        const ci_emp = req.body.ci_empleado;
        const fechaIn = new Date(req.body.fecha_entrada);
        const fechaSalEst = new Date(req.body.fecha_salida_est);
        const fechaSalReal = new Date(req.body.fecha_salida_real);
        const verify = await pool.query('SELECT * FROM orden_de_servicio WHERE codigo = $1', [cod]);

        if (verify.rows.length !== 0) {
            res.status(404).json({
                success: false,
                message: "Ya existe una orden de servicio con este codigo",
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
                    if ((fechaSalEst < fechaIn )||(fechaSalReal < fechaIn)) {
                        res.status(404).json({
                            success: false,
                            message: "La fecha de entrada debe ser antes de la fecha de salida",
                        });
                    }else{
                        const {fecha_entrada, fecha_salida_real, fecha_salida_est, retirante_ci, retirante_nombre} = req.body;
                        const response = await pool.query(
                            'INSERT INTO orden_de_servicio (codigo, fecha_entrada, fecha_salida_real, fecha_salida_est, retirante_ci, retirante_nombre, placa_vehiculo, ci_empleado) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [cod, fecha_entrada, fecha_salida_real, fecha_salida_est, retirante_ci, retirante_nombre, placa, ci_emp]);
                        res.status(200).json({
                            success: true,
                            message: "Orden de servicio registrada con exito",
                            items: response.rows
                        });
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
    posterServiceOrder
}