const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const keys = require('../../config/keys');
const User = require('../../models/User');
const Contact = require('../../models/Contact');

// Load input validation
const  validateRegisterInput = require('../../validation/register');
const  validateLoginInput = require('../../validation/login');
const  validateContactInput = require('../../validation/contact');

router.post('/register', (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);

    // Check validation
    if(!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({ phonenumber: req.body.phonenumber })
        .then(user => {
            if (user) {
                errors.phonenumber = 'Phonenumber already exists'
                return res.status(400).json(errors);
            } else {
                const newUser = new User({
                    name: req.body.name,
                    phonenumber: req.body.phonenumber,
                    password: req.body.password
                });
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => res.json(user))
                            .catch(console.log(err));
                    });
                });

            }
        })
});


router.post('/login', (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);

    // Check validation
    if(!isValid) {
        return res.status(400).json(errors);
    }

    const phonenumber = req.body.phonenumber;
    const password = req.body.password;

    // Find the user by phone number
    User.findOne({ phonenumber })
        .then(user => {
            if (!user) {
                errors.phonenumber = 'User not found';
                return res.status(404).json(errors);
            } else {
                // Check password
                bcrypt.compare(password, user.password)
                    .then(isMatched => {
                        if (isMatched) {
                            // User matched
                            const payload = {
                                id: user._id,
                                name: user.name,
                                phonenumber: user.phonenumber
                            }
                            // Sign Token
                            jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
                                res.json({
                                    token: 'Bearer ' + token
                                });
                            });
                        } else {
                            errors.password = 'Password incorrect';
                            return res.status(400).json(errors);
                        }
                    });
            }
        });
});

router.post('/addcontact', (req, res) => {
    const { errors, isValid } = validateContactInput(req.body);

    // Check validation
    if(!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({ phonenumber: req.body.phonenumber })
        .then(user => {
            if (user) {
                Contact.findOne({ $or: [{ user1_id: req.body.id, user2_id: user._id }, { user1_id: user._id, user2_id: req.body.id }] })
                    .then(contact => {
                        if (contact) {
                            errors.phonenumber = 'Contact already exist';
                            return res.status(400).json(errors);
                        } else {
                            const newContact = new Contact({
                                user1_id: req.body.id,
                                user2_id: user._id
                            });
                            newContact
                                .save()
                                .then(cnt => {
                                    res.json(cnt);
                                })
                                .catch(err => console.log(err));
                        }
                    })
                    .catch(err => console.log(err));
            } else {
                errors.phonenumber = 'Phonenumber does not exists'
                return res.status(404).json(errors);
            }
        })
});

router.get('/verify', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        phonenumber: req.user.phonenumber,
        contactId: ''
    });
});

module.exports = router;