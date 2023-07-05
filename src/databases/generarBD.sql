CREATE DOMAIN dom_fechas AS date
    CHECK (VALUE IS NOT NULL);

CREATE DOMAIN dom_nombre AS VARCHAR(30)
	CHECK (value ~ '^[a-zA-Z áéíóúÁÉÍÓÚ]+$' AND TRIM(value) <> '');

CREATE DOMAIN cedula VARCHAR(8)
    CHECK (VALUE ~ '^[0-9]*$')

CREATE TABLE ESTADO (
    id SERIAL PRIMARY KEY,
    nombre dom_nombre NOT NULL
);

CREATE TABLE CIUDAD (
    id_estado INTEGER NOT NULL,
    nro_ciudad SERIAL,
    nombre dom_nombre NOT NULL,
    CONSTRAINT pk_ciudad PRIMARY KEY (id_estado, nro_ciudad),
    CONSTRAINT fk_id_estado FOREIGN KEY (id_estado) REFERENCES ESTADO(id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE FUNCTION validar_telefono_secundario(p_telefono_secundario BIGINT, p_ci_cliente VARCHAR(8)) RETURNS BOOLEAN AS $$
BEGIN
  IF p_telefono_secundario IS NOT NULL AND EXISTS (
      SELECT 1 
      FROM CLIENTE 
      WHERE telefono_principal = p_telefono_secundario
      AND CI_Cliente <> COALESCE(p_ci_cliente, CLIENTE.CI_Cliente)
  ) THEN
    RETURN FALSE;
  END IF;
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE AGENCIA (
    RIF VARCHAR(10) PRIMARY KEY,
    Razon_social VARCHAR(30) NOT NULL,
    id_estado INTEGER NOT NULL,
    nro_ciudad INTEGER NOT NULL,
    CONSTRAINT fk_id_estado_ciudad FOREIGN KEY (id_estado, nro_ciudad) REFERENCES CIUDAD(id_estado, nro_ciudad) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE CLIENTE (
    CI_Cliente cedula PRIMARY KEY,
    nombre dom_nombre NOT NULL,
    direccion VARCHAR(30) NOT NULL,
    telefono_principal BIGINT NOT NULL UNIQUE,
    telefono_secundario BIGINT NULL UNIQUE,
    correo_electronico VARCHAR(100) NOT NULL CONSTRAINT ck_correo CHECK (correo_electronico LIKE '%_@%.%'),
    es_frecuente BOOLEAN DEFAULT FALSE,
    CONSTRAINT ck_telefono_secundario_telefono_principal CHECK (
        validar_telefono_secundario(telefono_secundario, CI_Cliente)
    )
);

CREATE TABLE EMPLEADO (
    CI_Empleado cedula PRIMARY KEY,
    nombre dom_nombre NOT NULL,
    direccion VARCHAR(30) NOT NULL,
    sueldo FLOAT NOT NULL CHECK (sueldo > 0),
    telefono_principal BIGINT NOT NULL UNIQUE,
    cargo_ocupado VARCHAR(15) NOT NULL,
    tipo_empleado VARCHAR(10) NOT NULL
);

CREATE TABLE MODELO (
    codigo INTEGER PRIMARY KEY,
    nombre dom_nombre NOT NULL,
    tipo_refrigerante VARCHAR(30) NOT NULL,
    cantidad_puestos INTEGER NOT NULL,
    peso FLOAT NOT NULL CHECK (peso > 0),
    aceite_motor VARCHAR(15) NOT NULL,
    gasolina_recomendada VARCHAR(15) NOT NULL,
    marca VARCHAR(15) NOT NULL
);

CREATE TABLE VEHICULO (
    placa VARCHAR(10) PRIMARY KEY,
    año_Salida dom_fechas NOT NULL,
    nro_de_serial INTEGER NOT NULL,
    nro_de_motor INTEGER NOT NULL,
    concesionario_vendido VARCHAR(30) NOT NULL,
    color VARCHAR(15) NOT NULL,
    fecha_de_venta dom_fechas NOT NULL,
    CI_Cliente cedula NOT NULL,
    codigo_modelo INTEGER NOT NULL,
    CONSTRAINT fk_CI_Cliente FOREIGN KEY (CI_Cliente) REFERENCES CLIENTE(CI_Cliente) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_codigo_modelo FOREIGN KEY (codigo_modelo) REFERENCES MODELO(codigo) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE SERVICIO (
    codigo INTEGER PRIMARY KEY,
    nombre dom_nombre NOT NULL,
    tiempo_reserva dom_fechas NOT NULL,
    descripcion_detallada VARCHAR(40) NOT NULL,
    costo_hora_hombre FLOAT NOT NULL,
    RIF_agencia VARCHAR(10) NOT NULL,
    CI_Empleado cedula NOT NULL,
    CONSTRAINT fk_RIF_agencia FOREIGN KEY (RIF_agencia) REFERENCES AGENCIA(RIF) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_CI_Empleado FOREIGN KEY (CI_Empleado) REFERENCES EMPLEADO(CI_Empleado) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE ANALISTA (
    CI_Empleado cedula PRIMARY KEY,
    CONSTRAINT fk_CI_Empleado FOREIGN KEY (CI_Empleado) REFERENCES EMPLEADO(CI_Empleado) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE ORDEN_DE_SERVICIO (
    codigo INTEGER PRIMARY KEY,
    dia_entrada dom_fechas NOT NULL,
    hora_entrada TIME NOT NULL,
    dia_salida_real dom_fechas NOT NULL,
    hora_salida_real TIME NOT NULL,
    dia_salida_est dom_fechas NOT NULL,
    hora_salida_est TIME NOT NULL,
    retirante_CI cedula NOT NULL,
    placa_vehiculo VARCHAR(10) NOT NULL,
    CI_Empleado cedula NOT NULL,
    CONSTRAINT fk_placa_vehiculo FOREIGN KEY (placa_vehiculo) REFERENCES VEHICULO(placa) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_CI_Empleado FOREIGN KEY (CI_Empleado) REFERENCES ANALISTA(CI_Empleado) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE LINEA_SUMINISTRO (
    codigo INTEGER PRIMARY KEY,
    descripcion VARCHAR(30) NOT NULL
);

CREATE TABLE PRODUCTO (
    codigo INTEGER PRIMARY KEY,
    nombre_corto VARCHAR(15) NOT NULL,
    descripcion VARCHAR(30) NOT NULL,
    es_ecologico BOOLEAN DEFAULT FALSE,
    telefono_secundario BIGINT NULL UNIQUE,
    correo_electronico VARCHAR(100) NOT NULL CONSTRAINT ck_correo CHECK (correo_electronico LIKE '%_@__%.__%'),
    precio FLOAT NOT NULL CHECK (precio > 0),
    existencia INTEGER NOT NULL,
    existencia_minima INTEGER NOT NULL,
    existencia_maxima INTEGER NOT NULL,
    proveedor VARCHAR(30) NOT NULL,
    codigo_linea_s INTEGER NOT NULL,
    CONSTRAINT fk_codigo_linea_s FOREIGN KEY (codigo_linea_s) REFERENCES LINEA_SUMINISTRO(codigo) ON UPDATE CASCADE ON DELETE RESTRICT
);