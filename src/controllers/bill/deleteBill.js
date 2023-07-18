const {pool} = require('../../databases/db');

const deleteBill = async (req, res) => {
    try {
        const nro_factura = req.params.nro_factura;
        const verify = await pool.query('SELECT * FROM facturas WHERE nro_factura = $1', [nro_factura]);

        if(verify.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No existe una factura con este numero"
            });
        } else {
            await pool.query('DELETE FROM facturas WHERE nro_factura = $1', [nro_factura]);
            res.status(200).json({
                success: true,
                message: "Factura eliminada con exito"
            });
        }
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Ha ocurrido un problema ${error.message}`
        });
        console.log(error);
    }
}

module.exports = {
    deleteBill
}