const {pool} = require('../../databases/db');

const updateAnalyst = async (req, res) => {
    try {
        const ci_empleado = req.params.ci;
        const {nombre, direccion, sueldo, cargo_ocupado} = req.body;
        const telefono_principal = req.body.telefono_principal === undefined ? null : req.body.telefono_principal;
        const verify = await pool.query('SELECT * FROM analista WHERE ci_empleado = $1', [ci_empleado]);
        const verify2 = await pool.query('SELECT * FROM empleado WHERE ci_empleado = $1', [ci_empleado]);
        if (verify2.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe un empleado con esta cedula de identidad",
            });
        } else {
            if (verify.rows.length === 0) {
                res.status(404).json({
                    success: false,
                    message: "No existe un analista con esta cedula de identidad",
                });
            } else {
                const validate = await pool.query('SELECT * FROM empleado WHERE ci_empleado <> $1 AND telefono_principal = $2', [ci_empleado, telefono_principal]);

                if (validate.rows.length !== 0) {
                    res.status(404).json({
                    success: false,
                    message: "Ya existe un empleado con este telefono",
                });
            } else {
                if (telefono_principal === '' || telefono_principal === null) {
                    res.status(404).json({
                        success: false,
                        message: "Telefono principal no puede ser nulo",
                    });
                } else {
                    if (telefono_principal.length > 11) {
                        res.status(404).json({
                            success: false,
                            message: "El telefono debe tener maximo 11 digitos",
                        });
                    } else {
                        const response = await pool.query('UPDATE empleado SET nombre = $1, direccion = $2, sueldo = $3, telefono_principal = $4, cargo_ocupado = $5 WHERE ci_empleado = $6 RETURNING *', [nombre, direccion, sueldo, telefono_principal, cargo_ocupado, ci_empleado]);
                        res.status(200).json({
                            success: true,
                            message: "Analista actualizado con exito",
                            items: response.rows
                        });
                    }
                }
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
    updateAnalyst
}
