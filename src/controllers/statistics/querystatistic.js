const { pool } = require("./../../databases/db");

const servicedVehicleModels = async (req, res) => {
    try {
        const fecha_inicio = req.query.fecha_inicio;
        const fecha_fin = req.query.fecha_fin;
        const response =
            await pool.query(`SELECT vehiculo.codigo_modelo, COUNT(*) AS total_atenciones
            FROM vehiculo
            JOIN orden_de_servicio ON vehiculo.placa = orden_de_servicio.placa_vehiculo
            WHERE orden_de_servicio.fecha_entrada >= ${fecha_inicio} -- Fecha de inicio del período
            AND orden_de_servicio.fecha_entrada <= ${fecha_fin}-- Fecha de fin del período
            GROUP BY vehiculo.codigo_modelo
            ORDER BY total_atenciones DESC;`);
            res.status(200).json({
                success: true,
                message:
                    "Modelos de vehículos mas atendidos en un periodo recuperados con éxito",
                items: response.rows,
            });

    } catch (error){
        console.log(error);
        res.status(500).json({
            success: false,
            message: `Ha ocurrido un problema ${error.message}`,
        });
    }
};

const servicedVehicleModelsType = async (req, res) => {
    try {
        const codigo_servicio = req.query.codigo_servicio;
        const response =
            await pool.query(`SELECT vehiculo.codigo_modelo, COUNT(*) AS total_atenciones
        FROM vehiculo
        JOIN orden_de_servicio ON vehiculo.placa = orden_de_servicio.placa_vehiculo
        JOIN detalla ON orden_de_servicio.codigo = detalla.codigo_orden_servicio
        JOIN actividad ON detalla.codigo_servicio = actividad.codigo_servicio AND detalla.nro_actividad = actividad.nro_actividad
        JOIN servicio ON actividad.codigo_servicio = servicio.codigo
        WHERE servicio.codigo = ${codigo_servicio} -- Tipo de servicio deseado
        GROUP BY vehiculo.codigo_modelo
        ORDER BY total_atenciones DESC;`);

        res.status(200).json({
            success: true,
            message:
                "Modelos de vehículos mas atendidos por tipo de servicio recuperados con éxito",
            items: response.rows,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: `Ha ocurrido un problema ${error.message}`,
        });
    }
};

const personalMostServicedForMONTH = async (req, res) => {
    try {
        const mes = req.body.mes;
        const response = await pool.query(`SELECT e.CI_Empleado, e.nombre, COUNT(*) AS total_servicios
        FROM empleado e
        JOIN orden_de_servicio os ON e.CI_Empleado = os.CI_Empleado
        WHERE EXTRACT(MONTH FROM os.fecha_entrada) = ${mes} -- Cambiar el número de mes según corresponda
        GROUP BY e.CI_Empleado, e.nombre
        HAVING COUNT(*) = (
            SELECT MAX(total_servicios)
            FROM (
                SELECT COUNT(*) AS total_servicios
                FROM orden_de_servicio ods
                WHERE EXTRACT(MONTH FROM ods.fecha_entrada) = ${mes} -- Cambiar el número de mes según corresponda
                GROUP BY ods.CI_Empleado
            ) servicios_por_mes
        )
        ORDER BY total_servicios DESC;`)
        res.status(200).json({
            success: true,
            message: "Personal que realiza mas servicio en un mes recuperado con éxito",
            items: response.rows,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: `Ha ocurrido un problema ${error.message}`,
        });
    }
};

const personalMinServiceForMONTH = async (req, res) => {
    try {
        const mes = req.body.mes;
        const response = await pool.query(`SELECT e.CI_Empleado, e.nombre, COUNT(*) AS total_servicios
        FROM empleado e
        JOIN orden_de_servicio os ON e.CI_Empleado = os.CI_Empleado
        WHERE EXTRACT(MONTH FROM os.fecha_entrada) = ${mes} -- Cambiar el número de mes según corresponda
        GROUP BY e.CI_Empleado, e.nombre
        HAVING COUNT(*) = (
            SELECT MIN(total_servicios)
            FROM (
                SELECT COUNT(*) AS total_servicios
                FROM orden_de_servicio ods
                WHERE EXTRACT(MONTH FROM ods.fecha_entrada) = ${mes} -- Cambiar el número de mes según corresponda
                GROUP BY ods.CI_Empleado
            ) servicios_por_mes
        )
        ORDER BY total_servicios ASC;`)

        res.status(200).json({
            success: true,
            message: "Personal que realiza menos servicio en un mes recuperado con éxito",
            items: response.rows,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: `Ha ocurrido un problema ${error.message}`,
        });
    }
};

const  listOrdenClient = async (req, res) => {
    try {
        const frecuente = (req.body.frecuente === null || req.body.frecuente === undefined || req.body.frecuente === "") ? true : req.body.frecuente;
        const fecha_inicio = req.body.fecha_inicio;
        const fecha_fin = req.body.fecha_fin;
            if (fecha_inicio === null || fecha_inicio === undefined || fecha_inicio === "" || fecha_fin === null || fecha_fin === undefined || fecha_fin === "") {
                res.status(400).json({
                    success: false,
                    message: "Debe ingresar una fecha de inicio y una fecha de fin"
                })
            } else {
                const response = await pool.query(`SELECT c.CI_Cliente, c.nombre, COUNT(*) AS cantidad_servicios, SUM(f.monto_total) AS monto_total_servicios
                FROM cliente c
                JOIN vehiculo v ON c.CI_Cliente = v.CI_Cliente
                JOIN orden_de_servicio ods ON v.placa = ods.placa_vehiculo
                JOIN factura f ON ods.codigo = f.codigo_orden_servicio
                WHERE c.es_frecuente = ${frecuente} -- Considerar solo los clientes frecuentes
                    AND ods.fecha_entrada >= ${fecha_inicio} -- Fecha de inicio del rango
                    AND ods.fecha_entrada <= ${fecha_fin} -- Fecha de fin del rango
                GROUP BY c.CI_Cliente, c.nombre
                ORDER BY cantidad_servicios DESC;
                `)
                res.status(200).json({
                    success: true,
                    message: "Lista de clientes recuperada con éxito",
                    items: response.rows,
                })
            }
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: `Ha ocurrido un problema ${error.message}`,
        });
    }
    
};

const ProductosMasVendidos = async (req, res) => {
    try {
        const response = await pool.query(`SELECT p.codigo, p.nombre_corto, SUM(u.cantidad_producto) AS total_salida
        FROM producto p
        JOIN utiliza u ON p.codigo = u.codigo_producto
        JOIN orden_de_servicio ods ON u.codigo_servicio = ods.codigo
        JOIN factura f ON ods.codigo = f.codigo_orden_servicio
        GROUP BY p.codigo, p.nombre_corto
        ORDER BY total_salida DESC;`)

        res.status(200).json({
            success: true,
            message: "Producto mas vendido recuperado con éxito",
            items: response.rows,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: `Ha ocurrido un problema ${error.message}`,
        });
    }
}

const ProductosMenosVendido = async (req, res) => {
    try {
        const response = await pool.query(`SELECT p.codigo, p.nombre_corto, SUM(u.cantidad_producto) AS total_salida
        FROM producto p
        JOIN utiliza u ON p.codigo = u.codigo_producto
        JOIN orden_de_servicio ods ON u.codigo_servicio = ods.codigo
        JOIN factura f ON ods.codigo = f.codigo_orden_servicio
        GROUP BY p.codigo, p.nombre_corto
        ORDER BY total_salida ASC;`)

        res.status(200).json({
            success: true,
            message: "Producto mas vendido recuperado con éxito",
            items: response.rows,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: `Ha ocurrido un problema ${error.message}`,
        });
    }
}

const promEcology = async (req, res) => {
    try {
        const response = await pool.query(`SELECT COUNT(*) AS total_productos,
        SUM(CASE WHEN p.es_ecologico = FALSE THEN 1 ELSE 0 END) AS productos_no_ecologicos,
        ROUND((CAST(SUM(CASE WHEN p.es_ecologico = FALSE THEN 1 ELSE 0 END) AS DECIMAL) / COUNT(*)) * 100, 2) AS porcentaje_no_ecologicos
        FROM producto p;`)

        res.status(200).json({
            success: true,
            message: "Porcentaje de productos no ecológicos recuperado con éxito",
            items: response.rows,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: `Ha ocurrido un problema ${error.message}`,
        });
    }
}

const servicesMore = async (req, res) => {
    try {
        const response = await pool.query(`SELECT s.nombre AS servicio, COUNT(*) AS total_solicitudes
        FROM servicio s
        JOIN actividad a ON s.codigo = a.codigo_servicio
        GROUP BY s.nombre
        ORDER BY COUNT(*) DESC;`)

        res.status(200).json({
            success: true,
            message: "Servicios mas solicitados recuperado con éxito",
            items: response.rows,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: `Ha ocurrido un problema ${error.message}`,
        });
    }
}

const servicesMin = async (req, res) => {
    try {
        const response = await pool.query(`SELECT s.nombre AS servicio, COUNT(*) AS total_solicitudes
        FROM servicio s
        JOIN actividad a ON s.codigo = a.codigo_servicio
        GROUP BY s.nombre
        ORDER BY COUNT(*) ASC;`)

        res.status(200).json({
            success: true,
            message: "Servicios mas solicitados recuperado con éxito",
            items: response.rows,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: `Ha ocurrido un problema ${error.message}`,
        });
    }
}

const historyVehicle = async (req, res) => {
    try {
        const response = await pool.query(`SELECT v.placa AS vehiculo, s.nombre AS servicio, COUNT(*) AS cantidad_usos
        FROM vehiculo v
        JOIN orden_de_servicio o ON v.placa = o.placa_vehiculo
        JOIN detalla d ON o.codigo = d.codigo_orden_servicio
        JOIN servicio s ON d.codigo_servicio = s.codigo
        GROUP BY v.placa, s.nombre
        ORDER BY v.placa, s.nombre;`);

        res.status(200).json({
            success: true,
            message: "Historial de servicios de vehiculos recuperado con éxito",
            items: response.rows,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: `Ha ocurrido un problema ${error.message}`,
        });
    }
}

const agencyMoreFactura = async (req, res) => {
    try {
        const fecha_inicio = req.body.fecha_inicio;
        const fecha_fin = req.body.fecha_fin;
        const response = await pool.query(`SELECT a.RIF AS agencia_rif, a.Razon_social AS agencia_nombre, SUM(f.monto_total) AS total_facturado
        FROM agencia a
        JOIN trabaja t ON a.RIF = t.rif_agencia
        JOIN empleado e ON t.CI_Empleado = e.CI_Empleado
        JOIN orden_de_servicio o ON e.CI_Empleado = o.CI_Empleado
        JOIN factura f ON o.codigo = f.codigo_orden_servicio
        WHERE f.fecha >= ${fecha_inicio} AND f.fecha <= ${fecha_fin}
        GROUP BY a.RIF, a.Razon_social
        ORDER BY total_facturado DESC
        LIMIT 1;`);

        res.status(200).json({
            success: true,
            message: "Agencias con mas ganancia recuperadas con éxito",
            items: response.rows,
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: `Ha ocurrido un problema ${error.message}`,
        }); 
    }
}

const agencyMinFactura = async (req, res) => {
    try {
        const fecha_inicio = req.body.fecha_inicio;
        const fecha_fin = req.body.fecha_fin;
        const response = await pool.query(`SELECT a.RIF AS agencia_rif, a.Razon_social AS agencia_nombre, SUM(f.monto_total) AS total_facturado
        FROM agencia a
        JOIN trabaja t ON a.RIF = t.rif_agencia
        JOIN empleado e ON t.CI_Empleado = e.CI_Empleado
        JOIN orden_de_servicio o ON e.CI_Empleado = o.CI_Empleado
        JOIN factura f ON o.codigo = f.codigo_orden_servicio
        WHERE f.fecha >= ${fecha_inicio} AND f.fecha <= ${fecha_fin}
        GROUP BY a.RIF, a.Razon_social
        ORDER BY total_facturado ASC
        LIMIT 1;`);

        res.status(200).json({
            success: true,
            message: "Agencias con mas ganancia recuperadas con éxito",
            items: response.rows,
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: `Ha ocurrido un problema ${error.message}`,
        }); 
    }
}

module.exports = {
    servicedVehicleModels,
    servicedVehicleModelsType,
    personalMostServicedForMONTH,
    personalMinServiceForMONTH,
    listOrdenClient,
    ProductosMasVendidos,
    ProductosMenosVendido,
    promEcology,
    servicesMore,
    servicesMin,
    historyVehicle,
    agencyMoreFactura,
    agencyMinFactura
}



