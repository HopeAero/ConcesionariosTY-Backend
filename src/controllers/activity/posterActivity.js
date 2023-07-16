const {pool} = require('../../databases/db');

const posterActivity = async (req, res) => {    
    try {
        const {codigo_servicio, descripcion, costo_actual_actividad} = req.body;
        let nro_actividad = await pool.query('SELECT COUNT(nro_actividad) FROM actividad WHERE codigo_servicio = $1', [codigo_servicio]);
        const verify = await pool.query('SELECT * FROM servicio WHERE codigo = $1', [codigo_servicio]);
        const verify2 = await pool.query('SELECT * FROM actividad WHERE codigo_servicio = $1', [codigo_servicio]);
        if (verify.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe servicio con este codigo",
            });
        } else {

            if (verify2.rows.length === 0) {
                nro_actividad = parseInt(nro_actividad.rows[0].count) + 1
                const response = await pool.query('INSERT INTO actividad (nro_actividad, codigo_servicio, descripcion, costo_actual_actividad) VALUES ($1, $2, $3, $4) RETURNING *', [nro_actividad, codigo_servicio, descripcion, costo_actual_actividad]);

                res.status(200).json({
                    success: true,
                    message: "Actividad creado con exito",
                    items: response.rows
                });

                await pool.query('UPDATE servicio SET costo_hora_hombre = $1 WHERE codigo = $2', [costo_actual_actividad, codigo_servicio]);
            } else {
                nro_actividad = parseInt(nro_actividad.rows[0].count) + 1;
                const response = await pool.query('INSERT INTO actividad (nro_actividad, codigo_servicio, descripcion, costo_actual_actividad) VALUES ($1, $2, $3, $4) RETURNING *', [nro_actividad, codigo_servicio, descripcion, costo_actual_actividad]);
                res.status(200).json({
                    success: true,
                    message: "Actividad creado con exito",
                    items: response.rows
                });

                await pool.query('UPDATE servicio SET costo_hora_hombre = costo_hora_hombre + $1 WHERE codigo = $2', [costo_actual_actividad, codigo_servicio]);
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
    posterActivity
}