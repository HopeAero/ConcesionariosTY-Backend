const {pool} = require('../../databases/db');

const posterUtilize = async (req, res) => {
    try {
        const ci_emp = req.body.ci_empleado;
        const cod_serv = req.body.codigo_servicio;
        const nro_act = req.body.nro_actividad;
        const cod_pro = req.body.codigo_producto;
        
        const verify = await pool.query('SELECT * FROM utiliza WHERE ci_empleado = $1 AND codigo_servicio = $2 AND nro_actividad = $3 AND codigo_producto = $4', [ci_emp, cod_serv, nro_act, cod_pro]);

        if (verify.rows.length !== 0) {
            res.status(404).json({
                success: false,
                message: "Ya existe una utilización de productos con estos datos",
            });
        } else {
            const validate = await pool.query('SELECT * FROM empleado WHERE ci_empleado = $1', [ci_emp]);
            
            if (validate.rows.length === 0) {
                res.status(404).json({
                    success: false,
                    message: "No existe empleado con esta cedula",
                });
            } else {
                const validate3 = await pool.query('SELECT * FROM producto WHERE codigo = $1', [cod_pro]);
            
                if (validate3.rows.length === 0) {
                    res.status(404).json({
                        success: false,
                        message: "No existe producto con este codigo",
                    });
                } else {
                    const validate2 = await pool.query('SELECT * FROM actividad WHERE codigo_servicio = $1 AND nro_actividad = $2', [cod_serv, nro_act]);
                
                    if (validate2.rows.length === 0) {
                        res.status(404).json({
                            success: false,
                            message: "No existe actividad con ese nro en un servicio con ese codigo",
                        });
                    }else{
                        const cant_prod = req.body.cantidad_producto;
                        const producto = await pool.query('SELECT existencia FROM producto WHERE codigo = $1', [cod_pro]);
                        const existencia_productos = producto.rows[0].existencia;
                        if (cant_prod <= 0) {
                            res.status(404).json({
                                success: false,
                                message: "Debe colocar una cantidad de productos valida ",
                            });
                        }else{
                            if (cant_prod > existencia_productos) {
                                res.status(404).json({
                                    success: false,
                                    message: "No existen suficientes productos ",
                                });
                            }else{
                                const diferencia = existencia_productos-cant_prod;
                                await pool.query('UPDATE producto SET existencia = $1 WHERE codigo = $2 RETURNING *',[diferencia, cod_pro]);

                                const prec = await pool.query('SELECT precio FROM producto WHERE codigo = $1', [cod_pro]);
                                const prec_prod = prec.rows[0].precio;

                                const ex_min = await pool.query('SELECT existencia_minima FROM producto WHERE codigo = $1', [cod_pro]);
                                const exist_min = ex_min.rows[0].existencia_minima;
                                if (exist_min > diferencia) {
                                    const response = await pool.query(
                                        'INSERT INTO utiliza (ci_empleado, codigo_servicio, nro_actividad, codigo_producto, cantidad_producto, precio_producto) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [ci_emp, cod_serv, nro_act, cod_pro, cant_prod, prec_prod]);
                                    res.status(200).json({
                                        success: true,
                                        message: "Utilización de productos registrada con exito!   El numero de productos existentes es menor a la existencia minima, reabastecer",
                                        items: response.rows
                                    });
                                }else{
                                    const response = await pool.query(
                                        'INSERT INTO utiliza (ci_empleado, codigo_servicio, nro_actividad, codigo_producto, cantidad_producto, precio_producto) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', [ci_emp, cod_serv, nro_act, cod_pro, cant_prod, prec_prod]);
                                    res.status(200).json({
                                        success: true,
                                        message: "Utilización de productos registrada con exito",
                                        items: response.rows
                                    });
                                }
                            } 
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
    posterUtilize
}