const {pool} = require('./../../databases/db');

const getServiceOrder = async (req, res) => {
    try {
        const { page = 1, size = 10 } = req.query;

        const offset = (page - 1) * size;
        const limit = size;

        const countResponse = await pool.query('SELECT COUNT(*) FROM orden_de_servicio');
        const count = parseInt(countResponse.rows[0].count);

        const response = await pool.query('SELECT * FROM orden_de_servicio ORDER BY codigo OFFSET $1 LIMIT $2', [offset, limit]);

        const totalPages = Math.ceil(count / size);

        res.status(200).json({
            success: true,
            message: "Orden de servicios recuperadas con éxito",
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

const getServiceOrderByCI = async (req, res) => {
    try {
        const cod = req.params.cod;
        const response = await pool.query('SELECT * FROM orden_de_servicio WHERE codigo = $1', [cod]);

        if (response.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe orden de servicio con este codigo",
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Orden de servicio recuperada con exito",
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

const getAllServiceOrder = async (req, res) => {
    try {
        const response = await pool.query('SELECT * FROM orden_de_servicio');

        res.status(200).json({
            success: true,
            message: "Orden de servicios recuperadas con exito",
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
    getServiceOrder,
    getServiceOrderByCI,
    getAllServiceOrder
}