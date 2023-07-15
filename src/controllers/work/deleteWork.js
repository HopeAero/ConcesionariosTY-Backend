const {pool} = require('./../../databases/db');

const deleteWork = async (req, res) => {
    try {
        const rif_agencia = req.params.rif;
        const ci_empleado = req.params.ci;
        const verify = await pool.query('SELECT * FROM trabaja WHERE rif_agencia = $1 AND ci_empleado = $2', [rif_agencia, ci_empleado]);
        if (verify.rows.length === 0) {
            res.status(404).json({  
                success: false,
                message: "No existe trabajador con este rif de agencia y esta cedula",
            });
        } else {
            const response = await pool.query('DELETE FROM trabaja WHERE rif_agencia = $1 AND ci_empleado = $2', [rif_agencia, ci_empleado]);
            res.status(200).json({
                success: true,
                message: 'Trabajador eliminado correctamente',
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: `Ha ocurrido un problema ${error.message}`,
        })
    }
}

module.exports = {
    deleteWork
}