const {pool} = require('../../databases/db');

const deleteActivity = async (req, res) => {
    try {
        const nro_actividad = req.params.nro_actividad;
        const codigo_servicio = req.params.codigo_servicio;
        const verify = await pool.query('SELECT * FROM actividad WHERE nro_actividad = $1 AND codigo_servicio = $2', [nro_actividad, codigo_servicio]);
        const verify2 = await pool.query('SELECT * FROM servicio WHERE codigo = $1', [codigo_servicio]);
        let costo = req.body.costo;
        costo = parseInt(costo);

        if (verify.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe actividad con este numero y codigo de servicio",
            });
        } else {
            let costo_actual_a = verify.rows[0].costo_actual_actividad;
            let costo_hora_hombre = verify2.rows[0].costo_hora_hombre;
            if ((costo_hora_hombre- costo_actual_a ) === 0 || (costo_hora_hombre - costo_actual_a < 0) ) {
                    if (costo === 0 || costo === null || isNaN(costo) || costo === undefined || costo === "") {
                        res.status(409).json({
                            success: false,
                            message: "Esta actividad es la unica que tiene el servicio, por lo que no se puede eliminar si no ingresan un costo para el servicio"
                        })
                    } else {
                        const response = await pool.query('DELETE FROM actividad WHERE nro_actividad = $1 AND codigo_servicio = $2 RETURNING *', [nro_actividad, codigo_servicio]);
                        res.status(200).json({
                            success: true,
                            message: "Actividad eliminada con exito",
                            items: response.rows
                        });
                        await pool.query('UPDATE servicio SET costo_hora_hombre = $1 WHERE codigo = $2', [costo, codigo_servicio]);
                    }
            } else {
                const response = await pool.query('DELETE FROM actividad WHERE nro_actividad = $1 AND codigo_servicio = $2 RETURNING *', [nro_actividad, codigo_servicio]);
                res.status(200).json({
                    success: true,
                    message: "Actividad eliminada con exito",
                    items: response.rows
                });
                await pool.query('UPDATE servicio SET costo_hora_hombre = costo_hora_hombre - $1 WHERE codigo = $2', [costo_actual_a, codigo_servicio]);
            }
        }
    } catch(error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: `Ha ocurrido un problema ${error.message}`,
        });
    }
}

module.exports = {
    deleteActivity
}