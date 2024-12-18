const mongoose = require('mongoose');

// Validate command-line arguments
if (process.argv.length < 3) {
    console.log('Usage: node mongo.js <password> [<name> <number>]');
    process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://aryansh355:${encodeURIComponent(password)}@cluster0.ubtwf.mongodb.net/Phonebook?retryWrites=true&w=majority`;

// Define the schema and model outside of conditional logic
mongoose.set('strictQuery', false);

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Person = mongoose.models.Person || mongoose.model('Person', personSchema);

// Connect to the database
mongoose.connect(url)
    .then(() => {
        if (process.argv.length === 3) {
            // List all persons if only the password is provided
            return Person.find({}).then((persons) => {
                console.log('Phonebook:');
                persons.forEach(person => console.log(`${person.name} ${person.number}`));
                mongoose.connection.close();
            });
        } else if (process.argv.length === 5) {
            // Add a new person if name and number are provided
            const name = process.argv[3];
            const number = process.argv[4];
            const person = new Person({ name, number });

            return person.save().then(() => {
                console.log(`Added ${name} number ${number} to phonebook`);
                mongoose.connection.close();
            });
        } else {
            // Invalid arguments
            console.log('Usage: node mongo.js <password> [<name> <number>]');
            mongoose.connection.close();
        }
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1);
    });
