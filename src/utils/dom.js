"use strict"

module.exports.on = function on(selector, eventType, cb) {
    document.addEventListener(eventType, (event) => {
      let element = event.target
  
      while (element) {
        if (element.matches(selector)) {
          return cb({
            handleObj: element, 
            originalEvent: event
          })
        }
        element = element.parentElement
      }
    })
  }