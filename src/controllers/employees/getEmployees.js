const {pool} = require('./../../databases/db');

const getEmployees = async (req, res) => {
    try {
        const { page = 1, size = 10 } = req.query;

        const offset = (page - 1) * size;
        const limit = size;

        const countResponse = await pool.query('SELECT COUNT(*) FROM empleado');
        const count = parseInt(countResponse.rows[0].count);

        const response = await pool.query('SELECT * FROM empleado ORDER BY ci_empleado OFFSET $1 LIMIT $2', [offset, limit]);

        const totalPages = Math.ceil(count / size);

        res.status(200).json({
            success: true,
            message: "Empleados recuperados con éxito",
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

const getEmployeesByCI = async (req, res) => {
    try {
        const ci = req.params.ci;
        const response = await pool.query('SELECT * FROM empleado WHERE ci_empleado = $1', [ci]);

        if (response.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe empleado con esta cedula de identidad",
            });
        } else {
            res.status(200).json({
                success: true,
                message: "Empleado recuperado con exito",
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

const getEmployeesByTipo = async (req, res) => {
    try {
        const tipo_empleado = req.params.tipo_empleado;
        const response = await pool.query('SELECT * FROM empleado WHERE tipo_empleado = $1', [tipo_empleado]);

        if (response.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: "No existe empleado de este tipo",
            });
        } else {
            res.status(200).json({
                success: true,
                message: `${tipo_empleado} recuperado con exito`,
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


module.exports = {
    getEmployees,
    getEmployeesByCI,
    getEmployeesByTipo
}