const {pool} = require('./../../databases/db');

const getAgency = async (req, res) => {
    try {
        const { page = 1, size = 10 } = req.query;

        const offset = (page - 1) * size;
        const limit = size;

        const countResponse = await pool.query('SELECT COUNT(*) FROM agencia');
        const count = parseInt(countResponse.rows[0].count);

        const response = await pool.query('SELECT * FROM agencia ORDER BY rif OFFSET $1 LIMIT $2', [offset, limit]);

        const totalPages = Math.ceil(count / size);

        res.status(200).json({
            success: true,
            message: "Agencias recuperadas con éxito",
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

const getAgencyByRIF = async (req, res) => {
    try {
        const rif = req.params.rif;
        const response = await pool.query('SELECT * FROM agencia WHERE rif = $1', [rif]);

        if (response.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe agencia con este rif",
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Agencia recuperado con exito",
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

module.exports = {
    getAgency,
    getAgencyByRIF
}