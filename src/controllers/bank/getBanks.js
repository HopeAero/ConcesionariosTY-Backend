const {pool} = require('../../databases/db');

const getBanks = async (req, res) => {
    try {
        const { page = 1, size = 10 } = req.query;

        const offset = (page - 1) * size;
        const limit = size;

        const countResponse = await pool.query('SELECT COUNT(*) FROM tarjeta');
        const count = parseInt(countResponse.rows[0].count);

        const response = await pool.query('SELECT * FROM tarjeta ORDER BY nro_tarjeta OFFSET $1 LIMIT $2', [offset, limit]);

        const totalPages = Math.ceil(count / size);

        res.status(200).json({
            success: true,
            message: "Tarjetas recuperadas con éxito",
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

const getBanksbyTarjeta = async (req, res) => {
    try {
        const nro_tarjeta = req.params.nro_tarjeta;
        const response = await pool.query('SELECT * FROM tarjeta WHERE nro_tarjeta = $1', [nro_tarjeta]);

        if (response.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe registro de la tarjeta",
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Tarjeta obtenida con exito",
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
    getBanks,
    getBanksbyTarjeta
}