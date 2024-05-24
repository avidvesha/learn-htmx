import express from 'express';

const app = express();

//Set static folder
app.use(express.static('public'));
//Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: true}));
//Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Hancel GET Request to Fetch Users
app.get('/users', async(req, res) => {
  // const users = [
  //   { id: 1, name: 'Avid' },
  //   { id: 2, name: 'Vesha' },
  //   { id: 3, name: 'Daiva' },
  //   { id: 4, name: 'Dianta' }
  // ];

  setTimeout(async () => { 
    
    const limit = +req.query.limit || 10;

    const response = await fetch(`http://jsonplaceholder.typicode.com/users?_limit=${limit}`);
    const users = await response.json();
    
    // foreach user show it as a list
    res.send(`
    <h1 class="text-2xl font-bold my-4">Users</h1>
    <ul>
    ${users.map((user) => `<li>${user.name}</li>`).join('')}
    </ul>
    `); 
  }, 2000);
});

// Handle POST req for temp converter
app.post('/convert', (req, res) => {
  setTimeout(() => {
    const fahrenheit = parseFloat(req.body.fahrenheit);
    const celcius = (fahrenheit - 32) * 5 / 9;

    res.send(`
      <p>
        ${fahrenheit} degrees Fahrenheit is equal to ${celcius} degrees Celcius
      </p>
    `)
  })
})

let counter = 0;
// Handle GET req for polling
app.get('/poll', (req, res) => {
  counter++;
  const data = { value: counter };
  res.json(data);
});

let currentTemp = 20;
// Handle GET req for weather
app.get('/get-temp', (req, res) => {
  currentTemp += Math.random() * 2 - 1;
  res.send(currentTemp.toFixed(1) + 'C');
})

const contacts = [
  { name: 'Avid', email: 'avid@gmail.com' },
  { name: 'Vesha', email: 'vesha@gmail.com' },
  { name: 'Daiva', email: 'daiva@gmail.com' },
  { name: 'Dianta', email: 'dianta@gmail.com' }
];

// Handle POST req for Contact Search
app.post('/search', (req, res) => {

  const searchTerm = req.body.search.toLowerCase();

  if (!searchTerm) {
    return res.send('<tr></tr>');
  }

  const searchResults = contacts.filter((contact) => {
    const name = contact.name.toLowerCase();
    const email = contact.email.toLowerCase();

    return name.includes(searchTerm) || email.includes(searchTerm);
  });

  setTimeout(() => {
    const searchResultsHtml = searchResults.map((contact) => `
    <tr>
      <td>
        <div class="my-4 p-2"> ${contact.name} </div>
      </td>
      <td>
        <div class="my-4 p-2"> ${contact.email} </div>
      </td>
    </tr>
    `).join('');

    res.send(searchResultsHtml);

  }, 1000);

});

//Start the server
app.listen(3000, () => {
  console.log("Server is listening on port 3000");
})