const express = require('express');
const app = express();
app.use(express.json());
const morgan = require('morgan');
app.use(morgan(':method :url :status :req[content-length] :response-time ms :body'));
morgan.token('body', (req, res) => JSON.stringify(req.body));
const cors = require('cors');
app.use(cors());
app.use(express.static('dist'));
require('dotenv').config();
const Person = require('./models/person_model');
// const requestLogger = (request, response, next) => {
//   console.log('Method:', request.method)
//   console.log('Path:  ', request.path)
//   console.log('Body:  ', request.body)
//   console.log('---')
//   next()
//}
// app.use(requestLogger)
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
}



const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};



app.get('/info', (request, response,next) => {
  Person.find({}).then(persons => {
    const numberPersons = persons.length
    const dateRequet = new Date().toString()
    response.send(`<h3>Phonebook has info for ${numberPersons} people</h3>
    <p>${dateRequet}</p>`)
  }).catch(error => next(error))
})

app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(persons => {
    response.json(persons)
  }).catch(error => next(error))
})


app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if(person){
      response.json(person)
    } else {
      response.status(404).end()
    }
  }).catch(error => next(error))
})

const idNum = Math.floor(Math.random() * 4556432)


app.post('/api/persons', (request, response, next) => {
  const body = request.body
  if (body === undefined||!body.name||!body.number) {
    return response.status(400).json({ error: 'content missing' })
  }
  Person.find({ $or:[ { 'name':body.name }, { 'number':body.number }] })
    .then(
      (result) => {
        if (!result.length>0){
          const person = new Person({
            id: idNum,
            name:body.name,
            number:body.number
          })
          person.save().then(savedPerson => { response.json(savedPerson) }).catch(error => next(error))
        } else {
          return response.status(400).send({ error: 'Either the number or the name is already in the phonebook' })
        }
      })
    .catch(error =>  next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body
  Person.findByIdAndUpdate(request.params.id, { name, number },
    { new: true, runValidators: true, context: 'query'  }
  )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then( result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})



app.use(unknownEndpoint)
app.use(errorHandler)





const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})