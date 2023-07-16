const {pool} = require('../../databases/db');

const getService = async (req, res) => {
    try {
        const { page = 1, size = 10 } = req.query;

        const offset = (page - 1) * size;
        const limit = size;

        const countResponse = await pool.query('SELECT COUNT(*) FROM servicio');
        const count = parseInt(countResponse.rows[0].count);

        const response = await pool.query('SELECT * FROM servicio ORDER BY codigo OFFSET $1 LIMIT $2', [offset, limit]);

        const totalPages = Math.ceil(count / size);

        res.status(200).json({
            success: true,
            message: "Servicios recuperados con éxito",
            paginate: {
                total: count,
                page: page,
                pages: totalPages,
                perPage: size
            },
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

const getServiceByCode = async (req, res) => {
    try {
        const codigo = req.params.code;
        const response = await pool.query('SELECT * FROM servicio WHERE codigo = $1', [codigo]);

        if (response.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe servicio con este codigo",
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Servicio recuperado con exito",
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

const getAllServices = async (req, res) => {
    try {
        const response = await pool.query('SELECT * FROM servicio');

        res.status(200).json({
            success: true,
            message: "Servicios recuperados con éxito",
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
    getService,
    getServiceByCode,
    getAllServices
}