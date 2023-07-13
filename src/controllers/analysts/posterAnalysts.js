const {pool} = require('../../databases/db');

const posterAnalysts = async (req, res) => {
    try {
        const {ci_empleado} = req.body;
        const verify = await pool.query('SELECT * FROM analista WHERE ci_empleado = $1', [ci_empleado]);
        const verify2 = await pool.query('SELECT * FROM empleado WHERE ci_empleado = $1', [ci_empleado]);
            if (verify.rows.length !== 0) {
            res.status(404).json({
                success: false,
                message: "Ya existe analista con esta cedula de identidad",
            });
            } else {
                if (verify2.rows.length === 0) {
                    res.status(404).json({
                        success: false,
                        message: "No existe empleado con esta cedula de identidad",
                    });
                } else {
                    const result = verify2.rows.forEach(async (element) => {
                        if (element.tipo_empleado !== 'analista' || element.tipo_empleado !== 'Analista') {
                            return false;
                        } else {
                            return true;
                        }
                    });

                    if (result === false) {
                        res.status(404).json({
                            success: false,
                            message: "El empleado no es un analista",
                        });
                    } else {
                        const response = await pool.query(`WITH ins AS (
                            INSERT INTO analista (ci_empleado) VALUES ($1)
                            RETURNING *
                        )
                        SELECT 
                            i.*,
                            e.nombre as nombre,
                            e.cargo_ocupado as cargo_ocupado,
                            e.direccion as direccion,
                            e.sueldo as sueldo,
                            e.telefono_principal as telefono_principal
                        FROM ins i 
                        JOIN empleado e ON i.ci_empleado = e.ci_empleado`, [ci_empleado]);

                        res.status(200).json({
                            success: true,
                            message: "Analista registrado con exito",
                            items: response.rows
                        });
                    }
                }
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
    posterAnalysts
}