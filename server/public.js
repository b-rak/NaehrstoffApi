"use strict"

const path = require("path")
const mimeTypes = require("mime-types")
const fs = require("fs")

module.exports = function(parsedUrl, res) {
    const sanitizePath = path.normalize(parsedUrl.pathname.substr(7)).replace(/^(\.\.[\/\\])+/, '')
    const absolutePath = path.join(__dirname, "..", "public", sanitizePath)

    fs.exists(absolutePath, (exists) => {
        //Existiert die Datei an dem Pfad?
        if (!exists) {
            res.writeHead(404, {
                "Content-Type": "text/plain"
            })
            res.write("404 not found")
            res.end()
            return
        }
        //Wenn ja, lese die Datei ein
        fs.readFile(absolutePath, (err, content) => {
            //Fehler beim Einlesen abfangen
            if (err) {
                res.writeHead(500, {
                    "Content-Type": "text/plain"
                })
                res.write("500 Internal Server Error")
                res.end()
                return
            } 
            //Einlesen erfolgreich
            res.writeHead(200, {
                "Content-Type": mimeTypes.lookup(sanitizePath)
            })
            res.write(content)
            res.end()
        })
    })
}
