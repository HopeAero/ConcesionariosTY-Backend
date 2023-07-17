const { pool } = require('./../../databases/db');

const deleteMaintenance = async (req, res) => {
    try {
        const placa_vehiculo = req.params.placa_vehiculo;
        const verify = await pool.query('SELECT * FROM MANTENIMIENTO_RECOMENDADO WHERE placa_vehiculo = $1', [placa_vehiculo]);
        if (verify.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe mantenimiento con este codigo",
            });
        } else {
            await pool.query('DELETE FROM MANTENIMIENTO_RECOMENDADO WHERE placa_vehiculo = $1', [placa_vehiculo]);
            res.status(200).json({
                success: true,
                message: "Mantenimientos eliminado con exito de un vehiculo",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: `Ha ocurrido un problema ${error.message}`
        });
    }
}

const deleteMaintenanceService = async (req, res) => {
    try {
        const codigo_servicio = req.params.codigo_servicio;
        const placa_vehiculo = req.params.placa_vehiculo;
        const verify = await pool.query('SELECT * FROM MANTENIMIENTO_RECOMENDADO WHERE placa_vehiculo = $1 AND codigo_servicio = $2', [placa_vehiculo, codigo_servicio]);
        if (verify.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe mantenimiento con este codigo y placa",
            });
        } else {
            await pool.query('DELETE FROM MANTENIMIENTO_RECOMENDADO WHERE codigo_servicio = $1 AND placa_vehiculo = $2', [codigo_servicio, placa_vehiculo]);
            res.status(200).json({
                success: true,
                message: "Mantenimiento eliminado con exito de un vehiculo",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: `Ha ocurrido un problema ${error.message}`
        });
    }
}

module.exports = {
    deleteMaintenance,
    deleteMaintenanceService
}