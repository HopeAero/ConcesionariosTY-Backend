const {pool} = require('../../databases/db');

const posterSpecialize = async (req, res) => {
    try {
        const ci_emp = req.body.ci_empleado;
        const cod_serv = req.body.codigo_servicio;
        
        const verify = await pool.query('SELECT * FROM especializa WHERE ci_empleado = $1', [ci_emp]);
        const verify2 = await pool.query('SELECT * FROM especializa WHERE codigo_servicio = $1', [cod_serv]);

        if (verify.rows.length !== 0 && verify2.rows.length !== 0) {
            res.status(404).json({
                success: false,
                message: "Ya se habia registrado esta especializacion",
            });
        } else {
            const validate = await pool.query('SELECT * FROM empleado WHERE ci_empleado = $1', [ci_emp]);
            
            if (validate.rows.length === 0) {
                res.status(404).json({
                    success: false,
                    message: "No existe empleado con esta cedula",
                });
            } else {
                const validate2 = await pool.query('SELECT * FROM servicio WHERE codigo = $1', [cod_serv]);
                
                if (validate2.rows.length === 0) {
                    res.status(404).json({
                        success: false,
                        message: "No existe servicio con este codigo",
                    });
                } else {
                    const response = await pool.query(
                        'INSERT INTO especializa (ci_empleado, codigo_servicio) VALUES ($1, $2) RETURNING *', [ci_emp, cod_serv]);
                    res.status(200).json({
                        success: true,
                        message: "Especializacion registrada con exito",
                        items: response.rows
                    });
                }
            }

        }

    } catch(error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Ha ocurrido un problema",
        });
    }
}

module.exports = {
    posterSpecialize
}