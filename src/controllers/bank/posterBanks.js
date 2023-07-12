const { pool } = require("../../databases/db");

const posterBanks = async (req, res) => {
    try {
        const nro_tarjeta = req.body.nro_tarjeta;
        const verify = await pool.query(
            "SELECT * FROM banco WHERE nro_tarjeta = $1",
            [nro_tarjeta]
        );

        if (verify.rows.length !== 0) {
            res.status(404).json({
                success: false,
                message: "Ya se encuentra registrada la tarjeta",
            });
        } else {
            const {banco} = req.body;
            const response = await pool.query('INSERT INTO banco (nro_tarjeta, banco) VALUES ($1, $2) RETURNING *', [nro_tarjeta, banco]);

            res.status(200).json({
                success: true,
                message: "Tarjeta insertada con exito",
                items: response.rows
            }); 
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Ha ocurrido un problema",
        });
        console.log(error);
    }
};

module.exports = {
    posterBanks,
};
