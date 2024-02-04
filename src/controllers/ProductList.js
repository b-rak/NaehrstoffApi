"use strict"

import { info } from "../api/product"
import addProductTemplate from "../templates/ProductList/addProduct.ejs"
import { on } from "../utils/dom"
import EventEmitter from "eventemitter3"

const { prototype } = require("eventemitter3")

export default class ProductList {
    /**
     * 
     * @param {HTMLTableElement} listElement 
     */
    constructor(listElement) {
        this.products = []
        this.listElement = listElement
        this.events = new EventEmitter()
    }

    init() {
        on(".remove-product", "click", (event) => {
            const fdcId = parseInt(event.handleObj.getAttribute("data-fdc"), 10)
            this.removeProduct(fdcId)
        })

        on(".product-search__amount", "change", (event) => {
            const fdcId = parseInt(event.handleObj.getAttribute("data-fdc"), 10)
            this.updateAmount(fdcId, parseInt(event.handleObj.value, 10))
        })
    }

    emitNutrients() {
        this.events.emit("productListChange", this.getNutrients())
    }

    getNutrientsForProduct(product) {

        const getAmount = (number) => {
            const tempNutrient = product.data["foodNutrients"]
                .find((nutrient) => ("" + nutrient.nutrient["number"]) === number)
            if (tempNutrient) {
                return tempNutrient.amount
            } else {
                return 0
            }
        }

        const nutrients = {
            protein: getAmount("203"),
            fat: getAmount("204"),
            carbs: getAmount("205")
        }

        return {
            protein: (nutrients.protein / 100) * product.amount,
            fat: (nutrients.fat / 100) * product.amount,
            carbs: (nutrients.carbs / 100) * product.amount
        }
    }

    getNutrients() {
        const nutrients = {
            protein: 0,
            fat: 0,
            carbs: 0
        }

        return this.products.reduce((prev, cur) => {
            const productNutrients = this.getNutrientsForProduct(cur)
            return {
                protein: prev.protein + productNutrients.protein,
                fat: prev.fat + productNutrients.fat,
                carbs: prev.carbs + productNutrients.carbs
            }
        }, nutrients)
    }

    updateAmount(fdcId, value) {

        this.products = this.products.map((product) => {
            if (("" + product.data["fdcId"]) === ("" + fdcId)) {
                product.amount = value
            }
            return product
        })

        this.emitNutrients()
    }

    removeProduct(fdcId) {
        let index = this.products
            .findIndex(product => ("" + product.data["fdcId"]) === ("" + fdcId))

        if (index !== null) {
            this.products.splice(index, 1)

            const listItemElement = document.querySelector(".list-item[data-fdc='" + fdcId + "']")
            if (listItemElement) listItemElement.remove()
        }
        this.emitNutrients()
    }

    async addProduct(fdcId) {
        const exists = this.products
            .some(product => ("" + product.data["fdcId"]) === ("" + fdcId))

        if (exists) return

        //Daten von der API holen
        try {
            const responseData = await info(fdcId)
            this.addFetchedProduct(responseData)
        } catch (err) {
            alert("Produkt konnte nicht hinzugefügt werden. Bitte probieren Sie es erneut!")
        }


        /* nicht schön, aber nur zur Übung gemacht -> lieber Templates nutzen!
        //Neuen Eintrag erstellen
        const newListElement = document.createElement("tr")
        newListElement.classList.add("list-item")

        //Linke Hälfte des Eintrages: Name
        const tdNameElement = document.createElement("td")
        tdNameElement.classList.add("item-name")
        const nameSpanElement = document.createElement("span")
        nameSpanElement.innerText = data["description"]
        tdNameElement.append(nameSpanElement)

        //Rechte Hälfte des Eintrages: Menge
        const tdAmountElement = document.createElement("td")
        tdAmountElement.classList.add("item-amount")

        const inputElement = document.createElement("input")
        inputElement.classList.add("product-amount")
        inputElement.setAttribute("type", "number")
        inputElement.setAttribute("value", "100")
        inputElement.setAttribute("min", "0")

        const buttonElement = document.createElement("button")
        buttonElement.classList.add("close")
        buttonElement.setAttribute("type", "button")
        buttonElement.setAttribute("data-dismiss", "alert")
        buttonElement.setAttribute("aria-label", "Close")
        const buttonSpanElement = document.createElement("span")
        buttonSpanElement.innerText = "×"
        buttonSpanElement.setAttribute("aria-hidden", "true")
        buttonElement.append(buttonSpanElement)

        tdAmountElement.append(inputElement)
        tdAmountElement.append(buttonElement)

        //Element aus beiden Hälften zusammensetzen
        newListElement.append(tdNameElement)
        newListElement.append(tdAmountElement)

        this.listElement.append(newListElement)
        */
    }

    addFetchedProduct(data) {
        this.products.push({
            amount: 100,
            data
        })
        // currently not working 
        /*
        const productHTML = addProductTemplate({
            title: data["description"],
            fdcId: data["fdcId"]
        })
        */

        const productHTML = this.fillTemplate(data)
        console.log(productHTML)
        // this.listElement.innerHTML = this.listElement.innerHTML + productHTML //unschön und langsam, da HTML des Element immer komplett geladen wird und dann das Resultat in neuen HTML Code umgewandelt wird
        this.listElement.insertAdjacentHTML("beforeend", productHTML)

        this.emitNutrients()
    }

    fillTemplate(data) {
        return `<tr class="list-item" data-fdc="${data.fdcId}">
  <td>
    <span data-testid="title">${data.description}</span>
  </td>
  <td>
    <input
      class="product-amount product-search__amount"
      type="number"
      value="100"
      min="0"
      data-fdc="${data.fdcId}"
    />
    <button
      type="button"
      class="close remove-product"
      data-dismiss="alert"
      aria-label="Close"
      data-fdc="${data.fdcId}"
    >
      <span aria-hidden="true">&times;</span>
    </button>
  </td>
</tr>
`

    }
}