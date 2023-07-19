const { pool } = require('./../../databases/db');

const posterDetail = async (req, res) => {
    try {
        const { cod_orden, cod_servicio, nro_actividad, horas_requeridas } = req.body;
        const verify = await pool.query('SELECT * FROM orden_de_servicio WHERE codigo = $1', [cod_orden]);
        const verify2 = await pool.query('SELECT * FROM actividad WHERE codigo_servicio = $1', [cod_servicio]);
        const verify4 = await pool.query('SELECT * FROM actividad WHERE codigo_servicio = $1 AND nro_actividad = $2', [cod_servicio, nro_actividad]);
        const verify3 = await pool.query('SELECT * FROM DETALLA WHERE codigo_orden_servicio = $1 AND codigo_servicio = $2 AND nro_actividad = $3', [cod_orden, cod_servicio, nro_actividad]);



        if (verify.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe orden de servicio con este codigo",
            });
        } else {
            if (verify2.rows.length === 0 || verify4.rows.length === 0) {
                res.status(404).json({
                    success: false,
                    message: "No existe actividad con este codigo de servicio o numero de actividad",
                });
            } else {
                if (verify3.rows.length !== 0) {
                    res.status(400).json({
                        success: false,
                        message: "Ya existe una actividad con este codigo de orden de servicio, codigo de servicio y numero de actividad",
                    })
                } else {
                    const costoActualActividad = verify2.rows[0].costo_actual_actividad;
                    const response = await pool.query('INSERT INTO DETALLA (codigo_orden_servicio, codigo_servicio, nro_actividad, horas_requeridas, costo_actividad) VALUES ($1, $2, $3, $4, $5) RETURNING *', [cod_orden, cod_servicio, nro_actividad, horas_requeridas, costoActualActividad]);
                    res.status(200).json({
                        success: true,
                        message: "Detalle de orden de servicio registrada con exito",
                        items: response.rows
                    });
                }
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: `Ha ocurrido un problema ${error.detail}`
        });
    }
}

module.exports = {
    posterDetail
}