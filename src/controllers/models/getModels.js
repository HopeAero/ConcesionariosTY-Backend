const {pool} = require('./../../databases/db');

const getModels = async (req, res) => {
    try {
        const { page = 1, size = 10 } = req.query;

        const offset = (page - 1) * size;
        const limit = size;

        const countResponse = await pool.query('SELECT COUNT(*) FROM modelo');
        const count = parseInt(countResponse.rows[0].count);

        const response = await pool.query('SELECT * FROM modelo ORDER BY codigo OFFSET $1 LIMIT $2', [offset, limit]);

        const totalPages = Math.ceil(count / size);

        res.status(200).json({
            success: true,
            message: "Modelos recuperados con éxito",
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

const getModelByCI = async (req, res) => {
    try {
        const cod = req.params.cod;
        const response = await pool.query('SELECT * FROM modelo WHERE codigo = $1', [cod]);

        if (response.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe un modelo con este codigo",
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Modelo recuperado con exito",
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

const getAllModels = async (req, res) => {
    try {
        const response = await pool.query('SELECT * FROM modelo');

        res.status(200).json({
            success: true,
            message: "Modelos recuperados con exito",
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

module.exports = {
    getModels,
    getModelByCI,
    getAllModels
}