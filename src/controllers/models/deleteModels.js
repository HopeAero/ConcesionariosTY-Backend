const {pool} = require('../../databases/db');

const deleteModel = async (req, res) => {
    try {
        const cod = req.params.cod;
        const verify = await pool.query('SELECT * FROM modelo WHERE codigo = $1', [cod]);
         if (verify.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe modelo con este codigo",
            });
        } else {
            const validate = await pool.query('SELECT * FROM vehiculo WHERE codigo_modelo = $1', [cod]);
            if (validate.rows.length !== 0) {
                res.status(404).json({
                    success: false,
                    message: "No se puede borrar este modelo porque esta presente en algun vehiculo ",
                });
            }else{
                await pool.query('DELETE FROM modelo WHERE codigo = $1', [cod]);
                res.status(200).json({
                success: true,
                message: "Modelo eliminado con exito",
            });
            }
            
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
    deleteModel
}
