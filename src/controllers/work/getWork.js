const {pool} = require('./../../databases/db');

const getWork = async (req, res) => {
    try{
        const { page = 1, size = 10 } = req.query;

        const offset = (page - 1) * size;
        const limit = size;

        const countResponse = await pool.query('SELECT COUNT(*) FROM trabaja');
        const count = parseInt(countResponse.rows[0].count);

        const response = await pool.query('SELECT * FROM trabaja ORDER BY rif_Agencia OFFSET $1 LIMIT $2', [offset, limit]);

        const totalPages = Math.ceil(count / size);

        res.status(200).json({
            success: true,
            message: "Trabajadores de las agencias recuperados con éxito",
            paginate: {
                total: count,
                page: page,
                pages: totalPages,
                perPage: size
            },
            items: response.rows
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: `Ha ocurrido un problema ${error.message}`
        });
    }
}

const getWorkByRIF = async (req, res) => {
    try {
        const rif = req.params.rif;
        const response = await pool.query('SELECT * FROM trabaja WHERE rif_agencia = $1', [rif]);

        if (response.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe trabajadores asignados a esta agencia"
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Trabajadores recuperado con exito",
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

const getWorkByCI = async (req, res) => {
    try {
        const ci = req.params.ci;
        const response = await pool.query('SELECT * FROM trabaja WHERE ci_empleado = $1', [ci]);

        if (response.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe trabajdor con esta cedula"
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Trabajador recuperado con exito",
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

const getWorkByRIFAndCI = async (req, res) => {
    try {
        const rif = req.params.rif;
        const ci = req.params.ci;
        const response = await pool.query('SELECT * FROM trabaja WHERE rif_agencia = $1 AND ci_empleado = $2', [rif, ci]);

        if (response.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe trabajador con este rif de agencia y esta cedula"
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Trabajador recuperado con exito",
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

const getWorkAll = async (req, res) => {
    try {
        const response = await pool.query('SELECT * FROM trabaja');

        res.status(200).json({
            success: true,
            message: "Trabajadores de las agencias recuperados con éxito",
            items: response.rows
        });
    } catch(error) {
        res.status(500).json({
            success: false,
            message: `Ha ocurrido un problema ${error.message}`
        });
        console.log(error)
    }
}

module.exports = {
    getWork,
    getWorkByRIF,
    getWorkByCI,
    getWorkByRIFAndCI,
    getWorkAll
}
