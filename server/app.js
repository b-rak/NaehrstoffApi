"use strict"

const http = require("http")
const url = require("url")
const querystring = require("querystring")
const servePublic = require("./public")

const fs = require("fs")
const path = require("path")

const { search, info } = require("./api")

const app = http.createServer((req, res) => {
    try {
        if (req.url === "/") {
            fs.readFile(path.join(__dirname, "..", "public", "index.html"), (err, content) => {
                if (err) {
                    res.writeHead(500, { "Content-Type": "text/plain" })
                    res.write("Error 500: Internal Server Error")
                    res.end()
                    return
                }
                res.writeHead(200, { "Content-Type": "text/html" })
                res.write(content)
                res.end()
            })
            return
        }

        const parsedUrl = url.parse(req.url)

        if (parsedUrl.pathname.substring(0, 8) === "/public/") {
            return servePublic(parsedUrl, res)
        }

        if (parsedUrl.pathname.substring(0, 5) === "/api/") {
            if (parsedUrl.pathname === "/api/search") {
                const parsedQuery = querystring.parse(parsedUrl.query)
                if ("q" in parsedQuery) {
                    const q = "" + parsedQuery["q"]
                    search(q)
                        .then((data) => {
                            res.writeHead(200, { "Content-Type": "application/json" })
                            res.write(JSON.stringify(data))
                            res.end()
                        })
                        .catch((err) => {
                            res.writeHead(500, { "Content-Type": "text/plain" })
                            res.write("Error 500: Es ist ein Fehler aufgetreten.")
                            res.end()
                        })
                    return
                } else {
                    res.writeHead(422, { "Content-Type": "text/plain" })
                    res.write("Error 422: Parameter searchterm fehlt!")
                    res.end()
                    return
                }
            }

            if (parsedUrl.pathname === "/api/info") {
                const parsedQuery = querystring.parse(parsedUrl.query)
                if ("q" in parsedQuery) {
                    const q = "" + parsedQuery["q"]
                    info(q)
                        .then((data) => {
                            res.writeHead(200, { "Content-Type": "application/json" })
                            res.write(JSON.stringify(data))
                            res.end()
                        })
                        .catch((err) => {
                            res.writeHead(500, { "Content-Type": "text/html" })
                            res.write("<strong>Error 500:</strong> Es ist ein Fehler aufgetreten.")
                            res.end()
                        })
                    return
                } else {
                    res.writeHead(422, { "Content-Type": "text/plain" })
                    res.write("Error 422: Parameter searchterm fehlt!")
                    res.end()
                    return
                }
            }
        }

        res.writeHead(404, { "Content-Type": "text/plain" })
        res.write("Error 404: Die Datei konnte nicht gefunden werden.")
        res.end()
    } catch (e) {
        res.writeHead(500, { "Content-Type": "text/plain" })
        res.write("Error 500: Internal Server Error")
        res.end()
    }
})

app.listen(8082)