const { pool } = require("../../databases/db");

const updateProduct = async (req, res) => {
  try {
    const codigo = req.params.codigo;
    const {
      codigo_linea_s,
      nombre_corto,
      descripcion,
      es_ecologico,
      precio,
      existencia,
      existencia_minima,
      existencia_maxima,
      proveedor
    } = req.body;

    const verify = await pool.query(
      "SELECT * FROM producto WHERE codigo = $1",
      [codigo]
    );

    if (verify.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "No existe producto con este codigo",
      });
    } else {
      const response = await pool.query(
        "UPDATE producto SET codigo_linea_s = $1, nombre_corto = $2, descripcion = $3, es_ecologico = $4, precio = $5, existencia = $6, existencia_minima = $7, existencia_maxima = $8, proveedor = $9 WHERE codigo = $10 RETURNING *",
        [
          codigo_linea_s,
          nombre_corto,
          descripcion,
          es_ecologico,
          precio,
          existencia,
          existencia_minima,
          existencia_maxima,
          proveedor,
          codigo        ]
      );

      res.status(200).json({
        success: true,
        message: "Producto actualizado con exito",
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
  updateProduct,
};
