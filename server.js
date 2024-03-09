const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Połączenie z bazą danych MongoDB
mongoose.connect('mongodb://localhost:27017/ebook_store', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Błąd połączenia z MongoDB:'));
db.once('open', () => console.log('Połączono z MongoDB'));

// Definicja schematu użytkownika
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});
const User = mongoose.model('User', userSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Endpoint do rejestracji użytkownika
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Sprawdzenie, czy użytkownik o podanej nazwie już istnieje
    User.findOne({ username: username }, (err, foundUser) => {
        if (err) {
            res.status(500).send('Wystąpił błąd podczas rejestracji.');
        } else if (foundUser) {
            res.status(400).send('Użytkownik o podanej nazwie już istnieje.');
        } else {
            // Zapisanie nowego użytkownika do bazy danych
            const newUser = new User({
                username: username,
                password: password
            });
            newUser.save(err => {
                if (err) {
                    res.status(500).send('Wystąpił błąd podczas rejestracji.');
                } else {
                    res.status(200).send('Użytkownik został zarejestrowany pomyślnie.');
                }
            });
        }
    });
});

app.listen(PORT, () => console.log(`Serwer uruchomiony na porcie ${PORT}`));
