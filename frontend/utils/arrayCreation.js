"use strict";

export function createArrayById(array) {

  const fields = array
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  return fields;

}