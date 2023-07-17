const {pool} = require('./../../databases/db');

const getHire = async (req, res) => {
    try {
        const { page = 1, size = 10 } = req.query;

        const offset = (page - 1) * size;
        const limit = size;

        const countResponse = await pool.query('SELECT COUNT(*) FROM contrata');
        const count = parseInt(countResponse.rows[0].count);

        const response = await pool.query('SELECT * FROM contrata ORDER BY id_reserva OFFSET $1 LIMIT $2', [offset, limit]);

        const totalPages = Math.ceil(count / size);

        res.status(200).json({
            success: true,
            message: "Reservaciones recuperadas con éxito",
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

const getHireByIdResCodSer = async (req, res) => {
    try {
        const reserva = req.params.idRes;
        const servicio = req.params.codSer;
        const response = await pool.query('SELECT * FROM contrata WHERE id_reserva = $1 AND codigo_servicio = $2', [reserva, servicio]);

        if (response.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe combinación de esta reserva con este servicio",
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Reservación recuperada con exito",
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

const getAllHire = async (req, res) => {
    try {
        const response = await pool.query('SELECT * FROM contrata');

        res.status(200).json({
            success: true,
            message: "Reservaciones recuperadas con exito",
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
    getHire,
    getHireByIdResCodSer,
    getAllHire
}