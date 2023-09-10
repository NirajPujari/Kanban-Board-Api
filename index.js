const express = require("express");
const app = express()
const db = require('./db')
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => res.send('Hello World!' ))


// Get all users
app.get('/users', async (req, res) => {
    try {
      const users = await db.select().from('users')
      res.json(users)
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: 'Error retrieving users' })
    }
  })
  
  
app.post('/users', async (req, res) => {
  try {
    const user = await db('users').insert({ name: req.body.name }).returning('*')
    res.json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error creating user' })
  }
})

// Delete an existing user
app.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params
    const user = await db('users').where({ id }).delete().returning('*')
    res.json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Error deleting user' })
  }
})

app.listen(PORT, () => console.log(`Server up at PORT:${PORT}`))