# DataBaseVet

# Ejecución del Proyecto

# Creación Proyecto

1. Dentro de nuestro repositorio creamos la carpeta "client" y "server"

2. Dentro de "client", ejecutamos npx create-react-app .

3. Dentro de "server", ejecutamos npm init y presionaremos ENTER hasta la pregunta "Is this OK?(yes)" donde escribiremos YES y colocaremos ENTER.

4. En la carpeta SERVER crearemos un archivo, en este caso "index.js". El nombre puede variar a gusto de usuario, pero tendrá que llevar el mismo nombre que se encuentra dentro de package.json en el apartado de "main"

5. En la carpeta CLIENT, abriremos un terminar para colocar "npm start". Aquí deberiamos visualizar, dentro de google localhost:3000, que nuestra página web está corriendo. 
El archivo donde se van a guardar los cambios que hagamos a nuestra página web es "\databasevet\client\src\app.js". Cualquier cosa que se escriba aquí se actualizará en tiempo real en nuestra página web.
El archivo donde podemos editar la apariencia de nuestra página web y sus elementos es "\databasevet\client\src\App.css"

6. Antes de conectarnos a la base de datos necesitamos descargar MYSQL2, para ello 
"npm install mysql2". Posteriormente, en el archivo de "\server\index.js" colocaremos
"const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "veterinaria"
});"


7. Para ser capaces de crear citas en la base de datos, en el mismo index colocamos 
"app.post("/create),(req,res)=>{
    const nombre = req.body.nombre;
})" donde req va a ser para realizar las consultas, es para recibir respuesta

8. Ahora, para facilitar las peticiones al backend vamos a importar AXIOS.
"npm install axios". Posterior a descargar axios, dentro de app.js vamos a importar axios y utilizar los métodos para agregar, editar o eliminar consultas de SQL.
Dentro de la misma, vamos a crear 
"const add = ()=>{
    Axios.post("http:://localhost:3001/create")
}"
donde 3001 es el puerto que hemos colocado en index.js, de igual forma que create

8. Alguno de los errores que nos dió al tratar de conectarnos a la base de datos: 
Si tratamos de agregar una cita nos dará un "blocked by CORS", para ello tenemos que, en consola:
"npm install cors".
Posterior colocamos en el archivo index.js
"const cors =require("cors");".
Ahora, para que nuestra app use este cors antes de ejecutar, más abajo del archivo colocamos 
"app.use(cors());" y 
"app.use(express.json());" lo que hará que toda la información que agregue se convierta en JSON
Un error común al tratar de conectarnos a la base de datos es que cuando el método de autenticación de MySQL no es compatible con el cliente Node.js. Para esto lo solucionaremos colocando en el terminal 
"mysql -u root -p", colocamos nuestra clave y posteriormente:
"ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '(Aqui tu contraseña)';
FLUSH PRIVILEGES;
exit;"
Finalmente, el error encontrado fue la incopatibilidad al instalar mysql@2.18.1, por lo que se procedió a utilizar msyql2 que funciona correctamente con las últimas versiones de MYSQL.

9. Vamos a descargar React Bootstrap para poder tener un mejor manejo en la interface del programa. Para eso, vamos a colocar en el terminal del cliente "npm install react-bootstrap bootstrap". Y, dentro de App, bajo de axios vamos a colocar
"import 'bootstrap/dist/css/bootstrap.min.css';"