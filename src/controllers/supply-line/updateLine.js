const {pool} = require('../../databases/db');

const updateLine = async (req, res) => {
    try {
        const codigo = req.params.codigo;
        const verify = await pool.query('SELECT * FROM linea_suministro WHERE codigo = $1', [codigo]);
        if (verify.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe esta linea de suministro con este codigo",
            });
        } else {
            const {descripcion} = req.body;
            const response = await pool.query('UPDATE linea_suministro SET descripcion = $1 WHERE codigo = $2 RETURNING *', [descripcion, codigo]);
            res.status(200).json({
                success: true,
                message: "Linea de suministro actualizada con exito",
                items: response.rows
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
    updateLine
}
