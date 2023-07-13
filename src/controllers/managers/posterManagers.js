const {pool} = require('./../../databases/db');

const posterManagers = async (req, res) => {
    try {
        const {ci_empleado, telefono_secundario, correo_electronico, rif_agencia} = req.body;

        const tlfVerify = await pool.query('SELECT * FROM encargado WHERE telefono_secundario = $1', [telefono_secundario]);
        const tlfVerify2 = await pool.query('SELECT * FROM empleado WHERE telefono_principal = $1', [telefono_secundario]);
        const rifverify = await pool.query('SELECT * FROM encargado WHERE rif_agencia = $1', [rif_agencia]);
        const verify = await pool.query('SELECT * FROM encargado WHERE ci_empleado = $1', [ci_empleado]);
        const verify2 = await pool.query('SELECT * FROM empleado WHERE ci_empleado = $1', [ci_empleado]);
        const verify3 = await pool.query('SELECT * FROM agencia WHERE rif = $1', [rif_agencia]);


            if (verify.rows.length !== 0) {
            res.status(404).json({
                success: false,
                message: "Ya existe un encargado con esta cedula de identidad",
            });
        } else {
            if (verify2.rows.length === 0) {
                res.status(404).json({
                    success: false,
                    message: "No existe un empleado con esta cedula de identidad",
                });
            } else {
                const result = verify2.rows.some((element) => element.tipo_empleado === 'encargado' || element.tipo_empleado === 'Encargado');

                if (result === false) {
                    res.status(404).json({
                        success: false,
                        message: "El empleado no es un encargado",
                    });
                } else {
                    if (verify3.rows.length === 0 ) {
                        res.status(404).json({
                            success: false,
                            message: "No existe agencia con este rif",
                        });
                    } else {
                        const tlfresult = !tlfVerify.rows.some((element) => element.telefono_secundario === telefono_secundario);

                        if (tlfresult === false) {
                            res.status(404).json({
                                success: false,
                                message: "Ya existe un encargado con este numero de telefono secundario",
                            });
                        } else {
                            const tlfresult2 = tlfVerify2.rows.every((element) => element.telefono_principal === null || element.telefono_principal !== telefono_secundario);

                            if (tlfresult2 === false) {
                                res.status(404).json({
                                    success: false,
                                    message: "Ya existe un empleado con este numero de telefono primario o secundario",
                                });
                            } else {
                                    if (rifverify.rows.length !==0) {
                                        res.status(404).json({
                                            success: false,
                                            message: "Ya existe un encargado con este rif",
                                        });
                                    } else {
                                        const response = await pool.query(`WITH ins AS (
                                            INSERT INTO encargado (ci_empleado, telefono_secundario, correo_electronico, rif_agencia) VALUES ($1, $2, $3, $4)
                                            RETURNING *
                                        )
                                        SELECT 
                                            i.*,
                                            e.nombre as nombre,
                                            e.cargo_ocupado as cargo_ocupado,
                                            e.direccion as direccion,e.sueldo as sueldo,
                                            e.telefono_principal as telefono_principal
                                        FROM ins i 
                                        JOIN empleado e ON i.ci_empleado = e.ci_empleado`, [ci_empleado, telefono_secundario, correo_electronico, rif_agencia]);
                    
                                        res.status(200).json({
                                            success: true,
                                            message: "Encargado insertado con exito",
                                            items: response.rows
                                        });
                                    }
                            }
                        }
                    }
                }
            }
        }   

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Ha ocurrido un problema"
        });
        console.log(error);
    }
}

module.exports = {
    posterManagers
}