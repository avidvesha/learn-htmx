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

// Handle POST req for Contact Search frpm jsonapiplaceholder
app.post('/search/api', async(req, res) => {

  const searchTerm = req.body.search.toLowerCase();

  if (!searchTerm) {
    return res.send('<tr></tr>');
  }

  const response = await fetch(`http://jsonplaceholder.typicode.com/users`);
  const contacts = await response.json();

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

// Handle POST req for email validation
app.post('/contact/email', (req, res) => {
  const submittedEmail = req.body.email;
  const emailRegex = /^[A-Aa-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;

  const isValid = {
    message: 'That email is valid',
    class: 'text-green-700'
  };
  
  const isInvalid = {
    message: 'Please enter a valid email address',
    class: 'text-red-700'
  };

  if (!emailRegex.test(submittedEmail)) {
    return res.send(`
      <div class="mb-4" hx-target="this" hx-swap="outerHTML">
        <label for="email" class="block text-gray-700 text-sm font-bold mb-2"
          >Email Address</label
        >
        <input
          hx-post="/contact/email"
          type="email"
          name="email"
          id="email"
          value="${submittedEmail}"
          required
          class="border rounded-lg py-2 px-3 w-full focus:outline-none focus:border-gray-500"
        />
        <div class="${isInvalid.class}">
          ${isInvalid.message}
        </div>
      </div>
    `)
  } else {
    return res.send(`
      <div class="mb-4" hx-target="this" hx-swap="outerHTML">
        <label for="email" class="block text-gray-700 text-sm font-bold mb-2"
          >Email Address</label
        >
        <input
          hx-post="/contact/email"
          type="email"
          name="email"
          id="email"
          value="${submittedEmail}"
          required
          class="border rounded-lg py-2 px-3 w-full focus:outline-none focus:border-gray-500"
        />
        <div class="${isValid.class}">
          ${isValid.message}
        </div>
      </div>
    `)
  }
  
})

//Start the server
app.listen(3000, () => {
  console.log("Server is listening on port 3000");
})