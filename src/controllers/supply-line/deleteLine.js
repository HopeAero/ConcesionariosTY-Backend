const {pool} = require('../../databases/db');

const deleteLine = async (req, res) => {
    try {
        const codigo = req.params.codigo;
        const verify = await pool.query('SELECT * FROM linea_suministro WHERE codigo = $1', [codigo]);

        if (verify.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe esta linea de suministro con este codigo",
            });
        } else {
            await pool.query('DELETE FROM linea_suministro WHERE codigo = $1', [codigo]);
            res.status(200).json({
                success: true,
                message: "Linea de suministro eliminada con exito",
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Ha ocurrido un problema",
            items: error
        });
    }
}

module.exports = {
    deleteLine
}
