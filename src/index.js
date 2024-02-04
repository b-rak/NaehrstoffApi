"use strict"

import "../scss/index.scss"

import ProductSearch from "./controllers/ProductSearch"
import ProductList from "./controllers/ProductList"
import Nährwerte from "./controllers/Nährwerte"

const productSearch = new ProductSearch(
  document.getElementById("productSearchInput"),
  document.getElementById("productSearchButton"), 
  document.getElementById("productSearchResults")
)
productSearch.init()

const productList = new ProductList(
  document.getElementById("productList")
)
productList.init()

const naehrwerte = new Nährwerte(
  document.getElementById("Nährwerte_carbs"),
  document.getElementById("Nährwerte_protein"),
  document.getElementById("Nährwerte_fat")
)
naehrwerte.init()

productList.addProduct(1102654)

productSearch.events.on("productSelected", (fdcId) => {
  productList.addProduct(fdcId)
})

productList.events.on("productListChange", (nutrients) => {
  naehrwerte.update(nutrients)
})