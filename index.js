const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

app.use(express.json());

morgan.token('data', function (req, res) {
  if (req.method === 'POST') {
    return JSON.stringify(req.body);
  }
  return ' ';
});

app.use(
  morgan(
    ':method :url :status :res[content-length] - :total-time ms  :data'
  )
);
app.use(cors());

// app.use(morgan('tiny'));
let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

const generateId = () => {
  return Math.floor(Math.random() * 10000000);
};

app.get('/info', (req, res) => {
  let date = new Date();
  res.send(
    `<p>Phonebook has info for ${
      persons.length
    } people</p><p>${date.toString()}</p>`
  );
});

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
  const person = persons.find(
    (person) => person.id === Number(req.params.id)
  );

  if (person) {
    res.json(person);
  } else {
    res.status(404).json({
      error: 'person not found',
    });
  }
});

app.post('/api/persons', (req, res) => {
  let body = req.body;

  if (!body.name) {
    return res.status(400).json({
      error: 'new person must have a name',
    });
  }

  let found = persons.find((person) => {
    return person.name.toLowerCase() === body.name.toLowerCase();
  });

  if (found) {
    return res.status(400).json({
      error: 'name must be unique',
    });
  }
  //   console.log(person);
  const newPerson = {
    id: generateId(),
    name: body.name,
    number: body.number || '000-000000',
  };

  persons = [...persons, newPerson];
  console.log(persons);

  res.json(newPerson);
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);

  res.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log('server listening on port: ', PORT);
});
