const {pool} = require('../../databases/db');

const getPayments = async (req, res) => {
    try {
        const { page = 1, size = 10 } = req.query;

        const offset = (page - 1) * size;
        const limit = size;

        const countResponse = await pool.query('SELECT COUNT(*) FROM pago');
        const count = parseInt(countResponse.rows[0].count);

        const response = await pool.query('SELECT * FROM pago ORDER BY id OFFSET $1 LIMIT $2', [offset, limit]);

        const totalPages = Math.ceil(count / size);

        res.status(200).json({
            success: true,
            message: "Pagos recuperados con éxito",
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

const getPaymentByID = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await pool.query('SELECT * FROM pago WHERE id = $1', [id]);

        if (response.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe pago registrado con este código",
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Pago recuperado con éxito",
                items: response.rows
            });
        }

    } catch(error) {
        res.status(500).json({
            success: false,
            message: "Ha ocurrido un problema",
        });
    }
}

const getAllPayments = async (req, res) => {
    try {
        const response = await pool.query('SELECT * FROM pago');

        res.status(200).json({
            success: true,
            message: "Pagos recuperados con exito",
            items: response.rows
        });

    } catch(error) {
        res.status(500).json({
            success: false,
            message: "Ha ocurrido un problema",
        });
    }
}

module.exports = {
    getPayments,
    getPaymentByID,
    getAllPayments
}