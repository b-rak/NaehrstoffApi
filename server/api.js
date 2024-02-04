"use strict"

const axios = require("axios")

const auth = {
  username: "nZlbRZgYpJVMWUDE09bte63RhnQT5oGIfkYq0Jhd"
}

module.exports.search = function search(term) {
  return axios
    .post("https://api.nal.usda.gov/fdc/v1/foods/search", {
      generalSearchInput: term
    }, { auth })
    .then((response) => response.data)
}

module.exports.info = function info(fdcId) {
  return axios
    .get("https://api.nal.usda.gov/fdc/v1/food/" + fdcId + `?nutrients=203&nutrients=204&nutrients=205&api_key=${auth.username}`).then((response) => response.data)

}