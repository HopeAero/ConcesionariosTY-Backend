const {pool} = require('../../databases/db');

const deleteClient = async (req, res) => {
    try {
        const ci = req.params.ci;
        const verify = await pool.query('SELECT * FROM cliente WHERE ci_cliente = $1', [ci]);
         if (verify.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe cliente con esta cedula de identidad",
            });
        } else {
            await pool.query('DELETE FROM cliente WHERE ci_cliente = $1', [ci]);
            res.status(200).json({
                success: true,
                message: "Cliente eliminado con exito",
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
    deleteClient
}
