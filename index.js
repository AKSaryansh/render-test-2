require('dotenv').config() // this is important 
const express = require('express')
const app = express()
app.use(express.static('dist'))
app.use(express.json())

const mongoose = require('mongoose')
const url = process.env.MONGODB_URI;
// console.log(url);
// const url = "mongodb+srv://aryansh355:3j8C8kQqKUvuPmqz@cluster0.ubtwf.mongodb.net/Phonebook?retryWrites=true&w=majority"

mongoose.set('strictQuery', false);
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: {
        type : String,
        minLength : 3,
        required : true
    },
    number: {
        type : String,
        minLength : 5,
        requires : true},
});
personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

const Person = mongoose.models.Person || mongoose.model('Person', personSchema);



const cors = require('cors')
app.use(cors())


// app.use(morgan)

// let persons = [
//     { 
//       id: "1",
//       name: "Arto Hellas", 
//       number: "040-123456"
//     },
//     { 
//       id: "2",
//       name: "Ada Lovelace", 
//       number: "39-44-5323523"
//     },
//     { 
//       id: "3",
//       name: "Dan Abramov", 
//       number: "12-43-234345"
//     },
//     { 
//       id: "4",
//       name: "Mary Poppendieck", 
//       number: "39-23-6423122"
//     }
// ]

app.get('/',(request,response) =>{
    response.send('<h1>Hi, this is the Backend for your PhoneBook</h1>')
})


app.get('/api/persons',(request,response) =>{
    Person.find({}).then((persons)=>{
        response.json(persons);
    })
})

const getDateTime = ()=>{
    const now = new Date();

    // Convert to Eastern European Time (EET) by setting options
    const options = {
      timeZone: 'Europe/Kyiv', // Or other major cities in EET
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'shortOffset',
      hour12: false, // 24-hour format
    };
  
    // Format the date to match the target format
    const formattedDate = now.toLocaleString('en-US', options);
    
    // Display the result
    return (`${formattedDate} (Eastern European Standard Time)`);
  
}
// const getLength = ()=>{
//     Person.find({}).then((persons)=>{
//         return persons.length;
//     })
// }

app.get('/info',(request,response)=>{
    Person.find({}).then((persons)=>{
        response.send(`<p>PhoneBook has ${persons.length} entries</p><p>${getDateTime()}</p>`)
    })
    
})

app.get('/api/persons/:id',(request,response) =>{
    const id_req = request.params.id;
    console.log(id_req)

    // const p = persons.find((person)=>{return person.id === id_req});
    Person.findById(id_req).then((p)=>{
        console.log(p);
        if (p){
            response.json(p);
        }
        else{
            console.log("hi");
            response.status(404).json({error: "person with this id is missing"});
        }
    })
})

app.delete('/api/persons/:id',(request,response) =>{
    const id_req = request.params.id;
     Person.findById(id_req).then((el)=>{
        if (el){
            Person.findByIdAndDelete(id_req).then((res)=>{
                // the result is something that has been deleted 
                console.log(res);
                Person.find({}).then((persons)=>{
                    response.json(persons);
                })
            })
            // persons = persons.filter((person)=>{return person.id !== id_req});
        }
        else{
            response.send("person with this ID does not exist");
        }
     })
})


app.post('/api/persons',(request,response)=>{
    const body = request.body;
    console.log("h1");
    if (!(body.name) || !(body.number)){
        console.log("hi");
        return response.status(400).send("The person without name/number is not allowed");
    }
    // const el = persons.find((person) =>{return (person.name === body.name)});
    Person.find({name : body.name}).then((el)=>{
        if (el.length>0){
            // console.log("hi");
            return response.status(400).send("The person with this name already exists in the phonebook");
        }
        const new_per = new Person({
            name : body.name,
            number : body.number
        })
        // persons = persons.concat(per_new);
        new_per.save()
        .then(()=>{
            console.log("post");
            // console.log(persons);
            response.json(new_per);
        })
        .catch((error) =>{
            console.log(error.name);
            response.json({error : error.name});
        })
    })
    // console.log(persons);
    // console.log(el);
    })

    app.put('/api/persons', (request, response) => {
        const body = request.body;
    
        // Validate the request body
        if (!body.name || !body.number) {
            return response.status(400).json({ error: 'Name and number must be provided' });
        }
    
        // Find a person by name
        Person.findOne({ name: body.name })
            .then((person) => {
                if (!person) {
                    // If the person is not found, return an error response
                    return response.status(404).json({ error: 'Person not found' });
                }
    
                // Update the person's number
                person.number = body.number;
    
                // Save the updated person back to the database
                person.save()
                    .then((updatedPerson) => {
                        response.json(updatedPerson);
                    })
                    .catch((error) => {
                        console.error('Error saving the person:', error.message);
                        response.json({error : error.name});
                        // response.status(500).json({ error: 'Failed to update the person' });
                    });
            })
            .catch((error) => {
                console.error('Error finding the person:', error.message);
                response.status(500).json({ error: 'Failed to find the person' });
            });
    });


const PORT = process.env.PORT || 3011
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
