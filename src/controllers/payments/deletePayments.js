const {pool} = require('../../databases/db');

const deletePayment = async (req, res) => {
    try {
        const id = req.params.id;
        const verify = await pool.query('SELECT * FROM pago WHERE id = $1', [id]);
        
        if (verify.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe pago registrado con este id",
            });
        } else {
            await pool.query('DELETE FROM pago WHERE id = $1', [id]);
            res.status(200).json({
                success: true,
                message: "Pago eliminado con exito",
            });
        }
        
    } catch(error) {
        res.status(500).json({
            success: false,
            message: "Ha ocurrido un problema",
        });
    }
}

module.exports = {
    deletePayment
}
