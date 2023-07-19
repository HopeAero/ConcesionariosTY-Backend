const {pool} = require('./../../databases/db');

const posterEmployees = async (req, res) => {
    try {
        const ci = req.body.ci_empleado;
        const verify = await pool.query('SELECT * FROM empleado WHERE ci_empleado = $1', [ci]);

         if (verify.rows.length !== 0) {
            res.status(404).json({
                success: false,
                message: "Ya existe un empleado con esta cedula de identidad",
            });
        } else {
            const telefonoPrincipal = req.body.telefono_principal;
            
            if (telefonoPrincipal === '' || telefonoPrincipal === undefined || telefonoPrincipal === null) {
                res.status(404).json({
                    success: false,
                    message: "Telefono principal no puede ser nulo",
                });
            } else if (telefonoPrincipal.length > 11 ) {
                res.status(404).json({
                    success: false,
                    message: "El telefono debe tener maximo 11 digitos",
                });
            } else {
                const validate = await pool.query('SELECT * FROM empleado WHERE telefono_principal = $1', [telefonoPrincipal]);
                if(validate.rows.length !== 0){
                    res.status(404).json({
                        success: false,
                        message: "Ya existe un empleado con este telefono",
                    });
                }  else {
                const {ci_empleado, nombre, direccion, sueldo, telefono_principal, cargo_ocupado, tipo_empleado} = req.body;
                const response = await pool.query('INSERT INTO empleado (ci_empleado, nombre, direccion, sueldo, telefono_principal, cargo_ocupado, tipo_empleado) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [ci_empleado, nombre, direccion, sueldo, telefono_principal, cargo_ocupado, tipo_empleado]);
            
                res.status(200).json({
                    success: true,
                    message: "Empleado insertado con exito",
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
    posterEmployees
}