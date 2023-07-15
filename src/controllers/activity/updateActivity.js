const {pool} = require('../../databases/db');

const updateActivity = async (req, res) => {
    try {
        const codigo_servicio = req.params.codigo_servicio;
        const nro_actividad = req.params.nro_actividad;
        const verify = await pool.query('SELECT * FROM actividad WHERE codigo_servicio = $1 AND nro_actividad = $2', [codigo_servicio, nro_actividad]);

        if (verify.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe actividad con este codigo de servicio y numero de actividad",
            });
        } else {
            let costo_actual_a = verify.rows[0].costo_actual_actividad;
            const {descripcion, costo_actual_actividad} = req.body;
                if (costo_actual_actividad === undefined || costo_actual_actividad === null || costo_actual_actividad === "" || costo_actual_actividad === 0) {
                    res.status(400).json({
                        success: false,
                        message: "El costo de la actividad no puede ser nulo o 0"
                    });
                } else {

                    if (descripcion === undefined || descripcion === null || descripcion === "") {
                        const response = await pool.query('UPDATE actividad SET costo_actual_actividad = $1 WHERE codigo_servicio = $2 AND nro_actividad = $3  RETURNING *', [costo_actual_actividad, codigo_servicio, nro_actividad]);

                        res.status(200).json({
                            success: true,
                            message: "Actividad actualizada con exito",
                            items: response.rows
                        });

                        await pool.query('UPDATE servicio SET costo_hora_hombre = costo_hora_hombre - $1 WHERE codigo = $2', [costo_actual_a, codigo_servicio]);
                        await pool.query('UPDATE servicio SET costo_hora_hombre = costo_hora_hombre + $1 WHERE codigo = $2', [costo_actual_actividad, codigo_servicio]);
                    } else {
                        const response = await pool.query('UPDATE actividad SET descripcion = $1, costo_actual_actividad = $2 WHERE codigo_servicio = $3 AND nro_actividad = $4 RETURNING *', [descripcion, costo_actual_actividad, codigo_servicio, nro_actividad]);
                        res.status(200).json({
                            success: true,
                            message: "Actividad actualizada con exito",
                            items: response.rows
                        });

                        await pool.query('UPDATE servicio SET costo_hora_hombre = costo_hora_hombre - $1 WHERE codigo = $2', [costo_actual_a, codigo_servicio]);
                        await pool.query('UPDATE servicio SET costo_hora_hombre = costo_hora_hombre + $1 WHERE codigo = $2', [costo_actual_actividad, codigo_servicio]);
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
    updateActivity
}
