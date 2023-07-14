const {pool} = require('../../databases/db');

const deleteProduct = async (req, res) => {
    try {
        const codigo = req.params.codigo;
        const codigo_linea_s = req.params.codigo_linea_s;

        const response = await pool.query('DELETE FROM producto WHERE codigo = $1 AND codigo_linea_s = $2', [codigo, codigo_linea_s]);

        if (response.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "No existe producto con este codigo de suministro o al contrario",
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Producto eliminado con exito",
            });
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
    deleteProduct
}