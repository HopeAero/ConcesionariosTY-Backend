const {pool} = require('../../databases/db');

const posterVehicles = async (req, res) => {
    try {
        const placa = req.body.placa;
        const ci_cliente = req.body.ci_cliente;
        const cod_modelo = req.body.codigo_modelo;
        const verify = await pool.query('SELECT * FROM vehiculo WHERE placa = $1', [placa]);

        if (verify.rows.length !== 0) {
            res.status(404).json({
                success: false,
                message: "Ya existe un vehiculo con esta placa",
            });
        } else {
            const validate = await pool.query('SELECT * FROM cliente WHERE ci_cliente = $1', [ci_cliente]);
            
            if (validate.rows.length === 0) {
                res.status(404).json({
                    success: false,
                    message: "Debe colocar la cedula de un cliente existente",
                });
            } else {
                const validate2 = await pool.query('SELECT * FROM modelo WHERE codigo = $1', [cod_modelo]);
                
                if (validate2.rows.length === 0) {
                    res.status(404).json({
                        success: false,
                        message: "Debe colocar el codigo de un modelo existente",
                    });
                } else {
                    const {año_salida, nro_de_serial, nro_de_motor, concesionario_vendido, color, fecha_de_venta } = req.body;
                    const response = await pool.query('INSERT INTO vehiculo (placa, año_salida, nro_de_serial, nro_de_motor, concesionario_vendido, color, fecha_de_venta, ci_cliente, codigo_modelo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *', [placa, año_salida, nro_de_serial, nro_de_motor, concesionario_vendido, color, fecha_de_venta, ci_cliente, cod_modelo]);
                    res.status(200).json({
                        success: true,
                        message: "Vehiculo insertado con exito",
                        items: response.rows
                    });
                }
            }

        }

    } catch(error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Ha ocurrido un problema",
        });
    }
}

module.exports = {
    posterVehicles
}