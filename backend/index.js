const express = require('express')
const cors = require('cors')
const pg = require('pg')
const dotenv = require('dotenv')
dotenv.config()

const PORT = 3000
const server = express()

// Conectar a la base de datos
CONNECTION_STRING = process.env.PG_CONNECTION_STRING

const client = new pg.Client(CONNECTION_STRING)


server.use(cors())
server.use(express.text())

server.get("/api/hello", (request, response) => {
    response.send("Hello from the backend!")
})

// BACKEND RECIBE EL INPUT DEL FRONTEND
server.post("/api/test", async (request, response) => {

    try {
        client.connect()

        console.log("BODY EN EL BACKEND: ", request.body)

        const name = request.body
        // BASE DE DATOS: INSERTAR EL INPUT EN LA TABLA USERS

        // SIMULAR UNA INYECCIÓN SQL MALICIOSA
        // const name = "'); DROP TABLE users; --"

        await client.query(`INSERT INTO users (name) values ($1)`, [name], (err, res) => {
            if (err) {
                console.error("DATABASE ERROR: ", err)
                response.status(500).send("Error en la base de datos", err)
            } else {
                console.log("INSERTED", res)
            }
        })

        // BASE DE DATOS: LEER TODOS LOS REGISTROS DE LA TABLA USERS
        await client.query("SELECT * FROM users", (err, res) => {
            if (err) {
                console.error("DATABASE ERROR: ", err)
                response.status(500).send("Error en la base de datos")
            } else {
                console.log("ROWS: ", res.rows)
                response.send(res.rows)
            }
        })
    } catch (error) {
        console.error("SERVER ERROR: ", error)
        response.status(500).send("Error en el servidor")
    }
})



server.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`)


    console.log("Conectado a la base de datos")
})

module.exports = server;
