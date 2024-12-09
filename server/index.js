const express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Andres1702932599",
    database: "veterinaria"
});

// Añadir manejo de errores para la conexión
db.connect((err) => {
    if (err) {
        console.error('Error detallado de conexión:', {
            code: err.code,
            errno: err.errno,
            sqlMessage: err.sqlMessage,
            sqlState: err.sqlState,
            fatal: err.fatal
        });
        return;
    }
    console.log('Conexión exitosa a la base de datos MySQL');
});

// Manejar errores de conexión
db.on('error', function(err) {
    console.error('Error de base de datos:', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('Se perdió la conexión con la base de datos');
    } else if(err.code === 'ER_CON_COUNT_ERROR') {
        console.log('La base de datos tiene demasiadas conexiones');
    } else if(err.code === 'ECONNREFUSED') {
        console.log('La conexión fue rechazada');
    }
});

// Rutas de prueba
app.get("/test", (req, res) => {
    res.json({ message: "Servidor funcionando correctamente" });
});

app.get("/test-db", (req, res) => {
    if (!db || db.state === 'disconnected') {
        res.status(500).json({ error: 'No hay conexión a la base de datos' });
        return;
    }

    db.query('SELECT 1 + 1 AS result', (err, results) => {
        if (err) {
            console.error('Error en consulta de prueba:', {
                code: err.code,
                errno: err.errno,
                sqlMessage: err.sqlMessage,
                sqlState: err.sqlState
            });
            res.status(500).json({ 
                error: 'Error en la consulta de base de datos',
                details: err.code
            });
            return;
        }
        res.json({ 
            message: "Conexión exitosa",
            testQuery: results[0].result 
        });
    });
});

//crear cita
app.post("/create", (req, res) => {
    const { fecha, motivo, estado, hora, mascotas_idmascotas, veterinarios_idveterinarios } = req.body;
    
    db.query(
        'CALL sp_crear_cita(?, ?, ?, ?, ?, ?, @resultado, @id_generado)',
        [fecha, hora, motivo, estado, mascotas_idmascotas, veterinarios_idveterinarios],
        (error, results) => {
            if (error) {
                console.error("Error al llamar al SP:", error);
                return res.status(500).json({
                    error: "Error al registrar la cita",
                    details: error.message
                });
            }
            
            // Obtener los valores de salida
            db.query(
                'SELECT @resultado as resultado, @id_generado as id_generado',
                (err, results) => {
                    if (err) {
                        return res.status(500).json({
                            error: "Error al obtener el resultado",
                            details: err.message
                        });
                    }
                    
                    const { resultado, id_generado } = results[0];
                    
                    if (id_generado === 0) {
                        return res.status(400).json({
                            error: resultado
                        });
                    }
                    
                    res.json({
                        message: resultado,
                        id: id_generado
                    });
                }
            );
        }
    );
});

// Actualizar cita 
app.put("/update-cita/:id", (req, res) => {
    const id = req.params.id;
    const { fecha, hora, motivo, estado, mascotas_idmascotas, veterinarios_idveterinarios } = req.body;
    
    db.query(
        'CALL sp_actualizar_cita(?, ?, ?, ?, ?, ?, ?, @resultado)',
        [id, fecha, hora, motivo, estado, mascotas_idmascotas, veterinarios_idveterinarios],
        (error, results) => {
            if (error) {
                console.error("Error al llamar al SP:", error);
                return res.status(500).json({
                    error: "Error al actualizar la cita",
                    details: error.message
                });
            }
            
            // Obtener el resultado
            db.query(
                'SELECT @resultado as resultado',
                (err, results) => {
                    if (err) {
                        return res.status(500).json({
                            error: "Error al obtener el resultado",
                            details: err.message
                        });
                    }
                    
                    const { resultado } = results[0];
                    
                    if (resultado === 'La cita no existe') {
                        return res.status(404).json({
                            error: resultado
                        });
                    }
                    
                    if (resultado.startsWith('Error')) {
                        return res.status(500).json({
                            error: resultado
                        });
                    }
                    
                    res.json({
                        message: resultado
                    });
                }
            );
        }
    );
});

// Eliminar cita 
app.delete("/delete-cita/:id", (req, res) => {
    const id = req.params.id;
    
    db.query(
        'CALL sp_eliminar_cita(?, @resultado)',
        [id],
        (error, results) => {
            if (error) {
                console.error("Error al llamar al SP:", error);
                return res.status(500).json({
                    error: "Error al eliminar la cita",
                    details: error.message
                });
            }
            
            // Obtener el resultado
            db.query(
                'SELECT @resultado as resultado',
                (err, results) => {
                    if (err) {
                        return res.status(500).json({
                            error: "Error al obtener el resultado",
                            details: err.message
                        });
                    }
                    
                    const { resultado } = results[0];
                    
                    if (resultado === 'La cita no existe') {
                        return res.status(404).json({
                            error: resultado
                        });
                    }
                    
                    if (resultado.startsWith('Error')) {
                        return res.status(500).json({
                            error: resultado
                        });
                    }
                    
                    res.json({
                        message: resultado
                    });
                }
            );
        }
    );
});

//Crear mascota
app.post("/create-mascota", (req, res) => {
    const { nombre, fechanacimiento, peso, especies_idespecies, duenos_idduenos } = req.body;
    
    db.query(
        'CALL sp_crear_mascota(?, ?, ?, ?, ?, @resultado, @id_generado)',
        [nombre, fechanacimiento, peso, especies_idespecies, duenos_idduenos],
        (error, results) => {
            if (error) {
                console.error("Error al llamar al SP:", error);
                return res.status(500).json({
                    error: "Error al registrar la mascota",
                    details: error.message
                });
            }
            
            // Obtener los valores de salida
            db.query(
                'SELECT @resultado as resultado, @id_generado as id_generado',
                (err, results) => {
                    if (err) {
                        return res.status(500).json({
                            error: "Error al obtener el resultado",
                            details: err.message
                        });
                    }
                    
                    const { resultado, id_generado } = results[0];
                    
                    if (id_generado === 0) {
                        return res.status(400).json({
                            error: resultado,
                            receivedData: req.body
                        });
                    }
                    
                    res.json({
                        message: resultado,
                        id: id_generado
                    });
                }
            );
        }
    );
});

//Crear especie
app.post("/create-especie", (req, res) => {
    const { nombre, descripcion } = req.body;
    
    db.query(
        'CALL sp_crear_especie(?, ?, @resultado, @id_generado)',
        [nombre, descripcion],
        (error, results) => {
            if (error) {
                console.error("Error al llamar al SP:", error);
                return res.status(500).json({
                    error: "Error al registrar la especie",
                    details: error.message
                });
            }
            
            // Obtener los valores de salida
            db.query(
                'SELECT @resultado as resultado, @id_generado as id_generado',
                (err, results) => {
                    if (err) {
                        return res.status(500).json({
                            error: "Error al obtener el resultado",
                            details: err.message
                        });
                    }
                    
                    const { resultado, id_generado } = results[0];
                    
                    if (id_generado === 0) {
                        return res.status(400).json({
                            error: resultado,
                            receivedData: { nombre, descripcion }
                        });
                    }
                    
                    res.json({
                        message: resultado,
                        id: id_generado
                    });
                }
            );
        }
    );
});

//Crear dueno
app.post("/create-dueno", (req, res) => {
    const { nombre, apellido, telefono, email, direccion } = req.body;
    
    db.query(
        'CALL sp_crear_dueno(?, ?, ?, ?, ?, @resultado, @id_generado)',
        [nombre, apellido, telefono, email, direccion],
        (error, results) => {
            if (error) {
                console.error("Error al llamar al SP:", error);
                return res.status(500).json({
                    error: "Error al registrar el dueño",
                    details: error.message
                });
            }
            
            // Obtener los valores de salida
            db.query(
                'SELECT @resultado as resultado, @id_generado as id_generado',
                (err, results) => {
                    if (err) {
                        return res.status(500).json({
                            error: "Error al obtener el resultado",
                            details: err.message
                        });
                    }
                    
                    const { resultado, id_generado } = results[0];
                    
                    if (id_generado === 0) {
                        return res.status(400).json({
                            error: resultado,
                            receivedData: { nombre, apellido, telefono, email, direccion }
                        });
                    }
                    
                    res.json({
                        message: resultado,
                        id: id_generado
                    });
                }
            );
        }
    );
});

//actualizar mascota
app.put("/update-mascota/:id", (req, res) => {
    const id = req.params.id;
    const { nombre, fechanacimiento, peso, especies_idespecies, duenos_idduenos } = req.body;
    
    console.log("ID recibido:", id);
    console.log("Datos recibidos:", {
        nombre,
        fechanacimiento,
        peso,
        especies_idespecies,
        duenos_idduenos
    });
    
    db.query(
        'CALL sp_actualizar_mascota(?, ?, ?, ?, ?, ?, @resultado, @filas_afectadas)',
        [id, nombre, fechanacimiento, peso, especies_idespecies, duenos_idduenos],
        (error, results) => {
            if (error) {
                console.error("Error al llamar al SP:", error);
                return res.status(500).json({
                    error: "Error al actualizar la mascota",
                    details: error.message,
                    sqlMessage: error.sqlMessage,
                    sqlState: error.sqlState
                });
            }
            
            // Obtener los valores de salida
            db.query(
                'SELECT @resultado as resultado, @filas_afectadas as filas_afectadas',
                (err, results) => {
                    if (err) {
                        console.error("Error al obtener resultado:", err);
                        return res.status(500).json({
                            error: "Error al obtener el resultado",
                            details: err.message
                        });
                    }
                    
                    const { resultado, filas_afectadas } = results[0];
                    
                    if (filas_afectadas === 0) {
                        console.log("No se realizó la actualización:", resultado);
                        return res.status(400).json({
                            error: resultado,
                            receivedData: { id, nombre, fechanacimiento, peso, especies_idespecies, duenos_idduenos }
                        });
                    }
                    
                    console.log("Actualización exitosa");
                    res.json({
                        message: resultado,
                        affectedRows: filas_afectadas
                    });
                }
            );
        }
    );
});

//delete mascota
app.delete("/delete-mascota/:id", (req, res) => {
    const id = req.params.id;
    
    db.query(
        'CALL sp_eliminar_mascota(?, @resultado, @filas_afectadas)',
        [id],
        (error, results) => {
            if (error) {
                console.error("Error al llamar al SP:", error);
                return res.status(500).json({
                    error: "Error al eliminar la mascota",
                    details: error.message
                });
            }
            
            // Obtener los valores de salida
            db.query(
                'SELECT @resultado as resultado, @filas_afectadas as filas_afectadas',
                (err, results) => {
                    if (err) {
                        return res.status(500).json({
                            error: "Error al obtener el resultado",
                            details: err.message
                        });
                    }
                    
                    const { resultado, filas_afectadas } = results[0];
                    
                    if (filas_afectadas === 0) {
                        return res.status(400).json({
                            error: resultado
                        });
                    }
                    
                    res.json({
                        message: resultado
                    });
                }
            );
        }
    );
});

// Crear veterinario
app.post("/create-veterinario", (req, res) => {
    const { nombre, apellido, telefono, email } = req.body;
    
    db.query(
        'CALL sp_crear_veterinario(?, ?, ?, ?, @resultado, @id_generado)',
        [nombre, apellido, telefono, email],
        (error, results) => {
            if (error) {
                console.error("Error al llamar al SP:", error);
                return res.status(500).json({
                    error: "Error al registrar el veterinario",
                    details: error.message
                });
            }
            
            db.query(
                'SELECT @resultado as resultado, @id_generado as id_generado',
                (err, results) => {
                    if (err) {
                        return res.status(500).json({
                            error: "Error al obtener el resultado",
                            details: err.message
                        });
                    }
                    
                    const { resultado, id_generado } = results[0];
                    
                    if (id_generado === 0) {
                        return res.status(400).json({
                            error: resultado,
                            receivedData: { nombre, apellido, telefono, email }
                        });
                    }
                    
                    res.json({
                        message: resultado,
                        id: id_generado
                    });
                }
            );
        }
    );
});

// Actualizar veterinario
app.put("/update-veterinario/:id", (req, res) => {
    const id = req.params.id;
    const { nombre, apellido, telefono, email, especialidad_ids } = req.body;
    
    console.log("Updating veterinario with ID:", id);
    console.log("Received data:", req.body);
    
    db.query(
        'CALL sp_actualizar_veterinario(?, ?, ?, ?, ?, ?, @resultado)',
        [id, nombre, apellido, telefono, email, especialidad_ids],
        (error, results) => {
            if (error) {
                console.error("Error al llamar al SP:", error);
                return res.status(500).json({
                    error: "Error al actualizar el veterinario",
                    details: error.message
                });
            }
            
            db.query(
                'SELECT @resultado as resultado',
                (err, results) => {
                    if (err) {
                        return res.status(500).json({
                            error: "Error al obtener el resultado",
                            details: err.message
                        });
                    }
                    
                    const { resultado } = results[0];
                    
                    if (resultado.startsWith('Error') || 
                        resultado === 'El veterinario no existe' ||
                        resultado === 'La especialidad especificada no existe') {
                        return res.status(400).json({
                            error: resultado,
                            receivedData: { id, nombre, apellido, telefono, email, especialidad_ids }
                        });
                    }
                    
                    res.json({
                        message: resultado
                    });
                }
            );
        }
    );
});

// Eliminar veterinario
app.delete("/delete-veterinario/:id", (req, res) => {
    const id = req.params.id;
    
    db.query(
        'CALL sp_eliminar_veterinario(?, @resultado)',
        [id],
        (error, results) => {
            if (error) {
                console.error("Error al llamar al SP:", error);
                return res.status(500).json({
                    error: "Error al eliminar el veterinario",
                    details: error.message
                });
            }
            
            db.query(
                'SELECT @resultado as resultado',
                (err, results) => {
                    if (err) {
                        return res.status(500).json({
                            error: "Error al obtener el resultado",
                            details: err.message
                        });
                    }
                    
                    const { resultado } = results[0];
                    
                    if (resultado.startsWith('Error') || 
                        resultado === 'El veterinario no existe' ||
                        resultado.includes('tiene citas asociadas')) {
                        return res.status(400).json({
                            error: resultado
                        });
                    }
                    
                    res.json({
                        message: resultado
                    });
                }
            );
        }
    );
});

// Crear factura
app.post("/create-factura", (req, res) => {
    const { 
        fecha_emision, fecha_vencimiento, subtotal, iva, total,
        estado_pago, metodo_pago, duenos_idduenos
    } = req.body;
    
    db.query(
        'CALL sp_crear_factura(?, ?, ?, ?, ?, ?, ?, ?, @resultado, @id_generado)',
        [fecha_emision, fecha_vencimiento, subtotal, iva, total, 
         estado_pago, metodo_pago, duenos_idduenos],
        (error, results) => {
            if (error) {
                console.error("Error al llamar al SP:", error);
                return res.status(500).json({
                    error: "Error al registrar la factura",
                    details: error.message
                });
            }
            
            db.query(
                'SELECT @resultado as resultado, @id_generado as id_generado',
                (err, results) => {
                    if (err) {
                        return res.status(500).json({
                            error: "Error al obtener el resultado",
                            details: err.message
                        });
                    }
                    
                    const { resultado, id_generado } = results[0];
                    
                    if (id_generado === 0) {
                        return res.status(400).json({
                            error: resultado,
                            receivedData: req.body
                        });
                    }
                    
                    res.json({
                        message: resultado,
                        id: id_generado
                    });
                }
            );
        }
    );
});

// Actualizar factura
app.put("/update-factura/:id", (req, res) => {
    const id = req.params.id;
    const {
        fecha_emision, fecha_vencimiento, subtotal, iva, total,
        estado_pago, metodo_pago, duenos_idduenos
    } = req.body;
    
    db.query(
        'CALL sp_actualizar_factura(?, ?, ?, ?, ?, ?, ?, ?, ?, @resultado)',
        [id, fecha_emision, fecha_vencimiento, subtotal, iva, total,
         estado_pago, metodo_pago, duenos_idduenos],
        (error, results) => {
            if (error) {
                console.error("Error al llamar al SP:", error);
                return res.status(500).json({
                    error: "Error al actualizar la factura",
                    details: error.message
                });
            }
            
            db.query(
                'SELECT @resultado as resultado',
                (err, results) => {
                    if (err) {
                        return res.status(500).json({
                            error: "Error al obtener el resultado",
                            details: err.message
                        });
                    }
                    
                    const { resultado } = results[0];
                    
                    if (resultado !== 'Factura actualizada con éxito') {
                        return res.status(400).json({
                            error: resultado,
                            receivedData: req.body
                        });
                    }
                    
                    res.json({
                        message: resultado
                    });
                }
            );
        }
    );
});

// Eliminar factura
app.delete("/delete-factura/:id", (req, res) => {
    const id = req.params.id;
    
    db.query(
        'CALL sp_eliminar_factura(?, @resultado)',
        [id],
        (error, results) => {
            if (error) {
                console.error("Error al llamar al SP:", error);
                return res.status(500).json({
                    error: "Error al eliminar la factura",
                    details: error.message
                });
            }
            
            db.query(
                'SELECT @resultado as resultado',
                (err, results) => {
                    if (err) {
                        return res.status(500).json({
                            error: "Error al obtener el resultado",
                            details: err.message
                        });
                    }
                    
                    const { resultado } = results[0];
                    
                    if (resultado !== 'Factura eliminada con éxito') {
                        return res.status(400).json({
                            error: resultado
                        });
                    }
                    
                    res.json({
                        message: resultado
                    });
                }
            );
        }
    );
});

// Crear tratamiento
app.post("/create-tratamiento", (req, res) => {
    const {
        diagnostico, 
        fecha_inicio, 
        fecha_fin,
        mascota_id,
        veterinario_id,
        motivo_cita
    } = req.body;
    
    db.query(
        'CALL sp_crear_tratamiento(?, ?, ?, ?, ?, ?, @resultado, @id_generado)',
        [diagnostico, fecha_inicio, fecha_fin, mascota_id, veterinario_id, motivo_cita],
        (error, results) => {
            if (error) {
                console.error("Error al llamar al SP:", error);
                return res.status(500).json({
                    error: "Error al registrar el tratamiento",
                    details: error.message
                });
            }
            
            db.query(
                'SELECT @resultado as resultado, @id_generado as id_generado',
                (err, results) => {
                    if (err) {
                        return res.status(500).json({
                            error: "Error al obtener el resultado",
                            details: err.message
                        });
                    }
                    
                    const { resultado, id_generado } = results[0];
                    
                    if (id_generado === 0) {
                        return res.status(400).json({
                            error: resultado,
                            receivedData: req.body
                        });
                    }
                    
                    res.json({
                        message: resultado,
                        idTratamiento: id_generado
                    });
                }
            );
        }
    );
});

// Actualizar tratamiento
app.put("/update-tratamiento/:id", (req, res) => {
    const id = req.params.id;
    const {
        diagnostico, 
        fecha_inicio, 
        fecha_fin,
        mascota_id,
        veterinario_id,
        motivo_cita
    } = req.body;
    
    db.query(
        'CALL sp_actualizar_tratamiento(?, ?, ?, ?, ?, ?, ?, @resultado)',
        [id, diagnostico, fecha_inicio, fecha_fin, mascota_id, veterinario_id, motivo_cita],
        (error, results) => {
            if (error) {
                console.error("Error al llamar al SP:", error);
                return res.status(500).json({
                    error: "Error al actualizar el tratamiento",
                    details: error.message
                });
            }
            
            db.query(
                'SELECT @resultado as resultado',
                (err, results) => {
                    if (err) {
                        return res.status(500).json({
                            error: "Error al obtener el resultado",
                            details: err.message
                        });
                    }
                    
                    const { resultado } = results[0];
                    
                    if (resultado !== 'Tratamiento y cita actualizados con éxito') {
                        return res.status(400).json({
                            error: resultado,
                            receivedData: req.body
                        });
                    }
                    
                    res.json({
                        message: resultado
                    });
                }
            );
        }
    );
});

// Eliminar tratamiento
app.delete("/delete-tratamiento/:id", (req, res) => {
    const id = req.params.id;
    
    db.query(
        'CALL sp_eliminar_tratamiento(?, @resultado)',
        [id],
        (error, results) => {
            if (error) {
                console.error("Error al llamar al SP:", error);
                return res.status(500).json({
                    error: "Error al eliminar el tratamiento",
                    details: error.message
                });
            }
            
            db.query(
                'SELECT @resultado as resultado',
                (err, results) => {
                    if (err) {
                        return res.status(500).json({
                            error: "Error al obtener el resultado",
                            details: err.message
                        });
                    }
                    
                    const { resultado } = results[0];
                    
                    if (resultado !== 'Tratamiento y registros relacionados eliminados con éxito') {
                        return res.status(400).json({
                            error: resultado
                        });
                    }
                    
                    res.json({
                        message: resultado
                    });
                }
            );
        }
    );
});

//create especialidad
app.post("/create-especialidad", (req, res) => {
    const { nombre, descripcion, anios_requeridos } = req.body;
    
    console.log("Datos recibidos:", {
        nombre, descripcion, anios_requeridos
    });
    
    db.query(
        'CALL sp_crear_especialidad(?, ?, ?, @resultado, @id_generado)',
        [nombre, descripcion, anios_requeridos],
        (error, results) => {
            if (error) {
                console.error("Error al llamar al SP:", error);
                return res.status(500).json({
                    error: "Error al registrar la especialidad",
                    details: error.message
                });
            }
            
            db.query(
                'SELECT @resultado as resultado, @id_generado as id_generado',
                (err, results) => {
                    if (err) {
                        return res.status(500).json({
                            error: "Error al obtener el resultado",
                            details: err.message
                        });
                    }
                    
                    const { resultado, id_generado } = results[0];
                    
                    if (id_generado === 0) {
                        return res.status(400).json({
                            error: resultado,
                            receivedData: { nombre, descripcion, anios_requeridos }
                        });
                    }
                    
                    res.json({
                        message: resultado,
                        id: id_generado
                    });
                }
            );
        }
    );
});



// Rutas de consulta
// Obtener todas las mascotas
app.get("/mascotas-info", (req, res) => {
    db.query(
        'CALL sp_obtener_mascotas_info()',
        (error, results) => {
            if (error) {
                console.error("Error al obtener mascotas:", error);
                return res.status(500).json({
                    error: "Error al cargar mascotas",
                    details: error.message
                });
            }
            
            // En los resultados de un SP, la primera posición contiene los registros
            res.json(results[0]);
        }
    );
});

// Obtener información de una mascota específica
app.get("/mascotas-info-tratamiento/:id", (req, res) => {
    const id = req.params.id;
    
    db.query(
        'CALL sp_obtener_mascota_info(?, @encontrado)',
        [id],
        (error, results) => {
            if (error) {
                console.error("Error al obtener mascota:", error);
                return res.status(500).json({
                    error: "Error al cargar información de la mascota",
                    details: error.message
                });
            }
            
            db.query(
                'SELECT @encontrado as encontrado',
                (err, checkResults) => {
                    if (err) {
                        return res.status(500).json({
                            error: "Error al verificar existencia de mascota",
                            details: err.message
                        });
                    }
                    
                    const { encontrado } = checkResults[0];
                    
                    if (!encontrado) {
                        return res.status(404).json({
                            error: "Mascota no encontrada"
                        });
                    }
                    
                    // El primer elemento del array contiene los resultados de la consulta
                    res.json(results[0][0]);
                }
            );
        }
    );
});

// Obtener información de veterinarios
app.get("/veterinarios-info", (req, res) => {
    db.query(
        'CALL sp_obtener_veterinarios_info()',
        (error, results) => {
            if (error) {
                console.error("Error al obtener veterinarios:", error);
                return res.status(500).json({
                    error: "Error al cargar veterinarios",
                    details: error.message
                });
            }
            
            // Log the data being sent
            console.log("Datos de veterinarios enviados:", results[0]);
            res.json(results[0]);
        }
    );
});

// Obtener información de facturas
app.get("/facturas-info", (req, res) => {
    db.query(
        'CALL sp_obtener_facturas_info()',
        (error, results) => {
            if (error) {
                console.error("Error al obtener facturas:", error);
                return res.status(500).json({
                    error: "Error al cargar facturas",
                    details: error.message
                });
            }
            
            res.json(results[0]);
        }
    );
});

// Obtener información de citas completas
app.get("/citas_completas", (req, res) => {
    db.query(
        'CALL sp_obtener_citas_completas()',
        (error, results) => {
            if (error) {
                console.error("Error al obtener citas:", error);
                return res.status(500).json({
                    error: "Error al cargar citas",
                    details: error.message
                });
            }
            
            res.json(results[0]);
        }
    );
});

// Obtener información de tratamientos y mascotas
app.get("/tratamientos-mascotas", (req, res) => {
    db.query(
        'CALL sp_obtener_tratamientos_mascotas()',
        (error, results) => {
            if (error) {
                console.error('Error al consultar tratamientos_mascotas:', error);
                return res.status(500).json({
                    error: 'Error en la consulta',
                    details: error.message
                });
            }
            
            res.json(results[0]);
        }
    );
});

// Obtener tratamientos por mascota
app.get("/tratamientos-by-mascota/:idMascota", (req, res) => {
    const idMascota = req.params.idMascota;
    
    db.query(
        'CALL sp_obtener_tratamientos_por_mascota(?, @encontrado)',
        [idMascota],
        (error, results) => {
            if (error) {
                console.error("Error al obtener tratamientos:", error);
                return res.status(500).json({
                    error: "Error al obtener tratamientos",
                    details: error.message
                });
            }
            
            db.query(
                'SELECT @encontrado as encontrado',
                (err, checkResults) => {
                    if (err) {
                        return res.status(500).json({
                            error: "Error al verificar existencia de mascota",
                            details: err.message
                        });
                    }
                    
                    const { encontrado } = checkResults[0];
                    
                    if (!encontrado) {
                        return res.status(404).json({
                            error: "Mascota no encontrada"
                        });
                    }
                    
                    console.log("Tratamientos encontrados:", results[0]);
                    res.json(results[0]);
                }
            );
        }
    );
});

// Obtener especies
app.get("/especies", (req, res) => {
    db.query(
        'CALL sp_obtener_especies()',
        (error, results) => {
            if (error) {
                console.error("Error al obtener especies:", error);
                return res.status(500).json({
                    error: "Error al cargar especies",
                    details: error.message
                });
            }
            
            res.json(results[0]);
        }
    );
});

// Obtener dueños
app.get("/duenos", (req, res) => {
    db.query(
        'CALL sp_obtener_duenos()',
        (error, results) => {
            if (error) {
                console.error("Error al obtener dueños:", error);
                return res.status(500).json({
                    error: "Error al cargar dueños",
                    details: error.message
                });
            }
            
            res.json(results[0]);
        }
    );
});

// Obtener todas las mascotas
app.get("/mascotas", (req, res) => {
    db.query(
        'CALL sp_obtener_mascotas()',
        (error, results) => {
            if (error) {
                console.error("Error al obtener mascotas:", error);
                return res.status(500).json({
                    error: "Error al cargar mascotas",
                    details: error.message
                });
            }
            
            res.json(results[0]);
        }
    );
});

// Obtener motivos de cita
app.get("/motivos-cita", (req, res) => {
    db.query(
        'CALL sp_obtener_motivos_cita()',
        (error, results) => {
            if (error) {
                console.error("Error al obtener motivos de cita:", error);
                return res.status(500).json({
                    error: "Error al cargar motivos de cita",
                    details: error.message
                });
            }
            
            res.json(results[0]);
        }
    );
});

// Obtener especialidades
app.get("/especialidades", (req, res) => {
    db.query(
        'CALL sp_obtener_especialidades()',
        (error, results) => {
            if (error) {
                console.error("Error al obtener especialidades:", error);
                return res.status(500).json({
                    error: "Error al cargar especialidades",
                    details: error.message
                });
            }
            
            res.json(results[0]);
        }
    );
});

// Obtener especialidad de un veterinario
app.get("/veterinario-especialidad/:id", (req, res) => {
    const id = req.params.id;
    
    db.query(
        'CALL sp_obtener_veterinario_especialidad(?, @encontrado)',
        [id],
        (error, results) => {
            if (error) {
                console.error("Error getting specialty:", error);
                return res.status(500).json({
                    error: "Error al obtener especialidad",
                    details: error.message
                });
            }
            
            db.query(
                'SELECT @encontrado as encontrado',
                (err, checkResults) => {
                    if (err) {
                        return res.status(500).json({
                            error: "Error al verificar existencia de veterinario",
                            details: err.message
                        });
                    }
                    
                    const { encontrado } = checkResults[0];
                    
                    if (!encontrado) {
                        return res.status(404).json({
                            error: "Veterinario no encontrado"
                        });
                    }
                    
                    res.json(results[0]);
                }
            );
        }
    );
});

app.listen(3001, () => {
    console.log("Servidor corriendo en el puerto 3001");
});