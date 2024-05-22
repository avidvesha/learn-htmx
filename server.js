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

//Start the server
app.listen(3000, () => {
  console.log("Server is listening on port 3000");
})