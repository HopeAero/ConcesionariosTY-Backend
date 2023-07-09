const {pool} = require('./../../databases/db');

const updateState = async (req, res) => {
    try {
        const id = req.params.id;
        const { nombre } = req.body;
        
        const verify = await pool.query('SELECT * FROM estado WHERE id = $1', [id]);
        if (verify.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe Estado con este id",
            });
        } else {
            const response = await pool.query('UPDATE estado SET nombre = $1 WHERE id = $2  RETURNING *', [nombre, id]);

            res.status(200).json({
                success: true,
                message: "Estado actualizado con éxito",
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
    updateState
}