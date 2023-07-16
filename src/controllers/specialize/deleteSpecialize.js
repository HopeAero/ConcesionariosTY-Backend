const {pool} = require('../../databases/db');

const deleteSpecialize = async (req, res) => {
    try {
        const ci_emp = req.params.ci_emp;
        const cod_serv = req.params.cod_serv;
        
        const verify = await pool.query('SELECT * FROM especializa WHERE ci_empleado = $1', [ci_emp]);
        const verify2 = await pool.query('SELECT * FROM especializa WHERE codigo_servicio = $1', [cod_serv]);
        
        if (verify.rows.length === 0 || verify2.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe esta especializacion",
            });
        } else {
            await pool.query('DELETE FROM especializa WHERE ci_empleado = $1 AND codigo_servicio = $2', [ci_emp,cod_serv]);
                res.status(200).json({
                    success: true,
                    message: "Especializacion eliminada con exito",
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
    deleteSpecialize
}
