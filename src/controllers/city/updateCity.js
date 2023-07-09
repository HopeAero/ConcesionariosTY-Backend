const {pool} = require('../../databases/db');

const updateCity = async (req, res) => {
    try {
        const nro_ciudad = req.params.nro_ciudad;
        const id_estado = req.params.id_estado;
        const {id_estadoNew, nombre} = req.body;

        const verify = await pool.query('SELECT * FROM estado WHERE id = $1', [id_estado]);
        const verify2 = await pool.query('SELECT * FROM estado WHERE id = $1', [id_estadoNew]);


        if (verify.rows.length === 0 || verify2.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe estado con este id",
            });

        } else {
            const response = await pool.query('UPDATE ciudad SET id_estado = $1, nombre = $2 WHERE nro_ciudad = $3 AND id_estado = $4 RETURNING *', [id_estadoNew, nombre, nro_ciudad, id_estado]);

            
                res.status(200).json({
                    success: true,
                    message: "Ciudad actualizada con exito",
                    items: response.rows
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
    updateCity
}