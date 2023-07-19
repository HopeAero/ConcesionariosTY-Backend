const {pool} = require('./../../databases/db');

const getDetail = async (req, res) => {
    try {
        const { page = 1, size = 10 } = req.query;

        const offset = (page - 1) * size;
        const limit = size;

        const countResponse = await pool.query('SELECT COUNT(*) FROM DETALLA');
        const count = parseInt(countResponse.rows[0].count);

        const response = await pool.query('SELECT * FROM DETALLA ORDER BY codigo_orden_servicio OFFSET $1 LIMIT $2', [offset, limit]);

        const totalPages = Math.ceil(count / size);

        res.status(200).json({
            success: true,
            message: "Detalle de orden de servicios recuperadas con éxito",
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
            message: `Ha ocurrido un problema ${error.message}`,
        });
        console.log(error);    
    }
    
}

const getDetailByCode = async (req, res) => {
    try {
        const codigo_orden_servicio = req.params.codigo_servicio;
        const response = await pool.query('SELECT * FROM DETALLA WHERE codigo_orden_servicio = $1', [codigo_orden_servicio]);

        if (response.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe detalle de orden de servicio con este codigo",
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Detalle de orden de servicio recuperada con exito",
                items: response.rows
            });
        }

    } catch(error) {
        res.status(500).json({
            success: false,
            message: `Ha ocurrido un problema ${error.message}`,
        });
        console.log(error);
    }
}

const getDetailAll = async (req, res) => {
    try {
        const response = await pool.query('SELECT * FROM DETALLA');

        res.status(200).json({
            success: true,
            message: "Detalle de orden de servicios recuperadas con éxito",
            items: response.rows
        });    
    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Ha ocurrido un problema ${error.message}`,
        });
        console.log(error);    
    }
    
}

module.exports = {
    getDetail,
    getDetailByCode,
    getDetailAll
}