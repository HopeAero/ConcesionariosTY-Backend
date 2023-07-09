const {pool} = require('../../databases/db');

const getLine = async (req, res) => {
    try {
        const { page = 1, size = 10 } = req.query;

        const offset = (page - 1) * size;
        const limit = size;

        const countResponse = await pool.query('SELECT COUNT(*) FROM linea_suministro');
        const count = parseInt(countResponse.rows[0].count);

        const response = await pool.query('SELECT * FROM linea_suministro ORDER BY codigo OFFSET $1 LIMIT $2', [offset, limit]);

        const totalPages = Math.ceil(count / size);

        res.status(200).json({
            success: true,
            message: "Lineas de suministros recuperadas con éxito",
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

const getLineByCode = async (req, res) => {
    try {
        const codigo = req.params.codigo;
        const response = await pool.query('SELECT * FROM linea_suministro WHERE codigo = $1', [codigo]);

        if (response.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe linea de suministro con este codigo",
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Linea de suministro recuperada con exito",
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
    getLine,
    getLineByCode
}