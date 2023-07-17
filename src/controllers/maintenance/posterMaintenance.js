const { pool } = require('./../../databases/db');
const moment = require('moment');

const posterMaintenance = async (req, res) => {
    try {
        const { placa_vehiculo, codigo_modelo } = req.body;
        const verify = await pool.query('SELECT * FROM vehiculo WHERE placa = $1', [placa_vehiculo]);
        const verify2 = await pool.query('SELECT * FROM modelo WHERE codigo = $1', [codigo_modelo]);
        const verify3 = await pool.query('SELECT * FROM ORDEN_DE_SERVICIO WHERE placa_vehiculo = $1 ORDER BY codigo DESC LIMIT 1', [placa_vehiculo]);
        let boolean = false;
        const servicios = {
            'Cambio de aceite': { km: 5000, meses: 6 },
            'Cambio de bujias': { km: 30000, meses: 23 },
            'Cambio de filtro de aceite': { km: 50000, meses: 35 },
            'Cambio de correa de tiempo': { km: 100000, meses: 71 },
            'Cambio de amortiguadores': { km: 150000, meses: 107 },
            'Cambio de frenos': { km: 200000, meses: 143 },
        };

        if (verify.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe vehiculo con esta placa",
            });
        } else {
            if (verify2.rows.length === 0) {
                res.status(404).json({
                    success: false,
                    message: "No existe modelo con este codigo",
                });
            } else {
                if (verify3.rows.length === 0) {
                    res.status(404).json({
                        success: false,
                        message: "No posee un registro de mantenimientos con esta placa",
                    });
                } else {
                    const kilometraje = verify3.rows[0].kilometraje;
                    const tiempo_de_uso = verify3.rows[0].tiempo_de_uso;
                    const fechaInicio = moment('1900-01-01').startOf('day'); // Crea una fecha de inicio usando una fecha arbitraria (en este caso, 1900-01-01)
                    const serviciosRegistrados = [];
                    const fechaFin = fechaInicio.add(tiempo_de_uso); // Crea una fecha de fin sumando el intervalo a la fecha de inicio

                    const diferenciaEnMeses = fechaFin.diff(fechaInicio, 'months'); // Calcula la diferencia en meses entre la fecha de inicio y la fecha de fin

                    for (const [servicio, umbrales] of Object.entries(servicios)) {
                        if (kilometraje > umbrales.km || diferenciaEnMeses > umbrales.meses) {
                            let codigo_servicio = await pool.query('SELECT codigo FROM servicio WHERE nombre = $1 OR nombre = $2', [servicio, servicio.toLowerCase()]);
                            codigo_servicio = codigo_servicio.rows[0].codigo;
                            if (codigo_servicio === undefined || codigo_servicio === null) {
                                boolean = true;
                                continue;
                            } else {
                                boolean = false;
                                let verify4 = await pool.query('SELECT * FROM mantenimiento_recomendado WHERE placa_vehiculo = $1 AND codigo_modelo = $2 AND codigo_servicio = $3', [placa_vehiculo, codigo_modelo, codigo_servicio]);
                                if (verify4.rows.length !== 0) {
                                    continue;
                                } else {
                                    await pool.query('INSERT INTO MANTENIMIENTO_RECOMENDADO (placa_vehiculo, codigo_modelo, codigo_servicio) VALUES ($1, $2, $3)', [placa_vehiculo, codigo_modelo, codigo_servicio]);
                                    serviciosRegistrados.push(servicio);
                                }
                            }
                        }
                    }
                    if (serviciosRegistrados.length === 0 && boolean === true) {
                        res.status(400).json({
                            success: false,
                            message: "No existe ningun servicio registrado en la base de datos para dar mantenimientos recomendados"
                        });
                    } else {
                        if (serviciosRegistrados.length === 0 && boolean === false) {
                            res.status(400).json({
                                success: false,
                                message: "No se han registrado mantenimientos recomendados para este vehiculo ya que no cumple con los umbrales de kilometraje o tiempo de uso o ya se han registrado todos los servicios recomendados"
                            });
                        } else {
                            res.status(200).json({
                                success: true,
                                message: "Mantenimientos registrados con exito",
                                items: {
                                    placa_vehiculo,
                                    codigo_modelo,
                                    kilometraje,
                                    tiempo_de_uso,
                                    serviciosRegistrados
                                }
                            });
                        }
                    }
                }
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: `Ha ocurrido un problema ${error.message}`
        });
    }
}

module.exports = {
    posterMaintenance
}