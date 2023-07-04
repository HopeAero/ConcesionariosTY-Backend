const {pool} = require('./../../databases/db');

const updateClient = async (req, res) => {
    try {   
            const ci_cliente = req.params.ci;
            const telefonoPrincipal = req.body.telefono_principal;
            const telefonoSecundario = req.body.telefono_secundario;
            const verifyPhone = await pool.query('SELECT * FROM cliente WHERE telefono_principal = $1', [telefonoPrincipal]);
            const verify = verifyPhone.rows.find(element => {
                return element;
            });

            if (verifyPhone.rows.length !== 0 && verify.ci_cliente !== ci_cliente) {
                res.status(404).json({
                    success: false,
                    message: "Ya existe cliente con este telefono",
                });

            } else {
                if (telefonoSecundario !== undefined && telefonoSecundario !== null) {
                    const verifyPhone2 = await pool.query('SELECT * FROM cliente WHERE telefono_secundario = $1', [telefonoSecundario]);
                    const verify2 = verifyPhone2.rows.find(element => {
                        return element;
                    });

                    if (verifyPhone2.rows.length !== 0 && verify2.ci_cliente !== ci_cliente) {
                        res.status(404).json({
                            success: false,
                            message: "Ya existe cliente con este telefono",
                        });
                    }
                } else {
                    const {nombre, direccion, telefono_principal, telefono_secundario, correo_electronico, es_frecuente} = req.body;
                    const response = await pool.query(
                    'UPDATE cliente SET nombre = $1, direccion = $2, telefono_principal = $3, telefono_secundario = $4, correo_electronico = $5, es_frecuente = $6 WHERE ci_cliente = $7 RETURNING *', [nombre, direccion, telefono_principal, telefono_secundario, correo_electronico, es_frecuente, ci_cliente]);
    
                    res.status(200).json({
                        success: true,
                        message: "Cliente actualizado con exito",
                        items: response.rows
                    });  
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
    updateClient
}
