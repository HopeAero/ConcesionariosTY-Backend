CREATE DOMAIN dom_fechas AS date
    CHECK (VALUE IS NOT NULL);

CREATE DOMAIN dom_nombre AS VARCHAR(30)
	CHECK (value ~ '^[a-zA-Z áéíóúÁÉÍÓÚ]+$' AND TRIM(value) <> '');

CREATE DOMAIN cedula VARCHAR(8)
    CHECK (VALUE ~ '^[0-9]*$');

CREATE DOMAIN rif VARCHAR(10)
    CHECK (VALUE ~ '^[0-9]*$');

CREATE DOMAIN tipo_pago AS VARCHAR(3)
    CHECK (VALUE IN ('USD', 'BSS', 'TBS', 'TDS'));

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

CREATE FUNCTION validar_telefono_secundario(p_telefono_secundario VARCHAR(11), p_ci_cliente VARCHAR(8)) RETURNS BOOLEAN AS $$
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
    RIF rif PRIMARY KEY,
    Razon_social VARCHAR(30) NOT NULL,
    id_estado INTEGER NOT NULL,
    nro_ciudad INTEGER NOT NULL,
    CONSTRAINT fk_id_estado_ciudad FOREIGN KEY (id_estado, nro_ciudad) REFERENCES CIUDAD(id_estado, nro_ciudad) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE CLIENTE (
    CI_Cliente cedula PRIMARY KEY,
    nombre dom_nombre NOT NULL,
    direccion VARCHAR(30) NOT NULL,
    telefono_principal VARCHAR(11) NOT NULL ,
    telefono_secundario VARCHAR(11) NULL,
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
    telefono_principal VARCHAR(11) NOT NULL UNIQUE,
    cargo_ocupado VARCHAR(30) NOT NULL,
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
    tiempo_reserva interval NOT NULL,
    descripcion_detallada VARCHAR(40) NOT NULL,
    costo_hora_hombre FLOAT NOT NULL,
    RIF_agencia rif NOT NULL,
    CI_Empleado cedula NOT NULL,
    CONSTRAINT ck_tiempo_reserva CHECK (tiempo_reserva >= INTERVAL '1 day' AND tiempo_reserva <= INTERVAL '1 week'),
    CONSTRAINT fk_RIF_agencia FOREIGN KEY (RIF_agencia) REFERENCES AGENCIA(RIF) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_S_empleado FOREIGN KEY (CI_Empleado) REFERENCES EMPLEADO(CI_Empleado) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE ANALISTA (
    CI_Empleado cedula PRIMARY KEY,
    CONSTRAINT fk_A_empleado FOREIGN KEY (CI_Empleado) REFERENCES EMPLEADO(CI_Empleado) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE ORDEN_DE_SERVICIO (
    codigo INTEGER PRIMARY KEY,
    fecha_entrada TIMESTAMP NOT NULL,
    fecha_salida_real TIMESTAMP NOT NULL,
    fecha_salida_est TIMESTAMP NOT NULL,
    retirante_CI cedula NOT NULL,
    retirante_nombre dom_nombre NOT NULL,
    kilometraje INTEGER NOT NULL,
    tiempo_de_uso INTERVAL NOT NULL,
    placa_vehiculo VARCHAR(10) NOT NULL,
    CI_Empleado cedula NOT NULL,
    CONSTRAINT fk_placa_vehiculo FOREIGN KEY (placa_vehiculo) REFERENCES VEHICULO(placa) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_ODS_empleado FOREIGN KEY (CI_Empleado) REFERENCES ANALISTA(CI_Empleado) ON UPDATE CASCADE ON DELETE RESTRICT
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
    precio FLOAT NOT NULL CHECK (precio > 0),
    existencia INTEGER NOT NULL,
    existencia_minima INTEGER NOT NULL,
    existencia_maxima INTEGER NOT NULL,
    proveedor VARCHAR(30) NOT NULL,
    codigo_linea_s INTEGER NOT NULL,
    CONSTRAINT fk_codigo_linea_s FOREIGN KEY (codigo_linea_s) REFERENCES LINEA_SUMINISTRO(codigo) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE FACTURA (
    nro_factura INTEGER PRIMARY KEY,
    monto_total FLOAT NOT NULL CHECK(monto_total > 0),
    porcentaje_descuento FLOAT NULL,
    fecha dom_fechas NOT NULL,
    codigo_orden_servicio INTEGER NOT NULL,
    CONSTRAINT fk_codigo_orden_servicio FOREIGN KEY (codigo_orden_servicio) REFERENCES ORDEN_DE_SERVICIO(codigo) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE TARJETA (
    nro_tarjeta BIGINT PRIMARY KEY,
    banco dom_nombre NOT NULL
);

CREATE TABLE PAGO (
    id INTEGER PRIMARY KEY,
    monto FLOAT NOT NULL CHECK(monto > 0),
    fecha dom_fechas NOT NULL,
    nro_rif rif NOT NULL,
    nro_tarjeta BIGINT NULL,
    tipo_pago tipo_pago NOT NULL,
    nro_factura INTEGER not NULL,
    CONSTRAINT fk_nro_tarjeta FOREIGN KEY (nro_tarjeta) REFERENCES TARJETA(nro_tarjeta) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_nro_factura FOREIGN KEY (nro_factura) REFERENCES FACTURA(nro_factura) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE RESERVA (
    id_reserva INTEGER PRIMARY KEY,
    placa_vehiculo VARCHAR(10) NOT NULL,
    CONSTRAINT fk_R_placa_vehiculo FOREIGN KEY (placa_vehiculo) REFERENCES VEHICULO(placa) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE ACTIVIDAD (
    nro_actividad INTEGER NOT NULL,
    codigo_servicio INTEGER NOT NULL,
    descripcion VARCHAR(30) NOT NULL,
    costo_actual_actividad FLOAT NOT NULL CHECK(costo_actual_actividad > 0),
    CONSTRAINT pk_actividad PRIMARY KEY (codigo_servicio, nro_actividad),
    CONSTRAINT fk_codigo_servicio FOREIGN KEY (codigo_servicio) REFERENCES SERVICIO(codigo) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE ENCARGADO (
    CI_Empleado cedula PRIMARY KEY,
    telefono_secundario VARCHAR(11) NOT NULL UNIQUE,
    correo_electronico VARCHAR(30) NOT NULL,
    rif_agencia rif NOT NULL UNIQUE,
    CONSTRAINT fk_E_empleado FOREIGN KEY (CI_Empleado) REFERENCES EMPLEADO(CI_Empleado) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_E_agencia FOREIGN KEY (rif_agencia) REFERENCES AGENCIA(RIF) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT ck_telefono_secundario_telefono_principal CHECK (
        validar_telefono_secundario(telefono_secundario, CI_Empleado)
    )
);

CREATE TABLE ESPECIALIZA (
    CI_Empleado cedula NOT NULL,
    codigo_servicio INTEGER NOT NULL,
    CONSTRAINT pk_especializa PRIMARY KEY (CI_Empleado, codigo_servicio),
    CONSTRAINT fk_ES_empleado FOREIGN KEY (CI_Empleado) REFERENCES EMPLEADO(CI_Empleado) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_E_servicio FOREIGN KEY (codigo_servicio) REFERENCES SERVICIO(codigo) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE UTILIZA (
    CI_Empleado cedula NOT NULL,
    nro_actividad INTEGER NOT NULL,
    codigo_servicio INTEGER NOT NULL,
    codigo_producto INTEGER NOT NULL,
    cantidad_producto INTEGER NOT NULL,
    precio_producto FLOAT NOT NULL CHECK(precio_producto > 0),    
    CONSTRAINT pk_utiliza PRIMARY KEY (CI_Empleado, codigo_producto, codigo_servicio, nro_actividad),
    CONSTRAINT fk_U_actividad FOREIGN KEY (codigo_servicio,nro_actividad) REFERENCES ACTIVIDAD(codigo_servicio,nro_actividad) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_U_empleado FOREIGN KEY (CI_Empleado) REFERENCES EMPLEADO(CI_Empleado) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_producto FOREIGN KEY (codigo_producto) REFERENCES PRODUCTO(codigo) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE DETALLA (
    codigo_orden_servicio INTEGER NOT NULL,
    codigo_servicio INTEGER NOT NULL,
    nro_actividad INTEGER NOT NULL,
    horas_requeridas TIME NOT NULL,
    costo_actividad FLOAT NOT NULL CHECK(costo_actividad > 0),    
    CONSTRAINT pk_detalla PRIMARY KEY (codigo_orden_servicio, codigo_servicio, nro_actividad),
    CONSTRAINT fk_orden_servicio FOREIGN KEY (codigo_orden_servicio) REFERENCES ORDEN_DE_SERVICIO(codigo) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_actividad FOREIGN KEY (codigo_servicio, nro_actividad) REFERENCES ACTIVIDAD(codigo_servicio, nro_actividad) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE TRABAJA (
    rif_agencia rif NOT NULL,
    CI_Empleado cedula NOT NULL,
    CONSTRAINT pk_trabaja PRIMARY KEY (rif_agencia, CI_Empleado),
    CONSTRAINT fk_T_agencia FOREIGN KEY (rif_agencia) REFERENCES AGENCIA(RIF) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_T_empleado FOREIGN KEY (CI_Empleado) REFERENCES EMPLEADO(CI_Empleado) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE CONTRATA (
    id_reserva INTEGER NOT NULL,
    codigo_servicio INTEGER NOT NULL,
    CONSTRAINT pk_contrata PRIMARY KEY (id_reserva, codigo_servicio),
    CONSTRAINT fk_reserva FOREIGN KEY (id_reserva) REFERENCES RESERVA(id_reserva) ON UPDATE CASCADE ON DELETE RESTRICT,
    CONSTRAINT fk_C_servicio FOREIGN KEY (codigo_servicio) REFERENCES SERVICIO(codigo) ON UPDATE CASCADE ON DELETE RESTRICT
);