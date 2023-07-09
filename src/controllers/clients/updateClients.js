const {pool} = require('./../../databases/db');

const updateClient = async (req, res) => {
    try {   
            const ci_cliente = req.params.ci;
            const telefonoPrincipal = req.body.telefono_principal;
            const telefonoSecundario = req.body.telefono_secundario === '' ? null : req.body.telefono_secundario;

            if (telefonoPrincipal === '' || telefonoPrincipal === undefined) {
                res.status(404).json({
                    success: true,
                    message: "Telefono principal ingresado no puede ser nulo",
                    items: response.rows
                });
            } else {
                if (telefonoSecundario !== null && telefonoSecundario.length > 11){
                    res.status(404).json({
                        success: false,
                        message: "Telefono secundario debe tener maximo 11 digitos",
                    });
                } else {
                    if (telefonoPrincipal === null && telefonoSecundario === null) {
                        const {nombre, direccion, correo_electronico, es_frecuente} = req.body;
                        const response = await pool.query(
                            'UPDATE cliente SET nombre = $1, direccion = $2, correo_electronico = $3, es_frecuente = $4 WHERE ci_cliente = $5 RETURNING *', [nombre, direccion,correo_electronico, es_frecuente, ci_cliente]);
            
                        res.status(200).json({
                            success: true,
                            message: "Cliente actualizado con exito",
                            items: response.rows
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
                                const {nombre, direccion, telefono_principal, telefono_secundario, correo_electronico, es_frecuente} = req.body;
                                const response = await pool.query(
                                'UPDATE cliente SET nombre = $1, direccion = $2, telefono_principal = $3, telefono_secundario = $4, correo_electronico = $5, es_frecuente = $6 WHERE ci_cliente = $7 RETURNING *', [nombre, direccion, telefono_principal, telefono_secundario, correo_electronico, es_frecuente, ci_cliente]);
                
                                res.status(200).json({
                                    success: true,
                                    message: "Cliente actualizado con exito",
                                    items: response.rows
                                });  
                            }  
                        } else {
                            const {nombre, direccion, telefono_principal, correo_electronico, es_frecuente} = req.body;
                            const response = await pool.query(
                                'UPDATE cliente SET nombre = $1, direccion = $2, telefono_principal = $3, correo_electronico = $4, es_frecuente = $5 WHERE ci_cliente = $6 RETURNING *', [nombre, direccion, telefono_principal, correo_electronico, es_frecuente, ci_cliente]);
                                res.status(200).json({
                                    success: true,
                                    message: "Cliente actualizado con exito",
                                    items: response.rows
                                });
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
    updateClient
}
