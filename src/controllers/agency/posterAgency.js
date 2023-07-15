const {pool} = require('./../../databases/db');

const posterAgency = async (req, res) => {
    try {
        const rif = req.body.rif;
        const id_estado = req.body.id_estado;
        const nro_ciudad = req.body.nro_ciudad;
        const verify = await pool.query('SELECT * FROM agencia WHERE rif = $1', [rif]);

        if (verify.rows.length !== 0) {
            res.status(404).json({
                success: false,
                message: "Ya existe agencia con este rif",
            });
        } else {
            const verify2 = await pool.query('SELECT * FROM estado WHERE id = $1', [id_estado]);
            const verify3 = await pool.query('SELECT * FROM ciudad WHERE nro_ciudad = $1 AND id_estado = $2', [nro_ciudad, id_estado]);
            if (verify2.rows.length === 0) {
                res.status(404).json({
                    success: false,
                    message: "No existe estado con este id",
                });
            } else {
                if (verify3.rows.length === 0) {
                    res.status(404).json({
                        success: false,
                        message: "No existe ciudad con este numero y este estado",
                    });
                } else {
                    const {razon_social} = req.body;
                    const response = await pool.query('INSERT INTO agencia (rif, razon_social, id_estado, nro_ciudad) VALUES ($1, $2, $3, $4) RETURNING *', [rif, razon_social, id_estado, nro_ciudad]);
                    res.status(200).json({
                        success: true,
                        message: "Agencia insertada con exito",
                        items: response.rows
                    });
                }
            }

        }

    } catch(error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Ha ocurrido un problema",
        });
    }
}

module.exports = {
    posterAgency
}