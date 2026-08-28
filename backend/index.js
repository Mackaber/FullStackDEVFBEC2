const express = require('express')
const cors = require('cors')
const pg = require('pg')
const dotenv = require('dotenv')
dotenv.config()

const PORT = 3000
const server = express()

// Conectar a la base de datos
const CONNECTION_STRING = process.env.PG_CONNECTION_STRING

const client = new pg.Client(CONNECTION_STRING)
let clientConnectionPromise


server.use(cors())
server.use(express.text())

server.get("/api/hello", (request, response) => {
    response.send("Hello from the backend!")
})

// BACKEND RECIBE EL INPUT DEL FRONTEND
server.post("/api/test", async (request, response) => {

    try {
        if (!clientConnectionPromise) {
            clientConnectionPromise = client.connect().catch((error) => {
                clientConnectionPromise = null
                throw error
            })
        }
        await clientConnectionPromise

        console.log("BODY EN EL BACKEND: ", request.body)

        const name = request.body
        // BASE DE DATOS: INSERTAR EL INPUT EN LA TABLA USERS

        // SIMULAR UNA INYECCIÓN SQL MALICIOSA
        // const name = "'); DROP TABLE users; --"

        const insertResult = await client.query(`INSERT INTO users (name) values ($1)`, [name])
        console.log("INSERTED", insertResult)

        // BASE DE DATOS: LEER TODOS LOS REGISTROS DE LA TABLA USERS
        const selectResult = await client.query("SELECT * FROM users")
        console.log("ROWS: ", selectResult.rows)
        response.send(selectResult.rows)
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
