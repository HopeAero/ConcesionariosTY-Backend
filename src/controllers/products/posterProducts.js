const { pool } = require("../../databases/db");

const posterProduct = async (req, res) => {
  try {
    const { codigo,
        nombre_corto,
        descripcion,
        es_ecologico,
        precio,
        existencia,
        existencia_minima,
        existencia_maxima,
        proveedor,
        codigo_linea_s } = req.body;

    const verify = await pool.query(
      "SELECT * FROM producto WHERE codigo_linea_s = $1",
      [codigo_linea_s]
    );

    if (verify.rows.length > 0) {
      res.status(404).json({
        success: false,
        message:
          "Ya existe un producto con este codigo de linea de suministro",
      });
    } else {
      const response = await pool.query(
        "INSERT INTO producto (codigo, nombre_corto, descripcion, es_ecologico, precio, existencia, existencia_minima, existencia_maxima, proveedor, codigo_linea_s) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
        [
          codigo,
          nombre_corto,
          descripcion,
          es_ecologico,
          precio,
          existencia,
          existencia_minima,
          existencia_maxima,
          proveedor,
          codigo_linea_s,
        ]
      );
  
      res.status(200).json({
        success: true,
        message: "Producto insertado con exito",
        items: response.rows,
      });
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
  posterProduct,
};
