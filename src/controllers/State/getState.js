const {pool} = require('./../../databases/db');

const getState = async (req, res) => {
    const { page = 1, size = 10 } = req.query;

    const offset = (page - 1) * size;
    const limit = size;

    const countResponse = await pool.query('SELECT COUNT(*) FROM estado');
    const count = parseInt(countResponse.rows[0].count);

    const response = await pool.query('SELECT * FROM estado ORDER BY id OFFSET $1 LIMIT $2', [offset, limit]);

    const totalPages = Math.ceil(count / size);

    res.status(200).json({
        success: true,
        message: "Estados recuperados con éxito",
        paginate: {
            total: count,
            page: page,
            pages: totalPages,
            perPage: size
        },
        items: response.rows
    });
}

const getStateById = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await pool.query('SELECT * FROM estado WHERE id = $1', [id]);

        if (response.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe un Estado con este id",
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Estado recuperado con exito",
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
    getState,
    getStateById
}
