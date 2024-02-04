"use strict"

const Nährwerte = require("./Nährwerte")
/**
 * @jest-environment jsdom
 */
describe("Food Nutrients", () => {
    let carbElement, proteinElement, fatElement, nährwerte

    beforeEach(() => {
        carbElement = document.createElement("span")
        proteinElement = document.createElement("span")
        fatElement = document.createElement("span")
        nährwerte = new Nährwerte(carbElement, proteinElement, fatElement)
    })

    test("Constructor initialize", () => {
        expect(nährwerte).not.toBeNull()
    })

    describe("setNutrients", () => {
        test("update carbs", () => {
            nährwerte.update({carbs: 100, protein: 0, fat: 0})
            expect(carbElement.textContent).toBe("100")
            expect(proteinElement.textContent).toBe("0")
            expect(fatElement.textContent).toBe("0")
        })
        
        test("update protein", () => {
            nährwerte.update({carbs: 0, protein: 100, fat: 0})
            expect(carbElement.textContent).toBe("0")
            expect(proteinElement.textContent).toBe("100")
            expect(fatElement.textContent).toBe("0")
        })

        test("update fat", () => {
            nährwerte.update({carbs: 0, protein: 0, fat: 100})
            expect(carbElement.textContent).toBe("0")
            expect(proteinElement.textContent).toBe("0")
            expect(fatElement.textContent).toBe("100")
        })

        test("check rounding", () => {
            nährwerte.update({carbs: 27.333333333, protein: 60.88888888, fat: 100.2121212121})
            expect(carbElement.textContent).toBe("27.33")
            expect(proteinElement.textContent).toBe("60.89")
            expect(fatElement.textContent).toBe("100.21")
        })
    })
})