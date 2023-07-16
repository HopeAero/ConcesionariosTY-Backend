const {pool} = require('./../../databases/db');

const updateEmployee = async (req, res) => {
    try {   
            const ci_empleado = req.params.ci;
            const telefonoPrincipal = req.body.telefono_principal;

            const verify = await pool.query('SELECT * FROM empleado WHERE ci_empleado = $1', [ci_empleado]);
            if (verify.rows.length === 0) {
                res.status(404).json({
                    success: false,
                    message: "No existe empleado con esta cedula de identidad",
                });
            }else{
                const validate = await pool.query('SELECT * FROM empleado WHERE ci_empleado <> $1 AND telefono_principal = $2', [ci_empleado,telefonoPrincipal]);

                if (validate.rows.length !== 0) {
                    res.status(404).json({
                    success: false,
                    message: "Ya existe un empleado con este telefono",
                });
                }else{
                    if (telefonoPrincipal === '' || telefonoPrincipal === undefined || telefonoPrincipal === null) {
                        res.status(404).json({
                            success: true,
                            message: "Telefono principal ingresado no puede ser nulo"
                        });
                    } else {
                        if (telefonoPrincipal.length > 11){
                            res.status(404).json({
                                success: false,
                                message: "El telefono debe tener maximo 11 digitos",
                            });
                        } else {
                            const validate2 = await pool.query('SELECT * FROM analista WHERE ci_empleado = $1', [ci_empleado]);
                            const tipoEmp = req.body.tipo_empleado;

                            if (validate2.rows.length !== 0 && (tipoEmp !== 'ANALISTA' && tipoEmp !== 'analista' && tipoEmp !== 'Analista')) {
                                res.status(404).json({
                                    success: false,
                                    message: "Para editar el tipo de empleado, debe eliminarlo de la tabla analista",
                                });
                            }else{
                                const validate3 = await pool.query('SELECT * FROM encargado WHERE ci_empleado = $1', [ci_empleado]);
                                if (validate3.rows.length !== 0 && (tipoEmp !== 'ENCARGADO' && tipoEmp !== 'encargado' && tipoEmp !== 'Encargado')) {
                                    res.status(404).json({
                                        success: false,
                                        message: "Para editar el tipo de empleado, debe eliminarlo de la tabla encargado",
                                    });
                                }else{
                                    const {nombre, direccion, sueldo, telefono_principal, cargo_ocupado, tipo_empleado} = req.body;
                                    const response = await pool.query(
                                        'UPDATE empleado SET nombre = $1, direccion = $2, sueldo = $3, telefono_principal = $4, cargo_ocupado = $5, tipo_empleado = $6 WHERE ci_empleado = $7 RETURNING *', [nombre, direccion, sueldo, telefono_principal, cargo_ocupado, tipo_empleado, ci_empleado]);
                                    res.status(200).json({
                                        success: true,
                                        message: "Empleado actualizado con exito",
                                        items: response.rows
                                    });
                                }
                                
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
    updateEmployee
}
