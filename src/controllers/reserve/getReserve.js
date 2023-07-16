const {pool} = require('../../databases/db');

const getReserve = async (req, res) => {
    try {
        const { page = 1, size = 10 } = req.query;

        const offset = (page - 1) * size;
        const limit = size;

        const countResponse = await pool.query('SELECT COUNT(*) FROM reserva');
        const count = parseInt(countResponse.rows[0].count);

        const response = await pool.query('SELECT * FROM reserva ORDER BY id_reserva OFFSET $1 LIMIT $2', [offset, limit]);

        const totalPages = Math.ceil(count / size);

        res.status(200).json({
            success: true,
            message: "Reservas recuperadas con éxito",
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
            message: `Ha ocurrido un problema ${error.message}`
        });
        console.log(error);    
    }
    
}

const getReserveById = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await pool.query('SELECT * FROM reserva WHERE id_reserva = $1', [id]);

        if (response.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe una reserva con este id",
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Reserva recuperada con exito",
                items: response.rows
            });
        }

    } catch(error) {
        res.status(500).json({
            success: false,
            message: `Ha ocurrido un problema ${error.message}`
        });
        console.log(error)
    }
}

const getReserveByPlaca = async (req, res) => {
    try {
        const placa = req.params.placa;
        const response = await pool.query('SELECT * FROM reserva WHERE placa_vehiculo = $1', [placa]);

        if (response.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe una reserva con este placa de vehiculo",
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Reserva recuperada con exito",
                items: response.rows
            });
        }

    } catch(error) {
        res.status(500).json({
            success: false,
            message: `Ha ocurrido un problema ${error.message}`
        });
        console.log(error)
    }
}

const getReserveAll = async (req, res) => {
    try {
        const response = await pool.query('SELECT * FROM reserva');
        res.status(200).json({
            success: true,
            message: "Reservas recuperadas con éxito",
            items: response.rows
        });    
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Ha ocurrido un problema ${error.message}`
        });
        console.log(error);    
    }
    
}

module.exports = {
    getReserve,
    getReserveById,
    getReserveByPlaca,
    getReserveAll
}