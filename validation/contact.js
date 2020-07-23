const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateContactInput(data) {
    let errors = {};
    
    data.phonenumber = !isEmpty(data.phonenumber)? data.phonenumber : '';

    if(!Validator.isLength(String(data.phonenumber), { min: 10, max: 10})) {
        errors.phonenumber = 'Length of phonenumber must be 10';
    }
    if(!Validator.isNumeric(String(data.phonenumber), { no_symbols: true })) {
        errors.phonenumber = 'Phonenumber must be numeric';
    }
    if(Validator.isEmpty(String(data.phonenumber))) {
        errors.phonenumber = 'Phonenumber field is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}