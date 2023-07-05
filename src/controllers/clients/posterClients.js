const {pool} = require('./../../databases/db');

const posterClients = async (req, res) => {
    try {
        const ci = req.body.ci_cliente;
        const verify = await pool.query('SELECT * FROM cliente WHERE ci_cliente = $1', [ci]);

         if (verify.rows.length !== 0) {
            res.status(404).json({
                success: false,
                message: "Ya existe cliente con esta cedula de identidad",
            });
        } else {
            const telefonoPrincipal = req.body.telefono_principal;
            const telefonoSecundario = req.body.telefono_secundario;
            const verifyPhone = await pool.query('SELECT * FROM cliente WHERE telefono_principal = $1', [telefonoPrincipal]);
            if (verifyPhone.rows.length !== 0) {
                res.status(404).json({
                    success: false,
                    message: "Ya existe cliente con este telefono",
                });
            } else {
                if (telefonoSecundario !== null) {
                    const verifyPhone2 = await pool.query('SELECT * FROM cliente WHERE telefono_secundario = $1', [telefonoSecundario]);
                    console.log(verifyPhone2.rows.length);                
                    if (verifyPhone2.rows.length !== 0 ) {
                        res.status(404).json({
                            success: false,
                            message: "Ya existe cliente con este telefono",
                        });
                    } else {
                        const {ci_cliente, nombre, direccion, telefono_principal, telefono_secundario, correo_electronico, es_frecuente} = req.body;
                        const response = await pool.query('INSERT INTO cliente (ci_cliente, nombre, direccion, telefono_principal, telefono_secundario, correo_electronico, es_frecuente) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [ci_cliente, nombre, direccion, telefono_principal, telefono_secundario, correo_electronico, es_frecuente]);

                        res.status(200).json({
                            success: true,
                            message: "Cliente insertado con exito",
                            items: response.rows
                        });

                    }
                } else {
                    const {ci_cliente, nombre, direccion, telefono_principal, telefono_secundario, correo_electronico, es_frecuente} = req.body;
                    const response = await pool.query('INSERT INTO cliente (ci_cliente, nombre, direccion, telefono_principal, telefono_secundario, correo_electronico, es_frecuente) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [ci_cliente, nombre, direccion, telefono_principal, telefono_secundario, correo_electronico, es_frecuente]);

                    res.status(200).json({
                        success: true,
                        message: "Cliente insertado con exito",
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
    posterClients
}