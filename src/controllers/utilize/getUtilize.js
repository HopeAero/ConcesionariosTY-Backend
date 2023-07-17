const {pool} = require('./../../databases/db');

const getUtilize = async (req, res) => {
    try {
        const { page = 1, size = 10 } = req.query;

        const offset = (page - 1) * size;
        const limit = size;

        const countResponse = await pool.query('SELECT COUNT(*) FROM utiliza');
        const count = parseInt(countResponse.rows[0].count);

        const response = await pool.query('SELECT * FROM utiliza ORDER BY ci_empleado OFFSET $1 LIMIT $2', [offset, limit]);

        const totalPages = Math.ceil(count / size);

        res.status(200).json({
            success: true,
            message: "Utilizacion de productos recuperadas con éxito",
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

const getUtilizeByCi_empCod_servNro_actCod_prod = async (req, res) => {
    try {
        const ci_emp = req.params.ci_emp;
        const cod_serv = req.params.cod_serv;
        const nro_act = req.params.nro_act;
        const cod_pro = req.params.cod_prod;
        
        const response = await pool.query('SELECT * FROM utiliza WHERE ci_empleado = $1 AND codigo_servicio = $2 AND nro_actividad = $3 AND codigo_producto = $4', [ci_emp, cod_serv, nro_act, cod_pro]);

        if (response.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe utilización de productos con estos datos",
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Utilización de productos recuperada con exito",
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

const getAllUtilize = async (req, res) => {
    try {
        const response = await pool.query('SELECT * FROM utiliza');

        res.status(200).json({
            success: true,
            message: "Utilización de productos recuperadas con exito",
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
    getUtilize,
    getUtilizeByCi_empCod_servNro_actCod_prod,
    getAllUtilize
}