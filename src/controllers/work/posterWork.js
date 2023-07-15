const {pool} = require('./../../databases/db');

const posterWork = async (req, res) => {
    try {
        const {rif_agencia, ci_empleado} = req.body;
        const verify = await pool.query('SELECT * FROM agencia WHERE rif = $1', [rif_agencia]);
        const verify2 = await pool.query('SELECT * FROM empleado WHERE ci_empleado = $1', [ci_empleado]);
        const verify3 = await pool.query('SELECT * FROM trabaja WHERE rif_agencia = $1 AND ci_empleado = $2', [rif_agencia, ci_empleado]);
        if (verify.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe agencia con este rif",
            });
        } else {
            if (verify2.rows.length === 0) {
                res.status(404).json({
                    success: false,
                    message: "No existe empleado con esta cedula",
                });
            } else {
                if (verify3.rows.length !== 0) {
                    res.status(400).json({
                        success: false,
                        message: "Ya existe trabajador con este rif de agencia y esta cedula",
                    });
                } else {
                    const response = await pool.query('INSERT INTO trabaja (rif_Agencia, ci_empleado) VALUES ($1, $2) RETURNING *', [rif_agencia, ci_empleado]);
                    res.status(200).json({
                        success: true,
                        message: 'Trabajador asignado correctamente',
                        items: response.rows
                    });
                }
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: `Ha ocurrido un problema ${error.message}`,
        })
    }
}

module.exports = {
    posterWork
}