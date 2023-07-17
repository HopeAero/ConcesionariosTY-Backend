const {pool} = require('../../databases/db');

const getProduct = async (req, res) => {
    try {
        const { page = 1, size = 10 } = req.query;

        const offset = (page - 1) * size;
        const limit = size;
    
        const countResponse = await pool.query('SELECT COUNT(*) FROM producto' );
        const count = parseInt(countResponse.rows[0].count);

        const response = await pool.query('SELECT * FROM producto ORDER BY codigo_linea_s, codigo OFFSET $1 LIMIT $2', [offset, limit]);

        const totalPages = Math.ceil(count / size);


        res.status(200).json({
            success: true,
            message: "Productos recuperados con éxito",
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

const getProductByCodLinea = async (req, res) => {
    try {
        const codigo_linea_s  = req.params.codigo_linea_s;
        const response = await pool.query('SELECT * FROM producto WHERE codigo_linea_s  = $1', [codigo_linea_s ]);

        if (response.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe producto con este codigo de linea de suministro",
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Producto recuperado con exito",
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

const getAllProducts = async (req, res) => {
    try {
        const response = await pool.query('SELECT * FROM producto ORDER BY codigo_linea_s , codigo');

        if (response.rows.length === 0) {
            res.status(404).json({
                success: true,
                message: "No existen productos registrados",
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Productos recuperados con exito",
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
    getProduct,
    getProductByCodLinea,
    getAllProducts
}