const {pool} = require('./../../databases/db');

const deleteManager = async (req, res) => {
    try {
        const ci_empleado = req.params.ci;
        const verify = await pool.query('SELECT * FROM empleado WHERE ci_empleado = $1', [ci_empleado]);
        const verify2 = await pool.query('SELECT * FROM encargado WHERE ci_empleado = $1', [ci_empleado]);
        if (verify.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe empleado con esta cedula de identidad",
            });
         } else {
            if (verify2.rows.length === 0) {
                res.status(404).json({
                    success: false,
                    message: "No existe encargado con esta cedula de identidad"
                })
            } else {
                const response = await pool.query('DELETE FROM encargado WHERE ci_empleado = $1', [ci_empleado]);
                res.status(200).json({
                    success: true,
                    message: "Encargado eliminado con exito",
                    items: response.rows
                });
            }
         }
    } catch (error) {
        res.status(500).json({
            status: false,
            message: "Ha ocurrido un problema"
        })
    }
}

module.exports = {
    deleteManager
}