const {pool} = require('../../databases/db');

const deleteAgency = async (req, res) => {
    try {
        const rif = req.params.rif;
        const verify = await pool.query('SELECT * FROM agencia WHERE rif = $1', [rif]);
         if (verify.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe agencia con este rif",
            });
        } else {
            await pool.query('DELETE FROM agencia WHERE rif = $1', [rif]);
            res.status(200).json({
                success: true,
                message: "Agencia eliminado con exito",
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
    deleteAgency
}