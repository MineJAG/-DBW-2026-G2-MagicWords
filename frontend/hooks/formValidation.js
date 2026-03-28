"use strict";
import { createArrayById } from "../utils/arrayCreation";


export function initializeFormValidation() {
  const fieldIds = ["username", "email", "password", "passwordVerification"];
  const fields = createArrayById(fieldIds);
}