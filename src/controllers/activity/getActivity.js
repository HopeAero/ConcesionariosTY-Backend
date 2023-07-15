const {pool} = require('../../databases/db');

const getActivity = async (req, res) => {
    try {
        const { page = 1, size = 10 } = req.query;

        const offset = (page - 1) * size;
        const limit = size;

        const countResponse = await pool.query('SELECT COUNT(*) FROM actividad');
        const count = parseInt(countResponse.rows[0].count);

        const response = await pool.query('SELECT actividad.*, servicio.nombre as nombre_servicio, servicio.tiempo_reserva as tiempo_reserva, servicio.descripcion_detallada as descripcion_detallada, servicio.costo_hora_hombre as costo_hora_hombre, servicio.rif_agencia as rif_agencia, servicio.ci_empleado as ci_empleado FROM actividad JOIN servicio ON actividad.codigo_servicio = servicio.codigo ORDER BY codigo_servicio OFFSET $1 LIMIT $2', [offset, limit]);

        const totalPages = Math.ceil(count / size);

        res.status(200).json({
            success: true,
            message: "Actividades recuperados con éxito",
            paginate: {
                total: count,
                page: page,
                pages: totalPages,
                perPage: size
            },
            items: response.rows
        });    
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Ha ocurrido un problema",
        });
        console.log(error);    
    }
    
}

const getActivityByCode = async (req, res) => {
    try {
        const code = req.params.code;
        const response = await pool.query('SELECT actividad.*, servicio.nombre as nombre_servicio, servicio.tiempo_reserva as tiempo_reserva, servicio.descripcion_detallada as descripcion_detallada, servicio.costo_hora_hombre as costo_hora_hombre, servicio.rif_agencia as rif_agencia, servicio.ci_empleado as ci_empleado FROM actividad JOIN servicio ON actividad.codigo_servicio = servicio.codigo WHERE actividad.codigo_servicio = $1 ORDER BY codigo_servicio', [code])

        if (response.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe actividad con este codigo de servicio",
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Actividad recuperado con exito",
                items: response.rows
            });
        }

        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Ha ocurrido un problema",
        });
        console.log(error);    
    }
    
}

const getAllActivity = async (req, res) => {
    try {
        const response = await pool.query('SELECT actividad.*, servicio.nombre as nombre_servicio, servicio.tiempo_reserva as tiempo_reserva, servicio.descripcion_detallada as descripcion_detallada, servicio.costo_hora_hombre as costo_hora_hombre, servicio.rif_agencia as rif_agencia, servicio.ci_empleado as ci_empleado FROM actividad JOIN servicio ON actividad.codigo_servicio = servicio.codigo ORDER BY codigo_servicio');

        res.status(200).json({
            success: true,
            message: "Actividades recuperados con éxito",
            items: response.rows
        });    
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Ha ocurrido un problema",
        });
        console.log(error);    
    }
    
}

module.exports = {
    getActivity,
    getActivityByCode,
    getAllActivity
}