const {pool} = require('../../databases/db');

const getBill = async (req, res) => {
    try {
        const { page = 1, size = 10 } = req.query;

        const offset = (page - 1) * size;
        const limit = size;

        const countResponse = await pool.query('SELECT COUNT(*) FROM FACTURA');
        const count = parseInt(countResponse.rows[0].count);

        const response = await pool.query('SELECT * FROM FACTURA ORDER BY nro_factura OFFSET $1 LIMIT $2', [offset, limit]);

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
        console.log(error);
        res.status(500).json({
            success: false,
            message: `Ha ocurrido un problema ${error.message}`
        });
    }
}

const getBillNro = async (req, res) => {
    try {
        const nro_factura = req.params.nro_factura;
        const response = await pool.query('SELECT * FROM FACTURA WHERE nro_factura = $1', [nro_factura]);

        if (response.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe registro de la factura",
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Factura obtenida con exito",
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

const getBillByOrdenServicio = async (req, res) => {
    try {
        const codigo_orden_servicio = req.params.codigo_orden_servicio;
        const response = await pool.query('SELECT * FROM FACTURA WHERE codigo_orden_servicio = $1', [codigo_orden_servicio]);

        if (response.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe registro de la factura",
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Factura obtenida con exito",
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

const getAllBill = async (req, res) => {
    try {
        const response = await pool.query('SELECT * FROM FACTURA');
        res.status(200).json({
            success: true,
            message: "Facturas recuperadas con éxito",
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

module.exports = {
    getBill,
    getBillNro,
    getBillByOrdenServicio,
    getAllBill
}