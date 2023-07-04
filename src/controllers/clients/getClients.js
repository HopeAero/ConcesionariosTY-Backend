const {pool} = require('./../../databases/db');

const getClients = async (req, res) => {
    const response = await pool.query('SELECT * FROM cliente');
    res.status(200).json({
        success: true,
        message: "Clientes recuperados con exito",
        items: response.rows
    });
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