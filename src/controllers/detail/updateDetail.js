const { pool } = require('./../../databases/db');

const updateDetail = async (req, res) => {
    try {
        const { codigo_orden_servicio, cod_servicio, nro_actividad } = req.params;
        const { horas_requeridas } = req.body;
        const verify = await pool.query('SELECT * FROM orden_de_servicio WHERE codigo = $1', [codigo_orden_servicio]);
        const verify2 = await pool.query('SELECT * FROM actividad WHERE codigo_servicio = $1', [cod_servicio]);
        const verify4 = await pool.query('SELECT * FROM actividad WHERE codigo_servicio = $1 AND nro_actividad = $2', [cod_servicio, nro_actividad]);
        const verify3 = await pool.query('SELECT * FROM DETALLA WHERE codigo_orden_servicio = $1 AND codigo_servicio = $2 AND nro_actividad = $3', [codigo_orden_servicio, cod_servicio, nro_actividad]);



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
                    const response = await pool.query('UPDATE DETALLA SET horas_requeridas = $1 WHERE codigo_orden_servicio = $2 AND codigo_servicio = $3 AND nro_actividad = $4 RETURNING *', [horas_requeridas, codigo_orden_servicio, cod_servicio, nro_actividad]);
                    res.status(200).json({
                        success: true,
                        message: "Detalle de orden de servicio actualizada con exito",
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
    updateDetail
}