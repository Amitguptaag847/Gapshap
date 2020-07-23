const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const users = require('./routes/api/users');
const chat = require('./routes/api/chat');

const Contact = require('./models/Contact');
const Chat = require('./models/Chat');
const User = require('./models/User');


const app = express();
const server = http.createServer(app);
const io = socketio(server);

if (process.env.NODE_ENV == 'production') {
    app.use(express.static(path.join(__dirname, 'public')));
    app.get('/', function (req, res) {
        const index = path.join(__dirname, 'public', 'index.html');
        res.sendFile(index);
    });
    app.get('/login', function (req, res) {
        const index = path.join(__dirname, 'public', 'index.html');
        res.sendFile(index);
    });
    app.get('/register', function (req, res) {
        const index = path.join(__dirname, 'public', 'index.html');
        res.sendFile(index);
    });
    app.get('/main', function (req, res) {
        const index = path.join(__dirname, 'public', 'index.html');
        res.sendFile(index);
    });
}

// DB config
const db = require('./config/keys').mongoURI;
// COnnect to MongoDB
mongoose
    .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB commected...'))
    .catch(err => console.log(err));

// Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

io.on('connection', socket => {
    console.log('User connected...');
    let rooms = [];
    socket.on('disconnect', function () {
        console.log('user disconnected');
        rooms.forEach(room => {
            let temp = {
                id: room,
                online: false
            }
            io.in(room).emit('amOnline', temp);
        })
    });
    socket.on('amOnline', (data) => {
        let temp = {
            id: data.id,
            online: true
        }
        io.sockets.in(data.id).emit('amOnline', temp);
    })
    socket.on('updateContact', (data) => {
        io.sockets.in(data.user2_id).emit('updateContact', true);
    });
    socket.on('getAllContact', async (id) => {
        if (id) {
            socket.join(id);
            let contacts = [];
            await getAllContact(id)
                .then((res) => {
                    contacts = res;
                })
                .catch(err => console.log(err));
            contacts.forEach(contact => {
                socket.join(contact.contactId);
                let temp = {
                    id: contact.contactId,
                    online: true
                }
                socket.broadcast.to(contact.contactId).emit('isOnline', temp);
                rooms.push(contact.contactId);
            });
            socket.emit('getAllContact', contacts);
        }
    });
    socket.on('newMessage', (data) => {
        const newChat = new Chat({
            contactId: data.contactId,
            message: data.message,
            senderId: data.id
        });
        newChat
            .save()
            .then(chat => {
                io.sockets.in(chat.contactId).emit('newMessage', chat);
            })
            .catch(err => console.log(err));
    });
    socket.on('reloadChat', (data) => {
        Chat.find({ contactId: data.contactId })
            .then((chats) => {
                io.sockets.in(data.contactId).emit('reloadChat', chats);
            })
            .catch(err => console.log(err));
    });
});

// Passport middleware
app.use(passport.initialize());

// Passport Config 
require('./config/passport')(passport);

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
});

// Use Routes
app.use('/api/users', users);
app.use('/api/chat', chat);

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => console.log(`Server started on port : ${PORT}...`)).on('error', (err) => console.log(err));

function getAllContact(id) {
    return new Promise((resolve, reject) => {
        Contact.find({ $or: [{ user1_id: id }, { user2_id: id }] })
            .then((data) => {
                if (data.length) {
                    const contacts = data.map(async (contact) => {
                        let cts = {};
                        cts.contactId = contact._id;
                        let friendId = (id === contact.user1_id) ? contact.user2_id : contact.user1_id;
                        await getUserDetails(friendId)
                            .then(function (result) {
                                cts.id = result._id;
                                cts.name = result.name;
                                cts.phonenumber = result.phonenumber;
                            })
                            .catch(err => console.log(err));
                        await getLastMessage(contact._id)
                            .then(function (result1) {
                                cts.lastMessage = result1.message;
                                cts.time = result1.time;
                                cts.online = false;
                            })
                            .catch(err => console.log(err));
                        return cts;
                    });
                    Promise.all(contacts)
                        .then(res => {
                            res.sort(compare);
                            resolve(res);
                        });
                }
            })
            .catch(err => console.log(err));
    });
}

function getLastMessage(contactid) {
    return Chat.findOne({ contactId: contactid }).sort({ time: -1 })
        .then(chat => {
            if (chat) {
                return chat;
            } else {
                let time = new Date('2020-05-05T18:43:33.391+00:00')
                chat = {
                    message: '',
                    time: time
                }
                return chat;
            }
        })
        .catch(err => console.log(err));
}

function getUserDetails(id) {
    return User.findOne({ _id: id })
        .then(details => {
            return details;
        })
        .catch(err => console.log(err));
}

function compare(a, b) {
    if (a.time > b.time) {
        return 1;
    }
    if (a.time < b.time) {
        return -1;
    }
    return 0;
}