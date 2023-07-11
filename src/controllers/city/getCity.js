const {pool} = require('../../databases/db');

const getCity = async (req, res) => {
    try {
        const { page = 1, size = 10 } = req.query;

        const offset = (page - 1) * size;
        const limit = size;
    
        const countResponse = await pool.query('SELECT COUNT(*) FROM ciudad' );
        const count = parseInt(countResponse.rows[0].count);

        const response = await pool.query('SELECT * FROM ciudad ORDER BY id_estado, nro_ciudad OFFSET $1 LIMIT $2', [offset, limit]);

        const totalPages = Math.ceil(count / size);


        res.status(200).json({
            success: true,
            message: "Ciudades recuperadas con éxito",
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

const getCityByState = async (req, res) => {
    try {
        const id_estado = req.params.id_estado;
        const response = await pool.query('SELECT * FROM ciudad WHERE id_estado = $1', [id_estado]);

        if (response.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe ciudad con este id de estado",
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Ciudad recuperada con exito",
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

const getAllCity = async (req, res) => {
    try {
        const response = await pool.query('SELECT * FROM ciudad ORDER BY id_estado, nro_ciudad');

        res.status(200).json({
            success: true,
            message: "Ciudades recuperadas con éxito",
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
    getCity,
    getCityByState,
    getAllCity
}