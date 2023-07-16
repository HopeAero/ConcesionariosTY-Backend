const {pool} = require('./../../databases/db');

const posterModels = async (req, res) => {
    try {
        const cod = req.body.codigo;
        const verify = await pool.query('SELECT * FROM modelo WHERE codigo = $1', [cod]);

         if (verify.rows.length !== 0) {
            res.status(404).json({
                success: false,
                message: "Ya existe un modelo con este codigo",
            });
        } else {
            const {codigo, nombre, tipo_refrigerante, cantidad_puestos, peso, aceite_motor, gasolina_recomendada, marca} = req.body;
            const response = await pool.query('INSERT INTO modelo (codigo, nombre, tipo_refrigerante, cantidad_puestos, peso, aceite_motor, gasolina_recomendada, marca) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [codigo, nombre, tipo_refrigerante, cantidad_puestos, peso, aceite_motor, gasolina_recomendada, marca]);
            res.status(200).json({
                success: true,
                message: "Modelo insertado con exito",
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
    posterModels
}