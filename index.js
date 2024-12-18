const express = require('express')
const app = express()
app.use(express.static('dist'))
app.use(express.json())

const cors = require('cors')
app.use(cors())

const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => Number(n.id)))
      : 0
    return String(maxId + 1)
  }

// app.use(morgan)

let persons = [
    { 
      id: "1",
      name: "Arto Hellas", 
      number: "040-123456"
    },
    { 
      id: "2",
      name: "Ada Lovelace", 
      number: "39-44-5323523"
    },
    { 
      id: "3",
      name: "Dan Abramov", 
      number: "12-43-234345"
    },
    { 
      id: "4",
      name: "Mary Poppendieck", 
      number: "39-23-6423122"
    }
]

app.get('/',(request,response) =>{
    response.send('<h1>Hi, this is the Backend for your PhoneBook</h1>')
})


app.get('/api/persons',(request,response) =>{
    response.json(persons);
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

app.get('/info',(request,response)=>{
    response.send(`<p>PhoneBook has ${persons.length} entries</p><p>${getDateTime()}</p>`)
})

app.get('/api/persons/:id',(request,response) =>{
    const id_req = request.params.id;
    const p = persons.find((person)=>{return person.id === id_req});
    if (p){
        response.json(p);
    }
    else{
        response.status(404).json({error: "person with this id is missing"});
    }
})

app.delete('/api/persons/:id',(request,response) =>{
    const id_req = request.params.id;
    const el = persons.find((person)=>{return person.id===id_req});
    if (el){
        persons = persons.filter((person)=>{return person.id !== id_req});
        setTimeout(()=>{
            console.log(persons)
        },2000);
        response.json(persons);
    }
    else{
        response.send("person with this ID does not exist");
    }
})


app.post('/api/persons',(request,response)=>{
    const body = request.body;
    console.log("h1");
    if (!(body.name) || !(body.number)){
        console.log("hi");
        return response.status(400).send("The person without name/number is not allowed");
    }
    const el = persons.find((person) =>{return (person.name === body.name)});
    // console.log(persons);
    // console.log(el);
    if (el){
        // console.log("hi");
        return response.status(400).send("The person with this name already exists in the phonebook");
    }
    const per_new = {
        id : generateId(),
        name : body.name,
        number : body.number
    }
    persons = persons.concat(per_new);
    // console.log(persons);
    response.json(per_new);
})


const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
