const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

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
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Sprawdzenie, czy użytkownik o podanej nazwie już istnieje
        const existingUser = await User.findOne({ username: username });
        if (existingUser) {
            return res.status(400).send('Użytkownik o podanej nazwie już istnieje.');
        }

        // Haszowanie hasła
        const hashedPassword = await bcrypt.hash(password, 10);

        // Zapisanie nowego użytkownika do bazy danych
        const newUser = new User({
            username: username,
            password: hashedPassword
        });
        await newUser.save();
        res.status(201).send('Użytkownik został zarejestrowany pomyślnie.');
    } catch (error) {
        res.status(500).send('Wystąpił błąd podczas rejestracji.');
    }
});

// Endpoint do logowania użytkownika
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Wyszukanie użytkownika w bazie danych
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(404).send('Nieprawidłowa nazwa użytkownika lub hasło.');
        }

        // Porównanie hasła
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).send('Nieprawidłowa nazwa użytkownika lub hasło.');
        }

        res.status(200).send('Zalogowano pomyślnie.');
    } catch (error) {
        res.status(500).send('Wystąpił błąd podczas logowania.');
    }
});

app.listen(PORT, () => console.log(`Serwer uruchomiony na porcie ${PORT}`));
