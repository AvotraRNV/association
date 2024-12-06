const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Configuration de MySQL
const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'incidents_db',
});

app.use(bodyParser.json());
app.use(cors());

app.post('/api/incidents', (req, res) => {
    const { username, person, name, department, date } = req.body;

    const query = 'INSERT INTO incidents (username, person, name, department, date) VALUES (?, ?, ?, ?, ?)';
    db.execute(query, [username, person, name, department, date], (err, result) => {
        if (err) {
            console.error('Erreur lors de l\'insertion :', err);
            return res.status(500).json({ message: 'Une erreur est survenue' });
        }
    res.status(200).json({ message: 'Incident ajouté avec succès' });
    });
});

app.get('/api/persons', (req, res) => {
    db.query('SELECT * FROM persons', (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Erreur serveur' });
        }
        res.json(results);
    });
});
  
app.get('/api/reports/:personName', (req, res) => {
    const { personName } = req.params;
    db.query('SELECT * FROM reports WHERE person_name = ?', [personName], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Impossible de charger les rapports' });
        }
        res.json(results);
    });
});
  
app.get('/api/reports/:reportId', (req, res) => {
    const { reportId } = req.params;
    db.query('SELECT * FROM reports WHERE id = ?', [reportId], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Impossible de charger le rapport' });
        }
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ message: 'Rapport non trouvé' });
        }
    });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
  
    db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Erreur serveur' });
        }
        if (results.length > 0) {
            return res.status(200).json(results[0]);
        } else {
            return res.status(401).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
        }
    });
});

app.get('/api/persons', (req, res) => {
    db.query('SELECT * FROM persons', (err, results) => {
        if (err) {
            console.error('Erreur pour récupérer les personnes', err);
            return res.status(500).json({ message: 'Erreur du serveur' });
        }
        res.status(200).json(results);
    });
});

app.listen(PORT, () => console.log(`Serveur actif sur le port ${PORT}`));
