const express = require('express')
const app = express()
app.use(express.json())
const morgan = require('morgan')
//app.use(morgan('tiny'))
app.use(morgan(':method :url :status :req[content-length] :response-time ms :body'));
morgan.token('body', (req, res) => JSON.stringify(req.body));
const cors = require('cors')
app.use(cors())

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  },
  {
    "name": "Lola",
    "number": "9879345024"
}
]


app.get('/info', (request, response) => {
  const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => n.id))
      : 0
    return maxId
  }
   const dateRequet = new Date().toString()
   //const dateRequet  = new Date("2020-05-12T23:50:21.817Z").toString()
  response.send(`<h3>Phonebook has info for ${generateId()} people</h3>
  <p>${dateRequet}</p>`)
})


app.get('/api/persons', (request, response) => {
  response.json(persons)
})


app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  person = persons.filter(person => person.id !== id)
  response.status(204).end()
})

const idNum = Math.floor(Math.random() * 4556432)
app.post('/api/persons', (request, response) => {
  const body = request.body
  const nameRepited = persons.find(person => person.name.toLowerCase() === body.name.toLowerCase())
  const numberRepited = persons.find(person => person.number === body.number)
  if (!body) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  } else if (nameRepited) { 
    return response.status(400).json({ 
      error: 'name must be unique'
  })
  } else if (numberRepited) { 
    return response.status(400).json({ 
    error: 'the number is already in the phonebook' 
  })
  }
  const person = {
    id: idNum,
    ...body 
  }
  persons = persons.concat(person)
  // console.log(person)
  response.json(person)
})

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId(),
  }

  notes = notes.concat(note)

  response.json(note)
})



// const PORT = 3001
// app.listen(PORT)
// console.log(`Server running on port ${PORT}`)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})