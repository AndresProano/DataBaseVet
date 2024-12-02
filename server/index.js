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

// Crear cita 
app.post("/create", (req, res) => {
    const { fecha, motivo, estado, hora, mascotas_idmascotas, veterinarios_idveterinarios } = req.body;

    console.log("Datos recibidos:", {
        fecha, hora, motivo, estado, mascotas_idmascotas, veterinarios_idveterinarios
    });

    if (!fecha || !motivo || !estado || !hora || !mascotas_idmascotas || !veterinarios_idveterinarios) {
        return res.status(400).json({
            error: "Todos los campos son requeridos",
            receivedData: { fecha, motivo, estado, hora, mascotas_idmascotas, veterinarios_idveterinarios }
        });
    }

    db.beginTransaction(err => {
        if (err) {
            console.error("Error al iniciar la transacción:", err);
            return res.status(500).json({
                error: "Error al iniciar la transacción",
                details: err.message
            });
        }

        db.query(
            'INSERT INTO citas(idcitas,fecha,hora,motivo,estado,mascotas_idmascotas,veterinarios_idveterinarios) VALUES(DEFAULT,?,?,?,?,?,?)',
            [fecha, hora, motivo, estado, mascotas_idmascotas, veterinarios_idveterinarios],
            (error, result) => {
                if (error) {
                    return db.rollback(() => {
                        console.error("Error en la inserción:", error);
                        res.status(500).json({
                            error: "Error al registrar la cita",
                            details: error.message
                        });
                    });
                }

                db.commit(err => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).json({
                                error: "Error al finalizar la transacción",
                                details: err.message
                            });
                        });
                    }
                    res.json({ message: "Cita Registrada con éxito", id: result.insertId });
                });
            }
        );
    });
});

// Actualizar cita 
app.put("/update-cita/:id", (req, res) => {
    const id = req.params.id;
    const { fecha, hora, motivo, estado, mascotas_idmascotas, veterinarios_idveterinarios } = req.body;

    db.beginTransaction(err => {
        if (err) {
            console.error("Error al iniciar la transacción:", err);
            return res.status(500).json({
                error: "Error al iniciar la transacción",
                details: err.message
            });
        }

        const query = `
            UPDATE citas
            SET fecha = ?, hora = ?, motivo = ?, estado = ?, 
                mascotas_idmascotas = ?, veterinarios_idveterinarios = ?
            WHERE idcitas = ?`;

        db.query(
            query,
            [fecha, hora, motivo, estado, mascotas_idmascotas, veterinarios_idveterinarios, id],
            (error, result) => {
                if (error) {
                    return db.rollback(() => {
                        console.error("Error en la actualización:", error);
                        res.status(500).json({
                            error: "Error al actualizar la cita",
                            details: error.message
                        });
                    });
                }

                db.commit(err => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).json({
                                error: "Error al finalizar la transacción",
                                details: err.message
                            });
                        });
                    }
                    res.json({ message: "Cita actualizada con éxito" });
                });
            }
        );
    });
});

// Eliminar cita 
app.delete("/delete-cita/:id", (req, res) => {
    const id = req.params.id;

    db.beginTransaction(err => {
        if (err) {
            console.error("Error al iniciar la transacción:", err);
            return res.status(500).json({
                error: "Error al iniciar la transacción",
                details: err.message
            });
        }

        db.query(
            "DELETE FROM citas WHERE idcitas = ?",
            [id],
            (error, result) => {
                if (error) {
                    return db.rollback(() => {
                        console.error("Error en la eliminación:", error);
                        res.status(500).json({
                            error: "Error al eliminar la cita",
                            details: error.message
                        });
                    });
                }

                db.commit(err => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).json({
                                error: "Error al finalizar la transacción",
                                details: err.message
                            });
                        });
                    }
                    res.json({ message: "Cita eliminada con éxito" });
                });
            }
        );
    });
});

//Crear mascota
app.post("/create-mascota", (req, res) => {
    console.log("Cuerpo completo:", req.body);
    
    const { nombre, fechanacimiento, peso, especies_idespecies, duenos_idduenos } = req.body;
  
    if (!nombre || !fechanacimiento || !peso || !especies_idespecies || !duenos_idduenos) {
      return res.status(400).json({
        error: "Todos los campos son requeridos",
        receivedData: req.body
      });
    }
  
    db.beginTransaction(err => {
      if (err) {
        console.error("Error al iniciar la transacción:", err);
        return res.status(500).json({
          error: "Error al iniciar la transacción",
          details: err.message
        });
      }
      
      // Corregido el nombre del campo en la consulta SQL para que coincida con la base de datos
      db.query(
        'INSERT INTO mascotas(idmascotas, nombre, fechanacimiento, peso, especies_idespecies, duenos_idduenos) VALUES(DEFAULT, ?, ?, ?, ?, ?)',
        [nombre, fechanacimiento, peso, especies_idespecies, duenos_idduenos],
        (error, result) => {
          if (error) {
            return db.rollback(() => {
              console.error("Error en la inserción:", error);
              res.status(500).json({
                error: "Error al registrar la mascota",
                details: error.message
              });
            });
          }
          
          db.commit(err => {
            if (err) {
              return db.rollback(() => {
                res.status(500).json({
                  error: "Error al finalizar la transacción",
                  details: err.message
                });
              });
            }
            res.json({ message: "Mascota Registrada con éxito", id: result.insertId });
          });
        }
      );
    });
  });

//Crear especie
app.post("/create-especie", (req, res) => {
    const { nombre, descripcion} = req.body;

    console.log("Datos recibidos:", {
        nombre, descripcion
    });

    if (!nombre || !descripcion) {
        return res.status(400).json({
            error: "Todos los campos son requeridos",
            receivedData: { nombre, descripcion}
        });
    }

    db.beginTransaction(err => {
        if (err) {
            console.error("Error al iniciar la transacción:", err);
            return res.status(500).json({
                error: "Error al iniciar la transacción",
                details: err.message
            });
        }

        db.query(
            'INSERT INTO especies(idespecies,nombre, descripcion) VALUES(DEFAULT,?,?)',
            [nombre, descripcion],
            (error, result) => {
                if (error) {
                    return db.rollback(() => {
                        console.error("Error en la inserción:", error);
                        res.status(500).json({
                            error: "Error al registrar la especie",
                            details: error.message
                        });
                    });
                }

                db.commit(err => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).json({
                                error: "Error al finalizar la transacción",
                                details: err.message
                            });
                        });
                    }
                    res.json({ message: "Especie Registrada con éxito", id: result.insertId });
                });
            }
        );
    });
});

//Crear dueno
app.post("/create-dueno", (req, res) => {
    const { nombre, apellido, telefono, email, direccion} = req.body;

    console.log("Datos recibidos:", {
        nombre, apellido, telefono, email, direccion
    });

    if (!nombre || !apellido || !telefono) {
        return res.status(400).json({
            error: "Todos los campos son requeridos",
            receivedData: { nombre, apellido, telefono, mail, direccion}
        });
    }

    db.beginTransaction(err => {
        if (err) {
            console.error("Error al iniciar la transacción:", err);
            return res.status(500).json({
                error: "Error al iniciar la transacción",
                details: err.message
            });
        }

        db.query(
            'INSERT INTO duenos(idduenos, nombre, apellido, telefono, email, direccion) VALUES(DEFAULT,?,?,?,?,?)',
            [nombre, apellido, telefono, email, direccion],
            (error, result) => {
                if (error) {
                    return db.rollback(() => {
                        console.error("Error en la inserción:", error);
                        res.status(500).json({
                            error: "Error al registrar el dueno",
                            details: error.message
                        });
                    });
                }

                db.commit(err => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).json({
                                error: "Error al finalizar la transacción",
                                details: err.message
                            });
                        });
                    }
                    res.json({ message: "Dueno Registrada con éxito", id: result.insertId });
                });
            }
        );
    });
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

    if (!id || !nombre || !fechanacimiento || !peso || !especies_idespecies || !duenos_idduenos) {
        console.log("Faltan datos requeridos");
        return res.status(400).json({
            error: "Todos los campos son requeridos",
            receivedData: { id, nombre, fechanacimiento, peso, especies_idespecies, duenos_idduenos }
        });
    }

    db.beginTransaction(err => {
        if (err) {
            console.error("Error al iniciar la transacción:", err);
            return res.status(500).json({
                error: "Error al iniciar la transacción",
                details: err.message
            });
        }

        const query = `
            UPDATE mascotas 
            SET nombre = ?, 
                fechanacimiento = ?, 
                peso = ?,
                especies_idespecies = ?, 
                duenos_idduenos = ?
            WHERE idmascotas = ?
        `;

        console.log("Query a ejecutar:", query);
        console.log("Valores a usar:", [nombre, fechanacimiento, peso, especies_idespecies, duenos_idduenos, id]);

        db.query(
            query,
            [nombre, fechanacimiento, peso, especies_idespecies, duenos_idduenos, id],
            (error, result) => {
                if (error) {
                    return db.rollback(() => {
                        console.error("Error en la actualización:", error);
                        res.status(500).json({
                            error: "Error al actualizar la mascota",
                            details: error.message,
                            sqlMessage: error.sqlMessage,
                            sqlState: error.sqlState
                        });
                    });
                }

                db.commit(err => {
                    if (err) {
                        return db.rollback(() => {
                            console.error("Error en commit:", err);
                            res.status(500).json({
                                error: "Error al finalizar la transacción",
                                details: err.message
                            });
                        });
                    }
                    console.log("Actualización exitosa");
                    res.json({ 
                        message: "Mascota actualizada con éxito",
                        affectedRows: result.affectedRows
                    });
                });
            }
        );
    });
});

//delete mascota
app.delete("/delete-mascota/:id", (req, res) => {
    const id = req.params.id;

    db.beginTransaction(err => {
        if (err) {
            console.error("Error al iniciar la transacción:", err);
            return res.status(500).json({
                error: "Error al iniciar la transacción",
                details: err.message
            });
        }

        db.query(
            "DELETE FROM mascotas WHERE idmascotas = ?",
            [id],
            (error, result) => {
                if (error) {
                    return db.rollback(() => {
                        console.error("Error en la eliminación:", error);
                        res.status(500).json({
                            error: "Error al eliminar la mascota",
                            details: error.message
                        });
                    });
                }

                db.commit(err => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).json({
                                error: "Error al finalizar la transacción",
                                details: err.message
                            });
                        });
                    }
                    res.json({ message: "Mascota eliminada con éxito" });
                });
            }
        );
    });
});

//crear veterinario
app.post("/create-veterinario", (req, res) => {
    const { nombre, apellido, telefono, email} = req.body;

    console.log("Datos recibidos:", {
        nombre, apellido, telefono, email
    });

    if (!nombre || !apellido || !telefono || !email) {
        return res.status(400).json({
            error: "Todos los campos son requeridos",
            receivedData: { nombre, apellido, telefono, email}
        });
    }

    db.beginTransaction(err => {
        if (err) {
            console.error("Error al iniciar la transacción:", err);
            return res.status(500).json({
                error: "Error al iniciar la transacción",
                details: err.message
            });
        }

        db.query(
            'INSERT INTO veterinarios(idveterinarios, nombre, apellido, telefono, email) VALUES(DEFAULT,?,?,?,?)',
            [nombre, apellido, telefono, email],
            (error, result) => {
                if (error) {
                    return db.rollback(() => {
                        console.error("Error en la inserción:", error);
                        res.status(500).json({
                            error: "Error al registrar el veterinario",
                            details: error.message
                        });
                    });
                }

                db.commit(err => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).json({
                                error: "Error al finalizar la transacción",
                                details: err.message
                            });
                        });
                    }
                    res.json({ message: "Veterinario Registrada con éxito", id: result.insertId });
                });
            }
        );
    });
});

//actualizar veterinario
app.put("/update-veterinario/:id", (req, res) => {
    const id = req.params.id;
    const { nombre, apellido, telefono, email, especialidad_ids } = req.body;

    console.log("Updating veterinario with ID:", id);
    console.log("Received data:", req.body);

    if (!id || !nombre || !apellido || !telefono || !email || !especialidad_ids) {
        return res.status(400).json({
            error: "Todos los campos son requeridos",
            receivedData: { id, nombre, apellido, telefono, email, especialidad_ids }
        });
    }

    db.beginTransaction(err => {
        if (err) {
            console.error("Error al iniciar la transacción:", err);
            return res.status(500).json({
                error: "Error al iniciar la transacción",
                details: err.message
            });
        }

        // First update veterinario basic info
        const queryVeterinario = `
            UPDATE veterinarios 
            SET nombre = ?, 
                apellido = ?, 
                telefono = ?,
                email = ?
            WHERE idveterinarios = ?
        `;

        db.query(queryVeterinario, [nombre, apellido, telefono, email, id], (error, result) => {
            if (error) {
                return db.rollback(() => {
                    console.error("Database error:", error);
                    res.status(500).json({
                        error: "Error al actualizar al veterinario",
                        details: error.message
                    });
                });
            }

            // Then update the specialty relationship
            // First delete existing relationships
            const deleteSpecialties = `
                DELETE FROM veterinarios_has_especialidad
                WHERE veterinarios_idveterinarios = ?
            `;

            db.query(deleteSpecialties, [id], (errorDelete) => {
                if (errorDelete) {
                    return db.rollback(() => {
                        console.error("Error deleting specialties:", errorDelete);
                        res.status(500).json({
                            error: "Error al actualizar especialidades",
                            details: errorDelete.message
                        });
                    });
                }

                // Then insert new relationship
                const insertSpecialty = `
                    INSERT INTO veterinarios_has_especialidad
                    (veterinarios_idveterinarios, especialidad_idespecialidad, fecha_certificacion)
                    VALUES (?, ?, CURRENT_DATE)
                `;

                db.query(insertSpecialty, [id, especialidad_ids], (errorInsert) => {
                    if (errorInsert) {
                        return db.rollback(() => {
                            console.error("Error inserting specialty:", errorInsert);
                            res.status(500).json({
                                error: "Error al insertar especialidad",
                                details: errorInsert.message
                            });
                        });
                    }

                    // If everything is OK, commit the transaction
                    db.commit(err => {
                        if (err) {
                            return db.rollback(() => {
                                res.status(500).json({
                                    error: "Error al finalizar la transacción",
                                    details: err.message
                                });
                            });
                        }
                        res.json({ 
                            message: "Veterinario y especialidad actualizados con éxito",
                            affectedRows: result.affectedRows
                        });
                    });
                });
            });
        });
    });
});

//delete veterinario
app.delete("/delete-veterinario/:id", (req, res) => {
    const id = req.params.id;

    db.beginTransaction(err => {
        if (err) {
            console.error("Error al iniciar la transacción:", err);
            return res.status(500).json({
                error: "Error al iniciar la transacción",
                details: err.message
            });
        }

        db.query(
            "DELETE FROM veterinarios WHERE idveterinarios = ?",
            [id],
            (error, result) => {
                if (error) {
                    return db.rollback(() => {
                        console.error("Error en la eliminación:", error);
                        res.status(500).json({
                            error: "Error al eliminar al veterinario",
                            details: error.message
                        });
                    });
                }

                db.commit(err => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).json({
                                error: "Error al finalizar la transacción",
                                details: err.message
                            });
                        });
                    }
                    res.json({ message: "Veterinario eliminada con éxito" });
                });
            }
        );
    });
});

//crear factura
app.post("/create-factura", (req, res) => {
    const { fecha_emision, fecha_vencimiento, subtotal, iva, total, 
        estado_pago, metodo_pago, duenos_idduenos} = req.body;

    console.log("Datos recibidos:", {
        fecha_emision, fecha_vencimiento, subtotal, iva, total, 
            estado_pago, metodo_pago, duenos_idduenos
    });

    if (!fecha_emision || !fecha_vencimiento || !subtotal || !iva || 
        !total || !estado_pago || !metodo_pago || !duenos_idduenos) {
        return res.status(400).json({
            error: "Todos los campos son requeridos",
            receivedData: { nombre, apellido, telefono, email}
        });
    }

    db.beginTransaction(err => {
        if (err) {
            console.error("Error al iniciar la transacción:", err);
            return res.status(500).json({
                error: "Error al iniciar la transacción",
                details: err.message
            });
        }

        db.query(
            'INSERT INTO facturas (fecha_emision, fecha_vencimiento, subtotal, iva, total, estado_pago, metodo_pago, duenos_idduenos) VALUES (?,?,?,?,?,?,?,?)',
            [fecha_emision, fecha_vencimiento, subtotal, iva, total, estado_pago, metodo_pago, duenos_idduenos],
            (error, result) => {
                if (error) {
                    return db.rollback(() => {
                        console.error("Error en la inserción:", error);
                        res.status(500).json({
                            error: "Error al registrar factura",
                            details: error.message
                        });
                    });
                }

                db.commit(err => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).json({
                                error: "Error al finalizar la transacción",
                                details: err.message
                            });
                        });
                    }
                    res.json({ message: "Factura Registrada con éxito", id: result.insertId });
                });
            }
        );
    });
});

//actualizar factura
app.put("/update-factura/:id", (req, res) => {
    const id = req.params.id;
    const {fecha_emision, fecha_vencimiento, subtotal, iva, total, estado_pago, metodo_pago, duenos_idduenos} = req.body;

    if (!id || !fecha_emision || !fecha_vencimiento || !subtotal || !iva || 
        !total || !estado_pago || !metodo_pago || !duenos_idduenos) {
        console.log("Faltan datos requeridos");
        return res.status(400).json({
            error: "Todos los campos son requeridos",
            receivedData: { id, fecha_emision, fecha_vencimiento, subtotal, iva, total, 
                estado_pago, metodo_pago, duenos_idduenos}
        });
    }

    db.beginTransaction(err => {
        if (err) {
            console.error("Error al iniciar la transacción:", err);
            return res.status(500).json({
                error: "Error al iniciar la transacción",
                details: err.message
            });
        }

        const query = `UPDATE facturas 
         SET fecha_emision = ?, 
             fecha_vencimiento = ?, 
             subtotal = ?,
             iva = ?,
             total = ?,
             estado_pago = ?,
             metodo_pago = ?,
             duenos_idduenos = ?
         WHERE idfacturas = ?`;

        db.query(
            query,
            [fecha_emision, fecha_vencimiento, subtotal, iva, total, 
                estado_pago, metodo_pago, id],
            (error, result) => {
                if (error) {
                    return db.rollback(() => {
                        console.error("Error en la actualización:", error);
                        res.status(500).json({
                            error: "Error al actualizar la factura",
                            details: error.message,
                            sqlMessage: error.sqlMessage,
                            sqlState: error.sqlState
                        });
                    });
                }

                db.commit(err => {
                    if (err) {
                        return db.rollback(() => {
                            console.error("Error en commit:", err);
                            res.status(500).json({
                                error: "Error al finalizar la transacción",
                                details: err.message
                            });
                        });
                    }
                    console.log("Actualización exitosa");
                    res.json({ 
                        message: "Factura actualizada con éxito",
                        affectedRows: result.affectedRows
                    });
                });
            }
        );
    });
});

//delete factura
app.delete("/delete-factura/:id", (req, res) => {
    const id = req.params.id;

    db.beginTransaction(err => {
        if (err) {
            console.error("Error al iniciar la transacción:", err);
            return res.status(500).json({
                error: "Error al iniciar la transacción",
                details: err.message
            });
        }

        db.query(
            "DELETE FROM facturas WHERE idfacturas = ?",
            [id],
            (error, result) => {
                if (error) {
                    return db.rollback(() => {
                        console.error("Error en la eliminación:", error);
                        res.status(500).json({
                            error: "Error al eliminar la factura",
                            details: error.message
                        });
                    });
                }

                db.commit(err => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).json({
                                error: "Error al finalizar la transacción",
                                details: err.message
                            });
                        });
                    }
                    res.json({ message: "Factura eliminada con éxito" });
                });
            }
        );
    });
});

//crear tratamiento
app.post("/create-tratamiento", (req, res) => {
    const {
        diagnostico, 
        fecha_inicio, 
        fecha_fin,
        mascota_id,
        veterinario_id,  
        motivo_cita     
    } = req.body;

    if (!diagnostico || !fecha_inicio || !mascota_id || !veterinario_id || !motivo_cita) {
        return res.status(400).json({
            error: "Campos requeridos faltantes"
        });
    }

    db.beginTransaction(err => {
        if (err) {
            console.error("Error al iniciar la transacción:", err);
            return res.status(500).json({
                error: "Error al iniciar la transacción",
                details: err.message
            });
        }

        const queryTratamiento = `
            INSERT INTO tratamientos (
                diagnostico,
                fecha_inicio,
                fecha_fin
            ) VALUES (?, ?, ?)
        `;

        db.query(queryTratamiento, [diagnostico, fecha_inicio, fecha_fin], (error, resultTratamiento) => {
            if (error) {
                return db.rollback(() => {
                    console.error("Error en la inserción del tratamiento:", error);
                    res.status(500).json({
                        error: "Error al registrar el tratamiento",
                        details: error.message
                    });
                });
            }

            const tratamiento_id = resultTratamiento.insertId;

            const queryRelacion = `
                INSERT INTO mascotas_has_tratamientos 
                (mascotas_idmascotas, tratamientos_idtratamientos) 
                VALUES (?, ?)
            `;

            db.query(queryRelacion, [mascota_id, tratamiento_id], (errorRelacion) => {
                if (errorRelacion) {
                    return db.rollback(() => {
                        console.error("Error en la relación mascota-tratamiento:", errorRelacion);
                        res.status(500).json({
                            error: "Error al registrar la relación",
                            details: errorRelacion.message
                        });
                    });
                }

                const queryCita = `
                    INSERT INTO citas (
                        fecha,
                        motivo,
                        mascotas_idmascotas,
                        veterinarios_idveterinarios,
                        tratamientos_idtratamientos
                    ) VALUES (?, ?, ?, ?, ?)
                `;

                db.query(queryCita, 
                    [fecha_inicio, motivo_cita, mascota_id, veterinario_id, tratamiento_id], 
                    (errorCita) => {
                        if (errorCita) {
                            return db.rollback(() => {
                                console.error("Error al crear la cita:", errorCita);
                                res.status(500).json({
                                    error: "Error al registrar la cita",
                                    details: errorCita.message
                                });
                            });
                        }

                        db.commit(err => {
                            if (err) {
                                return db.rollback(() => {
                                    res.status(500).json({
                                        error: "Error en la transacción",
                                        details: err.message
                                    });
                                });
                            }
                            
                            res.json({ 
                                message: "Tratamiento registrado con éxito",
                                idTratamiento: tratamiento_id
                            });
                        });
                    }
                );
            });
        });
    });
});

//actualizar tratamiento
app.put("/update-tratamiento/:id", (req, res) => {
    const id = req.params.id;
    const {
        diagnostico, 
        fecha_inicio, 
        fecha_fin,
        mascota_id,
        veterinario_id,  // Nuevo
        motivo_cita      // Nuevo
    } = req.body;

    // Validación básica
    if (!id || !diagnostico || !fecha_inicio || !mascota_id || !veterinario_id || !motivo_cita) {
        return res.status(400).json({
            error: "Todos los campos requeridos son necesarios",
            receivedData: { id, diagnostico, fecha_inicio, mascota_id, veterinario_id, motivo_cita }
        });
    }

    db.beginTransaction(err => {
        if (err) {
            console.error("Error al iniciar la transacción:", err);
            return res.status(500).json({
                error: "Error al iniciar la transacción",
                details: err.message
            });
        }

        // 1. Actualizar el tratamiento
        const queryTratamiento = `
            UPDATE tratamientos 
            SET diagnostico = ?, 
                fecha_inicio = ?,
                fecha_fin = ?
            WHERE idtratamientos = ?
        `;

        db.query(queryTratamiento, [diagnostico, fecha_inicio, fecha_fin, id], (error, result) => {
            if (error) {
                return db.rollback(() => {
                    console.error("Error en la actualización del tratamiento:", error);
                    res.status(500).json({
                        error: "Error al actualizar el tratamiento",
                        details: error.message
                    });
                });
            }

            // 2. Actualizar la relación mascotas_has_tratamientos
            const queryRelacion = `
                UPDATE mascotas_has_tratamientos
                SET mascotas_idmascotas = ?
                WHERE tratamientos_idtratamientos = ?
            `;

            db.query(queryRelacion, [mascota_id, id], (errorRelacion) => {
                if (errorRelacion) {
                    return db.rollback(() => {
                        console.error("Error al actualizar la relación:", errorRelacion);
                        res.status(500).json({
                            error: "Error al actualizar la relación mascota-tratamiento",
                            details: errorRelacion.message
                        });
                    });
                }

                // 3. Actualizar o insertar en citas
                const queryCitaCheck = `
                    SELECT idcitas FROM citas 
                    WHERE tratamientos_idtratamientos = ?
                `;

                db.query(queryCitaCheck, [id], (errorCheck, resultCheck) => {
                    if (errorCheck) {
                        return db.rollback(() => {
                            console.error("Error al verificar cita existente:", errorCheck);
                            res.status(500).json({
                                error: "Error al verificar cita",
                                details: errorCheck.message
                            });
                        });
                    }

                    let citaQuery;
                    let citaParams;

                    if (resultCheck.length > 0) {
                        // Actualizar cita existente
                        citaQuery = `
                            UPDATE citas
                            SET fecha = ?,
                                motivo = ?,
                                mascotas_idmascotas = ?,
                                veterinarios_idveterinarios = ?
                            WHERE tratamientos_idtratamientos = ?
                        `;
                        citaParams = [fecha_inicio, motivo_cita, mascota_id, veterinario_id, id];
                    } else {
                        // Insertar nueva cita
                        citaQuery = `
                            INSERT INTO citas (fecha, motivo, mascotas_idmascotas, veterinarios_idveterinarios, tratamientos_idtratamientos)
                            VALUES (?, ?, ?, ?, ?)
                        `;
                        citaParams = [fecha_inicio, motivo_cita, mascota_id, veterinario_id, id];
                    }

                    db.query(citaQuery, citaParams, (errorCita) => {
                        if (errorCita) {
                            return db.rollback(() => {
                                console.error("Error al actualizar/insertar cita:", errorCita);
                                res.status(500).json({
                                    error: "Error al actualizar la cita",
                                    details: errorCita.message
                                });
                            });
                        }

                        db.commit(err => {
                            if (err) {
                                return db.rollback(() => {
                                    res.status(500).json({
                                        error: "Error al finalizar la transacción",
                                        details: err.message
                                    });
                                });
                            }
                            res.json({
                                message: "Tratamiento y cita actualizados con éxito",
                                affectedRows: result.affectedRows
                            });
                        });
                    });
                });
            });
        });
    });
});

//delete factura
app.delete("/delete-tratamiento/:id", (req, res) => {
    const id = req.params.id;

    db.beginTransaction(err => {
        if (err) {
            console.error("Error al iniciar la transacción:", err);
            return res.status(500).json({
                error: "Error al iniciar la transacción",
                details: err.message
            });
        }

        // 1. Eliminar la cita relacionada
        const queryCita = "DELETE FROM citas WHERE tratamientos_idtratamientos = ?";
        db.query(queryCita, [id], (errorCita) => {
            if (errorCita) {
                return db.rollback(() => {
                    console.error("Error al eliminar la cita:", errorCita);
                    res.status(500).json({
                        error: "Error al eliminar la cita relacionada",
                        details: errorCita.message
                    });
                });
            }

            // 2. Eliminar la relación en mascotas_has_tratamientos
            const queryRelacion = "DELETE FROM mascotas_has_tratamientos WHERE tratamientos_idtratamientos = ?";
            db.query(queryRelacion, [id], (errorRelacion) => {
                if (errorRelacion) {
                    return db.rollback(() => {
                        console.error("Error al eliminar la relación:", errorRelacion);
                        res.status(500).json({
                            error: "Error al eliminar la relación mascota-tratamiento",
                            details: errorRelacion.message
                        });
                    });
                }

                // 3. Finalmente eliminar el tratamiento
                const queryTratamiento = "DELETE FROM tratamientos WHERE idtratamientos = ?";
                db.query(queryTratamiento, [id], (error, result) => {
                    if (error) {
                        return db.rollback(() => {
                            console.error("Error al eliminar el tratamiento:", error);
                            res.status(500).json({
                                error: "Error al eliminar el tratamiento",
                                details: error.message
                            });
                        });
                    }

                    db.commit(err => {
                        if (err) {
                            return db.rollback(() => {
                                res.status(500).json({
                                    error: "Error al finalizar la transacción",
                                    details: err.message
                                });
                            });
                        }
                        res.json({ 
                            message: "Tratamiento y registros relacionados eliminados con éxito",
                            affectedRows: result.affectedRows 
                        });
                    });
                });
            });
        });
    });
});

//create especialidad
app.post("/create-especialidad", (req, res) => {
    const { nombre, descripcion, anios_requeridos} = req.body;

    console.log("Datos recibidos:", {
        nombre, descripcion, anios_requeridos
    });

    if (!nombre || !descripcion || !anios_requeridos) {
        return res.status(400).json({
            error: "Todos los campos son requeridos",
            receivedData: { nombre, descripcion, anios_requeridos}
        });
    }

    db.beginTransaction(err => {
        if (err) {
            console.error("Error al iniciar la transacción:", err);
            return res.status(500).json({
                error: "Error al iniciar la transacción",
                details: err.message
            });
        }

        db.query(
            'INSERT INTO especialidad(idespecialidad, nombre, descripcion, anios_requeridos) VALUES(DEFAULT,?,?,?)',
            [nombre, descripcion, anios_requeridos],
            (error, result) => {
                if (error) {
                    return db.rollback(() => {
                        console.error("Error en la inserción:", error);
                        res.status(500).json({
                            error: "Error al registrar la especialidad",
                            details: error.message
                        });
                    });
                }

                db.commit(err => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).json({
                                error: "Error al finalizar la transacción",
                                details: err.message
                            });
                        });
                    }
                    res.json({ message: "Especialidad Registrada con éxito", id: result.insertId });
                });
            }
        );
    });
});

// Rutas de consulta
app.get("/mascotas-info", (req, res) => {
    db.query("SELECT * FROM v_mascotas_info ORDER BY mascota_nombre", (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.send(result);
        }
    });
});

app.get("/mascotas-info-tratamiento/:id", (req, res) => {
    const id = req.params.id;
    db.query(
        `SELECT * FROM v_mascotas_info WHERE idmascotas = ?`,
        [id],
        (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            } else {
                res.send(result[0]);
            }
        }
    );
});

app.get("/veterinarios-info", (req, res) => {
    const query = `
        SELECT 
            v.idveterinarios,
            v.nombre,
            v.apellido,
            v.telefono,
            v.email,
            v.especialidades,
            v.especialidad_ids
        FROM v_veterinarios_info v
        ORDER BY v.nombre, v.apellido
    `;
    
    db.query(query, (err, result) => {
        if (err) {
            console.error("Error al obtener veterinarios:", err);
            res.status(500).json({
                error: "Error al cargar veterinarios",
                details: err.message
            });
        } else {
            // Log the data being sent
            console.log("Datos de veterinarios enviados:", result);
            res.json(result);
        }
    });
});

app.get("/facturas-info", (req, res) => {
    db.query("SELECT * FROM v_facturas_completas ORDER BY idfacturas", (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.send(result);
        }
    });
});

app.get("/citas_completas", (req, res) => {
    const query = `
      SELECT v.*, c.mascotas_idmascotas, c.veterinarios_idveterinarios 
      FROM vista_citas_completa v
      JOIN citas c ON v.idcitas = c.idcitas
      ORDER BY v.idcitas
    `;
    
    db.query(query, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send(err);
      } else {
        res.send(result);
      }
    });
  });

app.get("/tratamientos-mascotas", (req, res) => {
    const query = `SELECT * FROM v_tratamientos_mascotas ORDER BY mascota_nombre`;
    
    db.query(query, (err, result) => {
        if (err) {
            console.error('Error al consultar tratamientos_mascotas:', err);
            res.status(500).json({
                error: 'Error en la consulta',
                details: err.message
            });
            return;
        }
        res.json(result);
    });
});

app.get("/tratamientos-by-mascota/:idMascota", (req, res) => {
    const idMascota = req.params.idMascota;
    const query = `
        SELECT
            t.idtratamientos,
            t.diagnostico,
            t.fecha_inicio,
            t.fecha_fin,
            m.nombre as nombre_mascota,
            m.idmascotas,
            mht.mascotas_idmascotas,
            mht.tratamientos_idtratamientos,
            c.motivo as motivo_cita,
            CONCAT(v.nombre, ' ', v.apellido) as nombre_veterinario,
            v.idveterinarios
        FROM tratamientos t
        INNER JOIN mascotas_has_tratamientos mht ON t.idtratamientos = mht.tratamientos_idtratamientos
        INNER JOIN mascotas m ON mht.mascotas_idmascotas = m.idmascotas
        LEFT JOIN citas c ON t.idtratamientos = c.tratamientos_idtratamientos
        LEFT JOIN veterinarios v ON c.veterinarios_idveterinarios = v.idveterinarios
        WHERE m.idmascotas = ?
    `;

    db.query(query, [idMascota], (error, results) => {
        if (error) {
            console.error("Error al obtener tratamientos:", error);
            res.status(500).json({ error: "Error al obtener tratamientos" });
            return;
        }
        console.log("Tratamientos encontrados:", results);
        res.json(results);
    });
});

app.get("/especies", (req, res) => {
    db.query("SELECT * FROM especies ORDER BY idespecies", (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.send(result);
        }
    });
});

app.get("/duenos", (req, res) => {
    db.query("SELECT * FROM duenos ORDER BY idduenos", (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.send(result);
        }
    });
});

app.get("/mascotas", (req, res) => {
    db.query("SELECT * FROM mascotas ORDER BY idmascotas", (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.send(result);
        }
    });
});

app.get("/motivos-cita", (req, res) => {
    db.query(
      "SELECT DISTINCT motivo FROM citas ORDER BY motivo",
      (err, result) => {
        if (err) {
          console.error("Error al obtener motivos de cita:", err);
          res.status(500).json({ error: "Error al cargar motivos de cita" });
        } else {
          res.json(result);
        }
      }
    );
  });

app.get("/especialidades", (req, res) => {
    db.query("SELECT * FROM especialidad", (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            res.send(result);
        }
    });
});

app.get("/veterinario-especialidad/:id", (req, res) => {
    const id = req.params.id;
    const query = `
        SELECT * FROM veterinarios_has_especialidad
        WHERE veterinarios_idveterinarios = ?
    `;
    
    db.query(query, [id], (error, result) => {
        if (error) {
            console.error("Error getting specialty:", error);
            res.status(500).json({
                error: "Error al obtener especialidad",
                details: error.message
            });
        } else {
            res.json(result);
        }
    });
});

app.listen(3001, () => {
    console.log("Servidor corriendo en el puerto 3001");
});