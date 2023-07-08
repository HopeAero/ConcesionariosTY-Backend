const {pool} = require('./../../databases/db');

const getClients = async (req, res) => {
    try {
        const { page = 1, size = 10 } = req.query;

        const offset = (page - 1) * size;
        const limit = size;

        const countResponse = await pool.query('SELECT COUNT(*) FROM cliente');
        const count = parseInt(countResponse.rows[0].count);

        const response = await pool.query('SELECT * FROM cliente ORDER BY ci_cliente OFFSET $1 LIMIT $2', [offset, limit]);

        const totalPages = Math.ceil(count / size);

        res.status(200).json({
            success: true,
            message: "Clientes recuperados con éxito",
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

const getClientByCI = async (req, res) => {
    try {
        const ci = req.params.ci;
        const response = await pool.query('SELECT * FROM cliente WHERE ci_cliente = $1', [ci]);

        if (response.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe cliente con esta cedula de identidad",
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Cliente recuperado con exito",
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
    getClients,
    getClientByCI
}