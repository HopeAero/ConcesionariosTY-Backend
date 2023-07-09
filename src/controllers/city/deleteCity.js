const {pool} = require('../../databases/db');

const deleteCity = async (req, res) => {
    try {
        const id_estado = req.params.id_estado;
        const nro_ciudad = req.params.nro_ciudad;

        const response = await pool.query('DELETE FROM ciudad WHERE nro_ciudad = $1 AND id_estado = $2', [nro_ciudad, id_estado]);

        if (response.rowCount === 0) {
            res.status(404).json({
                success: false,
                message: "No existe ciudad con este nro asignado a este Estado o al contrario",
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Ciudad eliminada con exito",
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
    deleteCity
}
