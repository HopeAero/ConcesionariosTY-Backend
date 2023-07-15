const {pool} = require('./../../databases/db');

const getSpecialize = async (req, res) => {
    try {
        const { page = 1, size = 10 } = req.query;

        const offset = (page - 1) * size;
        const limit = size;

        const countResponse = await pool.query('SELECT COUNT(*) FROM especializa');
        const count = parseInt(countResponse.rows[0].count);

        const response = await pool.query('SELECT * FROM especializa ORDER BY ci_empleado OFFSET $1 LIMIT $2', [offset, limit]);

        const totalPages = Math.ceil(count / size);

        res.status(200).json({
            success: true,
            message: "Especializaciones recuperadas con éxito",
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

const getSpecializeByCiCod= async (req, res) => {
    try {
        const ci_emp = req.params.ci_emp;
        const cod_serv = req.params.cod_serv;

        const response = await pool.query('SELECT * FROM especializa WHERE ci_empleado = $1 AND codigo_servicio = $2', [ci_emp, cod_serv]);

        if (response.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe especializacion con estos datos",
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Especializacion recuperada con exito",
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

const getAllSpecialize = async (req, res) => {
    try {
        const response = await pool.query('SELECT * FROM especializa');

        res.status(200).json({
            success: true,
            message: "Especializaciones recuperadas con exito",
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
    getSpecialize,
    getSpecializeByCiCod,
    getAllSpecialize
}