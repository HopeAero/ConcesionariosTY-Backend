const { pool } = require('./../../databases/db');

const getMaintenancePaginate = async (req, res) => {
    try {
        const { page = 1, size = 10 } = req.query;

        const offset = (page - 1) * size;
        const limit = size;

        const countResponse = await pool.query('SELECT COUNT(*) FROM MANTENIMIENTO_RECOMENDADO');
        const count = parseInt(countResponse.rows[0].count);

        const response = await pool.query('SELECT * FROM MANTENIMIENTO_RECOMENDADO ORDER BY placa_vehiculo OFFSET $1 LIMIT $2', [offset, limit]);

        const totalPages = Math.ceil(count / size);

        res.status(200).json({
            success: true,
            message: "Mantenimientos recomendados recuperadas con éxito",
            paginate: {
                total: count,
                page: page,
                pages: totalPages,
                perPage: size
            },
            items: response.rows
        });    
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: `Ha ocurrido un problema ${error.message}`
        });
    }
}

const getMaintenancePlaca = async (req, res) => {
    try {
        const placa_vehiculo = req.params.placa_vehiculo;
        const response = await pool.query('SELECT * FROM MANTENIMIENTO_RECOMENDADO WHERE placa_vehiculo = $1', [placa_vehiculo]);

        if (response.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe mantenimiento recomendado con esta placa",
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Mantenimiento recomendado de un vehiculo recuperado con exito",
                items: response.rows
            });
        }

    } catch(error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: `Ha ocurrido un problema ${error.message}`
        });
    }
}

const getMaintenanceAll = async (req, res) => {
    try {
        const response = await pool.query('SELECT * FROM MANTENIMIENTO_RECOMENDADO');

        res.status(200).json({
            success: true,
            message: "Mantenimientos recomendados recuperados con éxito",
            items: response.rows
        });    
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: `Ha ocurrido un problema ${error.message}`
        });
    }
}

module.exports = {
    getMaintenancePaginate,
    getMaintenancePlaca,
    getMaintenanceAll
}