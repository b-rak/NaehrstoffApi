"use strict"

import ProductList from "./ProductList"

describe("ProductList", () => {
    let productList, listElement

    beforeEach(() => {
        listElement = document.createElement("tbody")
        //tbody kann nur in einem table Element dargestellt werden, darf nicht alleine stehen
        const tableElement = document.createElement("table")
        tableElement.appendChild(listElement)
        //table am document Element anhängen -> dadurch kann die init Funktion getestet werden
        //die init Funktion ruft die on Funktion auf und diese kann nur Klicks auf dem Body des documents registrieren
        //Da wir aber den Klick für removeProduct auf dem tbody Element testen möchten, müssen wir dieses Element
        //auf dem body anhängen
        document.body.appendChild(tableElement)

        productList = new ProductList(listElement)
    })

    describe("addFetchedProduct", () => {
        const product = {
            description: "Test Produkt",
            fdcId: "123456", 
            foodNutrients: []
        }

        test("add a product to the list", () => {
            productList.addFetchedProduct(product)

            expect(productList.products.length).toBe(1)
            expect(productList.products[0].amount).toBe(100)
            expect(productList.products[0].data).toEqual(product)
        })

        test("generate HTML Element", () => {
            productList.addFetchedProduct(product)

            expect(
                listElement.querySelector("[data-testid='title']").textContent
            ).toBe("Test Produkt")
            
            expect(
                listElement.querySelector(".list-item").getAttribute("data-fdc")
            ).toBe("123456")

            expect(
                listElement.querySelector(".remove-product").getAttribute("data-fdc")
            ).toBe("123456")
        })

        test("trigger a changeNutrient Event", (done) => {
            productList.events.on("productListChange", (nutrients) => {
                done()
            })
            productList.addFetchedProduct(product)
        })
    })

    describe("update amount", () => {

        beforeEach(() => {
            productList.products = [
                {
                    amount: "100",
                    data: {
                        fdcId: "12345", 
                        foodNutrients: []
                    },
                },
                {
                    amount: "123",
                    data: {
                        fdcId: "33333", 
                        foodNutrients: []
                    }
                }
            ]
        })

        //wurde die korrekte Menge übernommen und aktualisiert
        test("update amount", () => {
            productList.updateAmount("12345", "125")

            expect(productList.products.length).toBe(2)
            expect(productList.products[0].amount).toBe("125")
            expect(productList.products[1].amount).toBe("123")
        })

        //wenn ein Produkt geupdated wird, was nicht in der Liste enthalten ist, soll sich nichts verändern
        test("update amount", () => {
            productList.updateAmount("54321", "345")

            expect(productList.products.length).toBe(2)
            expect(productList.products[0].amount).toBe("100")
            expect(productList.products[1].amount).toBe("123")
        })

        //werden die Events gefeuert
        test("trigger update event", (done) => {
            productList.events.on("productListChange", (nutrients) => {
                done()
            })
            productList.updateAmount("33333", "102")
        })
    })

    //streng genommen nicht mehr ein normaler Unit-Test
    //um die init Funktion zu testen, benötigen wir die addFetchedProduct Funktion,
    //daher wird hier unter anderem das Zusammenspiel beider Funktionen getestet
    describe("init", () => {
        beforeEach(() => {
            productList.addFetchedProduct({
                description: "Test Produkt",
                fdcId: "123456", 
                foodNutrients: []
            })

            productList.init()
        })

        test("Register click on remove button", () => {
            const removeButton = listElement.querySelector(
                ".remove-product[data-fdc='123456']"
            )
            expect(removeButton).not.toBeNull()

            productList.removeProduct = jest.fn() //Funktion mocken
            removeButton.click()

            expect(productList.removeProduct).toBeCalledWith(123456)
        })
    })
})