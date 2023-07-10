const {pool} = require('../../databases/db');

const deleteEmployee = async (req, res) => {
    try {
        const ci = req.params.ci;
        const verify = await pool.query('SELECT * FROM empleado WHERE ci_empleado = $1', [ci]);
         if (verify.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe empleado con esta cedula de identidad",
            });
        } else {
            await pool.query('DELETE FROM empleado WHERE ci_empleado = $1', [ci]);
            res.status(200).json({
                success: true,
                message: "Empleado eliminado con exito",
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
    deleteEmployee
}
