const {pool} = require('./../../databases/db');

const getVehicles = async (req, res) => {
    try {
        const { page = 1, size = 10 } = req.query;

        const offset = (page - 1) * size;
        const limit = size;

        const countResponse = await pool.query('SELECT COUNT(*) FROM vehiculo');
        const count = parseInt(countResponse.rows[0].count);

        const response = await pool.query('SELECT * FROM vehiculo ORDER BY placa OFFSET $1 LIMIT $2', [offset, limit]);

        const totalPages = Math.ceil(count / size);

        res.status(200).json({
            success: true,
            message: "Vehiculos recuperados con éxito",
            paginate: {
                total: count,
                page: page,
                pages: totalPages,
                perPage: size
            },
            items: response.rows
        });    
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Ha ocurrido un problema",
        });
        console.log(error);    
    }
    
}

const getVehicleByCI = async (req, res) => {
    try {
        const placa = req.params.placa;
        const response = await pool.query('SELECT * FROM vehiculo WHERE placa = $1', [placa]);

        if (response.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe un vehiculo con este placa",
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Vehiculo recuperado con exito",
                items: response.rows
            });
        }

    } catch(error) {
        res.status(500).json({
            success: false,
            message: "Ha ocurrido un problema",
        });
        console.log(error);
    }
}

const getAllVehicles = async (req, res) => {
    try {
        const response = await pool.query('SELECT * FROM vehiculo');

        res.status(200).json({
            success: true,
            message: "Vehiculos recuperados con exito",
            items: response.rows
        });

    } catch(error) {
        res.status(500).json({
            success: false,
            message: "Ha ocurrido un problema",
        });
        console.log(error);
    }
}

const getVehicleByModels = async (req, res) => {
    try {
        const codigo_modelo = req.params.codigo_modelo;
        const response = await pool.query('SELECT * FROM vehiculo WHERE codigo_modelo = $1', [codigo_modelo]);

        if (response.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe un vehiculo con este codigo de modelo",
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Vehiculos recuperado con exito",
                items: response.rows
            });
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
    getVehicles,
    getVehicleByCI,
    getAllVehicles,
    getVehicleByModels
}