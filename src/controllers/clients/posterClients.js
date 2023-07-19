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
            const telefonoSecundario = req.body.telefono_secundario !== undefined && req.body.telefono_secundario !== '' ? req.body.telefono_secundario : null;            
            if (telefonoPrincipal === '' || telefonoPrincipal === undefined || telefonoPrincipal === null) {
                res.status(404).json({
                    success: false,
                    message: "Telefono principal no puede ser nulo",
                });
            } else if (telefonoSecundario !== null && telefonoSecundario.length > 11 ) {
                res.status(404).json({
                    success: false,
                    message: "Telefono secundario debe tener maximo 11 digitos",
                });
            } else {
                    if (telefonoSecundario !== null && telefonoSecundario !== undefined) {
                        if (telefonoPrincipal === telefonoSecundario) {
                            res.status(404).json({
                                success: false,
                                message: "El numero principal no puede ser igual al secundario",
                                items: response.rows
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
                            const response = await pool.query('INSERT INTO cliente (ci_cliente, nombre, direccion, telefono_principal, telefono_secundario, correo_electronico, es_frecuente) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [ci_cliente, nombre, direccion, telefono_principal,telefono_secundario, correo_electronico, es_frecuente]);
            
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