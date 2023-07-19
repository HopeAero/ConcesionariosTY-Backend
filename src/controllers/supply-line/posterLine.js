const {pool} = require('../../databases/db');

const posterLine = async (req, res) => {
    try {
        const codigo = req.body.codigo;
        const verify = await pool.query('SELECT * FROM linea_suministro WHERE codigo = $1', [codigo]);

        if (verify.rows.length !== 0) {
            res.status(404).json({
                success: false,
                message: "Ya existe linea de suministro con este codigo",
            });
        } else {
            const {descripcion} = req.body;
            const response = await pool.query('INSERT INTO linea_suministro (codigo, descripcion) VALUES ($1, $2) RETURNING *', [codigo, descripcion]);
            res.status(200).json({
                success: true,
                message: "Linea de suministro insertada con exito",
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
    posterLine
}

