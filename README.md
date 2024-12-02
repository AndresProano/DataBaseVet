# DataBaseVet

## Problema que resuelve

La base de datos mostrada en la imagen resuelve los problemas fundamentales de gestión en una clínica veterinaria, permitiendo el registro y seguimiento integral de pacientes animales, sus dueños y los servicios médicos prestados. A través de sus tablas principales y sus tablas de relación, el sistema facilita el control de citas médicas, el manejo de historiales clínicos, la administración de medicamentos, el seguimiento de tratamientos, y la gestión financiera mediante facturas. Además, las vistas especializadas permiten obtener información consolidada y detallada para la toma de decisiones, mejorando la eficiencia operativa de la clínica y la calidad de atención a las mascotas y sus propietarios.

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/en/) (LTS version)
- [MySQL](https://www.mysql.com/)
- npm (comes with Node.js)

## Architecture Overview
The system follows a typical three-tier architecture:

1. Frontend: React.js application
2. Backend: Node.js with Express
3. Database: MySQL

### Frontend (React.js)
The frontend is built using React.js with the following key technologies:

React Bootstrap for UI components and styling
Axios for HTTP requests
React Hooks for state management
React Router (implied by navigation structure)

A veterinary clinic management system built with React and Node.js.

Key Components:

1. Main Dashboard (App.js)

- Central navigation hub
- State management for view switching
- Bootstrap-based responsive layout


2. Module Components:

- Mascotas (Pets)
- Citas (Appointments)
- Veterinarios (Veterinarians)
- Facturas (Invoices)
- Tratamientos (Treatments)



### Backend (Node.js/Express)
The backend server is built with Express.js and includes:

1. Core Configuration:

```
javascriptCopyconst express = require("express");
const app = express();
const mysql = require("mysql2");
const cors = require("cors");
```


2. Database Connection:

```
javascriptCopyconst db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "****",
    database: "veterinaria"
});
```

3. API Endpoints:

- CRUD operations for all entities
- Complex queries using views
- Transaction management for data integrity



### Database Structure
The MySQL database includes the following main tables:

mascotas (Pets)
duenos (Owners)
veterinarios (Veterinarians)
citas (Appointments)
facturas (Invoices)
tratamientos (Treatments)
especies (Species)
especialidad (Specialties)

## Installation

### 1. Database Setup

1. Create a database named `veterinaria` in MySQL
2. Import the database backup:
   ```bash
   mysql -u root -p veterinaria < veterinaria_backup.sql
   ```
3. Make sure you are in the same folder as the backup

### 2. Server Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Start the server:
   ```bash
   node index.js
   ```

You should see the message:
```
Servidor corriendo en el puerto 3001
Conexión exitosa a la base de datos MySQL
```

### 3. Client Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the client:
   ```bash
   npm start
   ```

The web application should automatically open in your default browser at `localhost:3000`.

If you experience any issues, install additional packages:
```bash
npm install axios react-bootstrap bootstrap
```

## Project Structure

```
DataBaseVet/
├── client/
│   ├── src/
│   │   ├── App.js        # Main application component
│   │   └── App.css       # Main stylesheet
│   └── package.json
└── server/
    ├── index.js          # Server configuration and API endpoints
    └── package.json
```

## Development Guide

### Initial Project Setup

1. Create the "client" and "server" directories
2. Set up the client:
   ```bash
   cd client
   npx create-react-app .
   ```

3. Set up the server:
   ```bash
   cd server
   npm init
   ```
   Press enter until you see `Is this OK? (yes)` and type "YES"

4. Create `index.js` in the server directory (name must match the "main" field in package.json)

5. Start the client development server:
   ```bash
   cd client
   npm start
   ```
   - Edit `client/src/App.js` for application logic
   - Edit `client/src/App.css` for styling

6. Set up MySQL connection:
   ```bash
   npm install mysql2
   ```
   Add to `server/index.js`:
   ```javascript
   const mysql = require("mysql2");

   const db = mysql.createConnection({
       host: "localhost",
       user: "root",
       password: "",
       database: "veterinaria"
   });
   ```

7. Create API endpoints for appointments in `server/index.js`:
   ```javascript
   app.post("/create", (req, res) => {
       const nombre = req.body.nombre;
       // This endpoint handles appointment creation
       // req is used to receive data from the frontend
       // res is used to send responses back to the frontend
       // Additional logic here for database operations
   });
   ```
   This creates an endpoint that will handle appointment creation requests from the frontend.

8. Set up Axios for API requests. Axios will facilitate making HTTP requests to the backend:
   ```bash
   npm install axios
   ```
   In `App.js`, import and use Axios for making API calls:
   ```javascript
   import axios from 'axios';

   const add = () => {
       // This method will send data to our backend endpoint
       // The port (3001) must match the one configured in your server's index.js
       axios.post("http://localhost:3001/create", {
           // Add your data here
           // Example: nombre: nombreInput
       }).then((response) => {
           // Handle successful response
       }).catch((error) => {
           // Handle any errors
       });
   }
   ```

9. Install and configure CORS:
   ```bash
   npm install cors
   ```
   Add to `server/index.js`:
   ```javascript
   const cors = require("cors");
   app.use(cors());
   app.use(express.json());
   ```

10. Install Bootstrap:
    ```bash
    npm install react-bootstrap bootstrap
    ```
    Add to `App.js`:
    ```javascript
    import 'bootstrap/dist/css/bootstrap.min.css';
    ```

### Troubleshooting

#### MySQL Authentication Issues

If you encounter authentication problems:

1. Log into MySQL:
   ```bash
   mysql -u root -p
   ```

2. Update authentication method:
   ```sql
   ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
   FLUSH PRIVILEGES;
   exit;
   ```

Common issues and solutions:
- CORS errors: When trying to add an appointment, you might encounter a "blocked by CORS" error. This is solved by installing and configuring the cors middleware as shown in the CORS Configuration section.
- MySQL authentication: If you experience authentication issues, it's usually because the MySQL authentication method is not compatible with the Node.js client. This can be fixed by updating to mysql_native_password authentication as shown in the MySQL Authentication Issues section.
- MySQL compatibility: Initial development encountered issues with mysql@2.18.1, which was resolved by switching to mysql2 for better compatibility with recent MySQL versions.
- General database connectivity: If you're having trouble connecting to the database, ensure your MySQL service is running and the credentials in your connection configuration match your MySQL setup.

### Database Configuration

Server database connection:
```javascript
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "veterinaria"
});
```

### CORS Configuration

Enable CORS and JSON parsing:
```javascript
const cors = require("cors");
app.use(cors());
app.use(express.json());
```