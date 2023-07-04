CREATE DOMAIN dom_fechas AS date
    CHECK (VALUE IS NOT NULL);

CREATE DOMAIN dom_nombre AS VARCHAR(30)
	CHECK (value ~ '^[a-zA-Z áéíóúÁÉÍÓÚ]+$' AND TRIM(value) <> '');

CREATE DOMAIN cedula CHAR(8)
    CHECK (VALUE ~ '^[0-9]{1,8}$');

CREATE TABLE ESTADO (
    id SERIAL PRIMARY KEY,
    nombre dom_nombre NOT NULL
);

CREATE TABLE CIUDAD (
    id_estado INTEGER NOT NULL,
    nro_ciudad SERIAL,
    nombre dom_nombre NOT NULL,
    CONSTRAINT pk_ciudad PRIMARY KEY (id_estado, nro_ciudad),
    CONSTRAINT fk_id_estado FOREIGN KEY (id_estado) REFERENCES ESTADO(id)
);

CREATE TABLE AGENCIA (
    RIF INTEGER PRIMARY KEY,
    Razon_social VARCHAR(30) NOT NULL,
    id_estado INTEGER NOT NULL,
    nro_ciudad INTEGER NOT NULL,
    CONSTRAINT fk_id_estado_ciudad FOREIGN KEY (id_estado, nro_ciudad) REFERENCES CIUDAD(id_estado, nro_ciudad)
);

CREATE TABLE CLIENTE (
    CI_Cliente cedula PRIMARY KEY,
    nombre dom_nombre NOT NULL,
    direccion VARCHAR(30) NOT NULL,
    telefono_principal BIGINT NOT NULL UNIQUE
    telefono_secundario BIGINT NULL UNIQUE,
    correo_electronico VARCHAR(100) NOT NULL CONSTRAINT ck_correo CHECK (correo_electronico LIKE '%_@__%.__%'),
    es_frecuente BOOLEAN DEFAULT FALSE
);
