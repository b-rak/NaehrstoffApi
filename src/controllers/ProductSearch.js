"use strict"

const {search} = require("../api/product")
const {on} = require("../utils/dom")
const EventEmitter = require("eventemitter3")

/**
 * 
 * @param {HTMLInputElement} inputElement 
 * @param {HTMLButtonElement} buttonElement 
 * @param {HTMLDivElement} resultsElement
 */
function ProductSearch(inputElement, buttonElement, resultsElement) {
  this.inputElement = inputElement
  this.buttonElement = buttonElement
  this.resultsElement = resultsElement

  this.events = new EventEmitter()
}

ProductSearch.prototype.init = function() {
  this.buttonElement.addEventListener("click", (event) => {
    event.preventDefault()

    const inputValue = this.inputElement.value
    this.runSearch(inputValue)
  })

  on(".product-search-result-item", "click", (event) => {
    event.originalEvent.preventDefault()
    const fdcid = event.handleObj.getAttribute("data-fdcid")
    
    this.events.emit("productSelected", fdcid)
  })
}

ProductSearch.prototype.runSearch = function(term) {
  search(term)
  .then((results) => {
    //Liste leeren, falls schon Ergebnisse angezeigt werden
    this.resultsElement.innerHTML = ""

    for (const result of results) {
      const linkElement = document.createElement("a")
      linkElement.classList.add("list-group-item")
      linkElement.classList.add("list-group-item-action")
      linkElement.classList.add("product-search-result-item")
      linkElement.setAttribute("href", "#")
      linkElement.setAttribute("data-fdcid", result["fdcId"])
      linkElement.innerText = result["description"]

      this.resultsElement.append(linkElement)
    }
  })
  .catch((err) => {
    alert("Es ist ein Fehler aufgetreten. Bitte starten Sie eine neue Suche!")
  })
}

module.exports = ProductSearch