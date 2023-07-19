const {pool} = require('../../databases/db');

const deleteServiceOrder = async (req, res) => {
    try {
        const cod = req.params.cod;
        const verify = await pool.query('SELECT * FROM orden_de_servicio WHERE codigo = $1', [cod]);
         if (verify.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe orden de servicio con este codigo",
            });
        } else {
            const validate = await pool.query('SELECT * FROM factura WHERE codigo_orden_servicio = $1', [cod]);
            if (validate.rows.length !== 0) {
                res.status(404).json({
                    success: false,
                    message: "No se puede borrar esta orden de servicio porque esta presente en alguna factura ",
                });
            }else{
                const validate2 = await pool.query('SELECT * FROM detalla WHERE codigo_orden_servicio = $1', [cod]);
                if (validate2.rows.length !== 0) {
                res.status(404).json({
                    success: false,
                    message: "No se puede borrar esta orden de servicio porque esta presente en la relacion detalla ",
                });
                }else{
                    await pool.query('DELETE FROM orden_de_servicio WHERE codigo = $1', [cod]);
                    res.status(200).json({
                        success: true,
                        message: "Orden de servicio eliminada con exito",
                    });
                }
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
    deleteServiceOrder
}
