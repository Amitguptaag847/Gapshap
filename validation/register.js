const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
    let errors = {};
    data.name = !isEmpty(data.name)? data.name : '';
    data.phonenumber = !isEmpty(data.phonenumber)? data.phonenumber : '';
    data.password = !isEmpty(data.password)? data.password : '';
    data.re_password = !isEmpty(data.re_password)? data.re_password : '';

    if(!Validator.isLength(data.name, { min: 1, max: 20})) {
        errors.name = 'Name must be between 1 and 20 characters';
    }
    if(Validator.isEmpty(data.name)) {
        errors.name = 'Name field is required';
    }
    if(!Validator.isLength(String(data.phonenumber), { min: 10, max: 10})) {
        errors.phonenumber = 'Length of phonenumber must be 10';
    }
    if(!Validator.isNumeric(String(data.phonenumber), { no_symbols: true })) {
        errors.phonenumber = 'Phonenumber must be numeric';
    }
    if(Validator.isEmpty(String(data.phonenumber))) {
        errors.phonenumber = 'Phonenumber field is required';
    }
    if(!Validator.isLength(data.password, { min: 1, max: 20})) {
        errors.password = 'Password must be between 1 and 20 characters';
    }
    if(Validator.isEmpty(data.password)) {
        errors.password = 'Password field is required';
    }
    if(!Validator.equals(data.re_password, data.password)) {
        errors.re_password = 'Re-Password and password must be same';
    }
    if(Validator.isEmpty(data.re_password)) {
        errors.re_password = 'Re-Password field is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}