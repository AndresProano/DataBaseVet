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

// Ruta de prueba simple
app.get("/test", (req, res) => {
    res.json({ message: "Servidor funcionando correctamente" });
});

// Ruta de prueba de base de datos con más detalle de errores
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

app.post("/create", (req,res)=>{
    const fecha = req.body.fecha;
    const motivo = req.body.motivo;
    const estado = req.body.estado;
    const hora = req.body.hora;
    db.query('INSERT INTO citas(idcitas,fecha,hora,motivo,estado) VALUES(DEFAULT,?,?,?,?)',
     [fecha,hora,motivo,estado], (err,result)=>{
    if(err){
        console.log(err);
     }else{
        res.send("Cita Registrada con éxito");
     }
    });
});

app.get("/mascota-info", (req, res) => {
    db.query("SELECT * FROM v_mascotas_info ORDER BY mascotas_nombre", (err, result) => {
        if (err){
            console.log(err);
            res.status(500).send(err);
        } else{
            res.send(result);
        }
    });
});

app.get("/veterinarios-info", (req, res) =>{
    db.query("SELECT * FROM v_veterinarios_info ORDER BY nombre, apellido", (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        }else{
            res.send(result);
        }
    })
})

app.listen(3001, () => {
    console.log("Servidor corriendo en el puerto 3001");
});