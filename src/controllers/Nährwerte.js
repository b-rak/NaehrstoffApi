"use strict"

/**
 * 
 * @param {HTMLSpanElement} carbElement 
 * @param {HTMLSpanElement} proteinElement 
 * @param {HTMLSpanElement} fatElement 
 */
function Nährwerte(carbElement, proteinElement, fatElement) {
    this.carbElement = carbElement
    this.proteinElement = proteinElement
    this.fatElement = fatElement
}

Nährwerte.prototype.init = function() {

}

Nährwerte.prototype.update = function(nutrients) {
    this.carbElement.textContent = Math.round(nutrients.carbs * 100) / 100
    this.proteinElement.textContent = Math.round(nutrients.protein * 100) / 100
    this.fatElement.textContent = Math.round(nutrients.fat * 100) / 100
}

module.exports = Nährwerte