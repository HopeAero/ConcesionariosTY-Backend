const {pool} = require('../../databases/db');

const deleteVehicle = async (req, res) => {
    try {
        const placa = req.params.placa;
        const verify = await pool.query('SELECT * FROM vehiculo WHERE placa = $1', [placa]);
         if (verify.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe vehiculo con esta placa",
            });
        } else {
            const validate = await pool.query('SELECT * FROM orden_de_servicio WHERE placa_vehiculo = $1', [placa]);
            if (validate.rows.length !== 0) {
                res.status(404).json({
                    success: false,
                    message: "No se puede borrar este vehiculo porque esta presente en alguna orden de servicio ",
                });
            }else{
                const validate2 = await pool.query('SELECT * FROM reserva WHERE placa_vehiculo = $1', [placa]);
                if (validate2.rows.length !== 0) {
                res.status(404).json({
                    success: false,
                    message: "No se puede borrar este vehiculo porque esta presente en alguna reserva ",
                });
                }else{
                    await pool.query('DELETE FROM vehiculo WHERE placa = $1', [placa]);
                    res.status(200).json({
                        success: true,
                        message: "Vehiculo eliminado con exito",
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
    deleteVehicle
}
