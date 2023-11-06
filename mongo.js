const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://sallysegui10:${password}@cluster0.uwaskso.mongodb.net/?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    id: Number,
  name: String,
  number:Stringr,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
    "id": 23,
    "name": "Lili",
    "number": "989239487"
})

person.save().then(result => {
  console.log('person saved!')
  mongoose.connection.close()
})