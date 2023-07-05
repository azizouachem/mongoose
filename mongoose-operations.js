const mongoose = require('mongoose');
require('dotenv').config();

// Connect to the database
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// Create a person schema
const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  favoriteFoods: [String]
});

// Create a person model
const Person = mongoose.model('Person', personSchema);

// Create and save a record
const createAndSavePerson = (done) => {
  const person = new Person({
    name: 'John Doe',
    age: 30,
    favoriteFoods: ['Pizza', 'Burger']
  });

  person.save(function(err, data) {
    if (err) return console.error(err);
    done(null, data);
  });
};

// Create many records
const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, function(err, data) {
    if (err) return console.error(err);
    done(null, data);
  });
};

// Find all people with a given name
const findPeopleByName = (personName, done) => {
  Person.find({ name: personName }, function(err, data) {
    if (err) return console.error(err);
    done(null, data);
  });
};

// Find one person with a certain food in their favorites
const findOnePerson = (food, done) => {
  Person.findOne({ favoriteFoods: food }, function(err, data) {
    if (err) return console.error(err);
    done(null, data);
  });
};

// Find a person by _id
const findPersonById = (personId, done) => {
  Person.findById(personId, function(err, data) {
    if (err) return console.error(err);
    done(null, data);
  });
};

// Perform classic updates
const findEditThenSave = (personId, done) => {
  Person.findById(personId, function(err, person) {
    if (err) return console.error(err);

    person.favoriteFoods.push('Hamburger');
    person.save(function(err, data) {
      if (err) return console.error(err);
      done(null, data);
    });
  });
};

// Perform new updates using findOneAndUpdate()
const findAndUpdate = (personName, done) => {
  Person.findOneAndUpdate({ name: personName }, { age: 20 }, { new: true }, function(err, data) {
    if (err) return console.error(err);
    done(null, data);
  });
};

// Delete one document by _id
const findAndRemove = (personId, done) => {
  Person.findByIdAndRemove(personId, function(err, data) {
    if (err) return console.error(err);
    done(null, data);
  });
};

// Delete many documents
const removeManyPeople = (done) => {
  Person.remove({ name: 'Mary' }, function(err, data) {
    if (err) return console.error(err);
    done(null, data);
  });
};

// Chain search query helpers
const queryChain = (done) => {
  Person.find({ favoriteFoods: 'Burritos' })
    .sort({ name: 1 })
    .limit(2)
    .select({ age: 0 })
    .exec(function(err, data) {
      if (err) return console.error(err);
      done(null, data);
    });
};

// Example usage
createAndSavePerson(function(err, data) {
  if (err) return console.error(err);
  console.log('Created and saved person:', data);

  const arrayOfPeople = [
    { name: 'Alice', age: 25, favoriteFoods: ['Sushi'] },
    { name: 'Bob', age: 35, favoriteFoods: ['Steak', 'Pasta'] }
  ];

  createManyPeople(arrayOfPeople, function(err, data) {
    if (err) return console.error(err);
    console.log('Created many people:', data);

    findPeopleByName('Alice', function(err, data) {
      if (err) return console.error(err);
      console.log('People with name "Alice":', data);

      findOnePerson('Pizza', function(err, data) {
        if (err) return console.error(err);
        console.log('Person who likes "Pizza":', data);

        findPersonById(data._id, function(err, data) {
          if (err) return console.error(err);
          console.log('Person with ID:', data);

          findEditThenSave(data._id, function(err, data) {
            if (err) return console.error(err);
            console.log('Updated person:', data);

            findAndUpdate('Bob', function(err, data) {
              if (err) return console.error(err);
              console.log('Updated person:', data);

              findAndRemove(data._id, function(err, data) {
                if (err) return console.error(err);
                console.log('Removed person:', data);

                removeManyPeople(function(err, data) {
                  if (err) return console.error(err);
                  console.log('Removed many people:', data);

                  queryChain(function(err, data) {
                    if (err) return console.error(err);
                    console.log('Query chain result:', data);
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});
