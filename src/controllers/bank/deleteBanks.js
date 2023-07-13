const { pool } = require("../../databases/db");

const deleteBank = async (req, res) => {
    try {
        const nro_tarjeta = req.params.nro_tarjeta;

        const verify = await pool.query(
            "SELECT * FROM tarjeta WHERE nro_tarjeta = $1",
            [nro_tarjeta]
        );
        if (verify.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe registro de la tarjeta",
            });
        } else {
            await pool.query("DELETE FROM tarjeta WHERE nro_tarjeta = $1", [nro_tarjeta]);
            res.status(200).json({
                success: true,
                message: "Tarjeta eliminada con exito",
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
    deleteBank,
};
