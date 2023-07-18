const {pool} = require('../../databases/db');

const posterBill = async (req, res) => {
    try {
        function calcularDescuentos(promedio, descuentos) {
            let resultado = 0;
            for (let d in descuentos) {
                if (promedio > descuentos[d]['prom']) {
                    resultado = promedio * d;
                }
            }
            return resultado;
        };

        const {nro_factura, fecha, codigo_orden_servicio} = req.body;
        const verify = await pool.query('SELECT * FROM FACTURA WHERE nro_factura = $1', [nro_factura]);
        const descuentos = {
            0.05: { prom: 2},
            0.10: { prom: 3.54},
            0.15: { prom: 5}
        };
        if(verify.rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: "La factura ya existe"
            });
        } else {
            const verify2 = await pool.query('SELECT * FROM DETALLA WHERE codigo_orden_servicio = $1', [codigo_orden_servicio]);
            if(verify2.rows.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "La orden de servicio no existe en detalla"
                }); 
            } else {
                let montoActividad = await pool.query('SELECT SUM(costo_actividad * horas_requeridas) as costo_detalla FROM DETALLA WHERE codigo_orden_servicio = $1', [codigo_orden_servicio]);
                console.log(montoActividad.rows[0])
                const servicios = verify2.rows.map((row) => row.codigo_servicio);
                let montoUtiliza = await pool.query(`SELECT SUM(cantidad_producto * precio_producto) as costo_utiliza FROM UTILIZA WHERE codigo_servicio = ANY(ARRAY[${servicios}]);
                `);
                let montoTotal = (montoActividad.rows[0].costo_detalla) + (montoUtiliza.rows[0].costo_utiliza);
                const verifyClient = await pool.query(`SELECT c.es_frecuente, c.ci_cliente
                FROM ORDEN_DE_SERVICIO os
                JOIN VEHICULO v ON os.placa_vehiculo = v.placa
                JOIN CLIENTE c ON v.CI_Cliente = c.CI_Cliente
                WHERE os.codigo = ${codigo_orden_servicio}
                AND c.CI_Cliente IN (
                    SELECT CI_Cliente
                    FROM VEHICULO
                    WHERE placa_vehiculo = os.placa_vehiculo
                );
                `)  

                if (verifyClient.rows.length === 0) {
                    res.status(404).json({
                        success: false,
                        message: "No existe un cliente asociado a esta orden de servicio"
                    })
                } else {
                    if (verifyClient.rows[0].es_frecuente === true) {
                        const promedio = await pool.query(`SELECT AVG(servicios_contratados) AS promedio_servicios_contratados
                        FROM (
                        SELECT v.ci_cliente, COUNT(*) AS servicios_contratados
                        FROM ORDEN_DE_SERVICIO os
                        JOIN VEHICULOS v ON v.placa = os.placa_vehiculo
                        WHERE os.fecha_salida_real >= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '12 months'
                        AND os.fecha_salida_real <= DATE_TRUNC('month', CURRENT_DATE)
                        AND v.ci_cliente = ${verifyClient.rows[0].ci_cliente}
                        GROUP BY v.ci_cliente
                        ) q;`)

                        const serviciosContratados = promedio.rows[0].promedio_servicios_contratados;
                        const descuento = calcularDescuentos(serviciosContratados, descuentos);
                        montoTotal = montoTotal * descuento;
                        const response = await pool.query('INSERT INTO FACTURA (nro_factura, fecha, codigo_orden_servicio, porcentaje_descuento, monto_total) VALUES ($1, $2, $3, $4, $5) RETURNING *', [nro_factura, fecha, codigo_orden_servicio, descuento, montoTotal]);
                        res.status(200).json({
                            success: true,
                            message: "Factura insertada con exito",
                            items: response.rows
                        })
                    } else {
                        console.log(nro_factura, fecha, codigo_orden_servicio, 0, montoTotal)
                        const response = await pool.query('INSERT INTO FACTURA (nro_factura, fecha, codigo_orden_servicio, porcentaje_descuento, monto_total) VALUES ($1, $2, $3, $4, $5) RETURNING *', [nro_factura, fecha, codigo_orden_servicio, 0, montoTotal]);
                        res.status(200).json({
                            success: true,
                            message: "Factura insertada con exito",
                            items: response.rows
                        })
                    }
                }
            }
        }
        res.status(200).json({
            success: true,
            message: "Factura insertada con exito",
            items: response.rows
        });
    } catch(error) {
        res.status(500).json({
            success: false,
            message: `Ha ocurrido un problema ${error.message}`
        });
        console.log(error);
    }
}

module.exports = {
    posterBill
}