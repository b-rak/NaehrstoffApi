"use strict"

import axios from "axios"

 export async function search(term) {
  const url = "/api/search"
  const response = await axios
    .get(url, {
      params: {
        q: term
      }
    })
    return response.data['foods']
}

export async function info(fdcId) {
  const url = "/api/info"
  const response = await axios
    .get(url, {
      params: {
        q: fdcId
      }
    })
    return response.data
}


/*
const auth = {
  username: "nZlbRZgYpJVMWUDE09bte63RhnQT5oGIfkYq0Jhd"
}

export async function search(term) {
  const response = await axios
    .post("https://api.nal.usda.gov/fdc/v1/search", {
      generalSearchInput: term
    }, {auth})
  return response.data['foods']
}

export async function info(fdcId) {
  const response = await axios
    .get("https://api.nal.usda.gov/fdc/v1/" + fdcId, {auth})
  return response.data
}
*/