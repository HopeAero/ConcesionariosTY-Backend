const {pool} = require('./../../databases/db');

const updaterManager = async (req, res) => {
    try {
        const ci_empleado = req.params.ci;
        const telefono_secundario = req.body.telefono_secundario !== undefined ? req.body.telefono_secundario : null;

        const tlfVerify = await pool.query('SELECT * FROM encargado WHERE telefono_secundario = $1', [telefono_secundario]);
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
                const tlfresult = !tlfVerify.rows.some((element) => element.telefono_secundario === telefono_secundario);
                        if (tlfresult === false) {
                            res.status(404).json({
                                success: false,
                                message: "Ya existe un encargado con este numero de telefono secundario",
                            });
                        } else {
                           const {correo_electronico, rif_agencia} = req.body;
                           const rifverify = await pool.query('SELECT * FROM encargado WHERE rif_agencia = $1', [rif_agencia]);
                           if (rifverify.rows.length !==0) {
                            res.status(404).json({
                                success: false,
                                message: "Ya existe un encargado con este rif",
                            });
                            } else {
                                const response = await pool.query(
                                    'UPDATE encargado SET telefono_secundario = $1, correo_electronico = $2, rif_agencia = $3 WHERE ci_empleado = $4 RETURNING *', [telefono_secundario, correo_electronico, rif_agencia, ci_empleado]);
                                    res.status(200).json({
                                        success: true,
                                        message: "Encargado actualizado con exito",
                                        items: response.rows
                                    });
                            }
                        }
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
    updaterManager
}