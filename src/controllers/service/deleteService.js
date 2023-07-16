const {pool} = require('../../databases/db');

const deleteService = async (req, res) => {
    try {
        const codigo = req.params.code;
        const verify = await pool.query('SELECT * FROM servicio WHERE codigo = $1', [codigo]);
        const verify2 = await pool.query('SELECT * FROM actividad WHERE codigo_servicio = $1', [codigo]);

        if (verify.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe servicio con este codigo",
            });
        } else {
            if (verify2.rows.length !==0) {
                res.status(404).json({
                    success: false,
                    message: "No se puede eliminar el servicio porque tiene actividades asociadas",
                });
            } else {
                await pool.query('DELETE FROM servicio WHERE codigo = $1', [codigo]);
                res.status(200).json({
                    success: true,
                    message: "Servicio eliminado con exito",
                });
            }
        }
        
    } catch(error) {
        res.status(500).json({
            success: false,
            message: "Ha ocurrido un problema",
        });
        console.log(error);
    }
}

module.exports = {
    deleteService
}