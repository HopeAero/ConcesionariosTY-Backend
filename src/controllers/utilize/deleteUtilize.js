const {pool} = require('../../databases/db');

const deleteUtilize = async (req, res) => {
    try {
        const ci_emp = req.params.ci_emp;
        const cod_serv = req.params.cod_serv;
        const nro_act = req.params.nro_act;
        const cod_pro = req.params.cod_prod;
        
        const verify = await pool.query('SELECT * FROM utiliza WHERE ci_empleado = $1 AND codigo_servicio = $2 AND nro_actividad = $3 AND codigo_producto = $4', [ci_emp, cod_serv, nro_act, cod_pro]);

        if (verify.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe utilización de productos con estos datos",
            });
        } else {
            await pool.query('DELETE FROM utiliza WHERE ci_empleado = $1 AND codigo_servicio = $2 AND nro_actividad = $3 AND codigo_producto = $4', [ci_emp, cod_serv, nro_act, cod_pro]);
            res.status(200).json({
                success: true,
                message: "Utilizacion de productos eliminada con exito",
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
    deleteUtilize
}
