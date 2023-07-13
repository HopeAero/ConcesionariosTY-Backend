const {pool} = require('../../databases/db');

const updateVehicle = async (req, res) => {
    try {
        const placa = req.params.placa;
        const ci_cliente = req.body.ci_cliente;
        const cod_modelo = req.body.codigo_modelo;

        const verify = await pool.query('SELECT * FROM vehiculo WHERE placa = $1', [placa]);
        if (verify.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe vehiculo con esta placa",
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
                    const response = await pool.query('UPDATE vehiculo SET año_salida = $1, nro_de_serial = $2, nro_de_motor = $3, concesionario_vendido = $4, color = $5, fecha_de_venta = $6, ci_cliente = $7, codigo_modelo = $8 WHERE placa = $9  RETURNING *', [año_salida, nro_de_serial, nro_de_motor, concesionario_vendido, color, fecha_de_venta, ci_cliente, cod_modelo, placa]);

                     res.status(200).json({
                        success: true,
                        message: "Vehiculo actualizado con éxito",
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
};

module.exports = {
    updateVehicle
}