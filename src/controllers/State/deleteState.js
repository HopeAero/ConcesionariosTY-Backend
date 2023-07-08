const {pool} = require('./../../databases/db');

const deleteState = async (req, res) => {
    try {
        const id = req.params.id;

        const verify = await pool.query('SELECT * FROM estado WHERE id = $1', [id]);
         if (verify.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe Estado con este id",
            });
        } else {
            await pool.query('DELETE FROM estado WHERE id = $1', [id]);
            res.status(200).json({
                success: true,
                message: "Estado eliminado con exito",
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
    deleteState
}
