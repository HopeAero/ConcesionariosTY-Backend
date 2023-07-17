const {pool} = require('../../databases/db');

const updateUtilize = async (req, res) => {
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
            const cant_prod = req.body.cantidad_producto;
            
            if (cant_prod <= 0) {
                res.status(404).json({
                    success: false,
                    message: "Debe colocar una cantidad de productos valida ",
                });
            }else{
                const cant_ant = await pool.query('SELECT cantidad_producto FROM utiliza WHERE ci_empleado = $1 AND codigo_servicio = $2 AND nro_actividad = $3 AND codigo_producto = $4', [ci_emp, cod_serv, nro_act, cod_pro]);
                const cantidad_ant = cant_ant.rows[0].cantidad_producto;
                if (cant_prod < cantidad_ant) {
                    res.status(404).json({
                        success: false,
                        message: "No puedes colocar una cantidad menor",
                    });
                }else{
                    const producto = await pool.query('SELECT existencia FROM producto WHERE codigo = $1', [cod_pro]);
                    const existencia_productos = producto.rows[0].existencia;
                    const cantidad_agregada = cant_prod-cantidad_ant;
                    if ( cantidad_agregada> existencia_productos) {
                        res.status(404).json({
                            success: false,
                            message: "No existen suficientes productos ",
                        });
                    }else{
                        const diferencia = existencia_productos-cantidad_agregada;
                        await pool.query('UPDATE producto SET existencia = $1 WHERE codigo = $2 RETURNING *',[diferencia, cod_pro]);
    
                        const ex_min = await pool.query('SELECT existencia_minima FROM producto WHERE codigo = $1', [cod_pro]);
                        const exist_min = ex_min.rows[0].existencia_minima;
                        if (exist_min > diferencia) {
                            const response = await pool.query('UPDATE utiliza SET cantidad_producto = $5 WHERE ci_empleado = $1 AND codigo_servicio = $2 AND nro_actividad = $3 AND codigo_producto = $4 RETURNING *', [ci_emp, cod_serv, nro_act, cod_pro, cant_prod]);
                            res.status(200).json({
                                success: true,
                                message: "Utilización de productos actualizada con exito!   El numero de productos existentes es menor a la existencia minima, reabastecer",
                                items: response.rows
                            });
                        }else{
                            const response = await pool.query('UPDATE utiliza SET cantidad_producto = $5 WHERE ci_empleado = $1 AND codigo_servicio = $2 AND nro_actividad = $3 AND codigo_producto = $4 RETURNING *', [ci_emp, cod_serv, nro_act, cod_pro, cant_prod]);
                            res.status(200).json({
                                success: true,
                                message: "Utilización de productos actualizada con exito!",
                                items: response.rows
                            });
                        }
                    }
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
    updateUtilize
}