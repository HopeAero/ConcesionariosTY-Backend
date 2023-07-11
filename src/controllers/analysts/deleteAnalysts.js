const {pool} = require('../../databases/db');

const deleteAnalyst = async (req, res) => {
    try {
        const ci = req.params.ci;
        const verify = await pool.query('SELECT * FROM analista WHERE ci_empleado = $1', [ci]);
        if (verify.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe analista con esta cedula de identidad",
            });
        } else {
            await pool.query('DELETE FROM analista WHERE ci_empleado = $1', [ci]);
            res.status(200).json({
                success: true,
                message: "Analista eliminado con exito",
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
    deleteAnalyst
}
