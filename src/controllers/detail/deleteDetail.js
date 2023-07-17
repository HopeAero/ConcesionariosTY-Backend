const { pool } = require('./../../databases/db');

const deleteDetail = async (req, res) => {
    try {
        const codigo_orden_servicio = req.params.codigo_servicio;
        const verify = await pool.query('SELECT * FROM DETALLA WHERE codigo_orden_servicio = $1', [codigo_orden_servicio]);
        if (verify.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe detalle de orden de servicio con este codigo",
            });
        } else {
            await pool.query('DELETE FROM DETALLA WHERE codigo_orden_servicio = $1', [codigo_orden_servicio]);
            res.status(200).json({
                success: true,
                message: "Detalle de orden de servicio eliminada con exito",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: `Ha ocurrido un problema ${error.message}`
        });
    }
}

module.exports = {
    deleteDetail
}