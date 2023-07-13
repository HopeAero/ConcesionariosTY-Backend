const {pool} = require('./../../databases/db');

const updateModel = async (req, res) => {
    try {
        const cod = req.params.cod;
        
        const verify = await pool.query('SELECT * FROM modelo WHERE codigo = $1', [cod]);
        if (verify.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe un modelo con este codigo",
            });
        } else {
            const { nombre, tipo_refrigerante, cantidad_puestos, peso, aceite_motor, gasolina_recomendada, marca} = req.body;
            const response = await pool.query('UPDATE modelo SET nombre = $1, tipo_refrigerante = $2, cantidad_puestos = $3, peso = $4, aceite_motor = $5, gasolina_recomendada = $6, marca = $7 WHERE codigo = $8  RETURNING *', [nombre, tipo_refrigerante, cantidad_puestos, peso, aceite_motor, gasolina_recomendada, marca, cod]);

            res.status(200).json({
                success: true,
                message: "Modelo actualizado con éxito",
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
};

module.exports = {
    updateModel
}