const {pool} = require('../../databases/db');

const getAnalysts = async (req, res) => {
    try {
        const { page = 1, size = 10 } = req.query;

        const offset = (page - 1) * size;
        const limit = size;

        const countResponse = await pool.query('SELECT COUNT(*) FROM analista');
        const count = parseInt(countResponse.rows[0].count);

        const response = await pool.query('SELECT analista.*, empleado.nombre as nombre, empleado.cargo_ocupado as cargo_ocupado, empleado.direccion as direccion, empleado.sueldo as sueldo, empleado.telefono_principal as telefono_principal FROM analista JOIN empleado ON analista.ci_empleado = empleado.ci_empleado ORDER BY ci_empleado OFFSET $1 LIMIT $2', [offset, limit]);

        const totalPages = Math.ceil(count / size);

        res.status(200).json({
            success: true,
            message: "Analistas recuperados con éxito",
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

const getAnalystByCI = async (req, res) => {
    try {
        const ci = req.params.ci;
        const response = await pool.query('SELECT analista.*, empleado.nombre as nombre, empleado.cargo_ocupado as cargo_ocupado, empleado.direccion as direccion, empleado.sueldo as sueldo, empleado.telefono_principal as telefono_principal FROM analista JOIN empleado ON analista.ci_empleado = empleado.ci_empleado WHERE analista.ci_empleado = $1', [ci])

        if (response.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe analista con esta cedula de identidad",
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Analista recuperado con exito",
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

const getAllAnalysts = async (req, res) => {
    try {
        const response = await pool.query('SELECT analista.*, empleado.nombre as nombre, empleado.cargo_ocupado as cargo_ocupado, empleado.direccion as direccion, empleado.sueldo as sueldo, empleado.telefono_principal as telefono_principal FROM analista JOIN empleado ON analista.ci_empleado = empleado.ci_empleado ORDER BY ci_empleado');

        res.status(200).json({
            success: true,
            message: "Analistas recuperados con éxito",
            items: response.rows
        });
    } catch(error) {
        res.status(500).json({
            success: false,
            message: "Ha ocurrido un problema",
        });
        console.log(error);
    }
}


module.exports = {
    getAnalysts,
    getAnalystByCI,
    getAllAnalysts
}