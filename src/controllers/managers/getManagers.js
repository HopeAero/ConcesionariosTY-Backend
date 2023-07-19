const {pool} = require('./../../databases/db');

const getManagers = async (req, res) => {
    try {
        const { page = 1, size = 10 } = req.query;

        const offset = (page - 1) * size;
        const limit = size;

        const countResponse = await pool.query('SELECT COUNT(*) FROM encargado');
        const count = parseInt(countResponse.rows[0].count);

        const response = await pool.query('SELECT encargado.*, empleado.nombre as nombre, empleado.cargo_ocupado as cargo_ocupado, empleado.direccion as direccion, empleado.sueldo as sueldo, empleado.telefono_principal as telefono_principal FROM encargado JOIN empleado ON encargado.ci_empleado = empleado.ci_empleado ORDER BY ci_empleado OFFSET $1 LIMIT $2', [offset, limit]);

        const totalPages = Math.ceil(count / size);

        res.status(200).json({
            success: true,
            message: "Encargados recuperados con éxito",
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

const getManagerByCI = async (req, res) => {
    try {
        const ci = req.params.ci;
        const response = await pool.query('SELECT encargado.*, empleado.nombre as nombre, empleado.cargo_ocupado as cargo_ocupado, empleado.direccion as direccion, empleado.sueldo as sueldo, empleado.telefono_principal as telefono_principal FROM encargado JOIN empleado ON encargado.ci_empleado = empleado.ci_empleado WHERE empleado.ci_empleado = $1', [ci]);

        if (response.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe encargado con esta cedula de identidad",
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Encargado recuperado con exito",
                items: response.rows
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

const getAllManagers = async (req, res) => {
    try {
        const response = await pool.query('SELECT encargado.*, empleado.nombre as nombre, empleado.cargo_ocupado as cargo_ocupado, empleado.direccion as direccion, empleado.sueldo as sueldo, empleado.telefono_principal as telefono_principal FROM encargado JOIN empleado ON encargado.ci_empleado = empleado.ci_empleado ORDER BY ci_empleado');
        res.status(200).json({
            success: true,
            message: "Encargados recuperados con éxito",
            items: response.rows
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Ha ocurrido un problema",
        });
    }
}

module.exports = {
    getManagers,
    getManagerByCI,
    getAllManagers
}