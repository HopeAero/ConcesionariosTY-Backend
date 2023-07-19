const { pool } = require("../../databases/db");

const posterPayment = async (req, res) => {
  try {
    const { id, monto, fecha, nro_rif, nro_tarjeta, tipo_pago,tipo_pago_secundario, nro_factura } =
      req.body;

    const verify = await pool.query("SELECT * FROM pago WHERE id = $1", [id]);

    if (verify.rows.length > 0) {
      res.status(404).json({
        success: false,
        message: "Ya existe un pago registrado con este codigo",
      });
    } else {
      const validate = await pool.query('SELECT * FROM tarjeta WHERE nro_tarjeta = $1', [nro_tarjeta]);
      if (validate.rows.length === 0 && nro_tarjeta!==null && nro_tarjeta !== undefined) {
        res.status(404).json({
            success: false,
            message: "Debe colocar el numero de una tarjeta existente",
        });
    }else{
      const validate2 = await pool.query('SELECT * FROM factura WHERE nro_factura = $1', [nro_factura]);
      
      if (validate2.rows.length === 0) {
          res.status(404).json({
              success: false,
              message: "Debe colocar el numero de una factura existente",
          });
      }else{
        if (tipo_pago_secundario !== null && tipo_pago_secundario !== undefined) {
          const response = await pool.query(
            "INSERT INTO pago (id,  monto,fecha,  nro_rif, nro_tarjeta,  tipo_pago, tipo_pago_secundario, nro_factura) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
            [id, monto, fecha, nro_rif, nro_tarjeta, tipo_pago, tipo_pago_secundario, nro_factura]
          );
    
          res.status(200).json({
            success: true,
            message: "Pago registrado con exito",
            items: response.rows,
          });   
        }else{
          const response = await pool.query(
            "INSERT INTO pago (id,  monto,fecha,  nro_rif, nro_tarjeta,  tipo_pago, nro_factura) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            [id, monto, fecha, nro_rif, nro_tarjeta, tipo_pago, nro_factura]
          );
    
          res.status(200).json({
            success: true,
            message: "Pago registrado con exito",
            items: response.rows,
          });
        }
      }
    }
      
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Ha ocurrido un problema",
    });
    console.log(error);
  }
};

module.exports = {
  posterPayment,
};
