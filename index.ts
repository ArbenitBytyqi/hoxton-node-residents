import express, { response } from 'express'
import cors from 'cors'
import { houses, residents } from './data'

const app = express()
app.use(cors())
app.use(express.json())
const port = 5500

app.get('/', (req, res) => {
    res.send(`
    <h1>Hello King, this is a housing app.</h1>
    <h2>Available pages:</h2>
    <ul>
        <li><a href="/houses">Houses</a></li>
        <li><a href="/residents">Residents</a></li>
    </ul>
    `)
})

//Houses

app.get('/houses', (req, res) => {
    let housesToSend = houses.map(house => {
        let resident = residents.find(resident => resident.id === house.residentId)
        return{...house, resident}
    })
    res.send(housesToSend)
})

app.get('/houses/:id', (req, res) => {
    const id = Number(req.params.id)
    const match = houses.find(item => item.id === id)

    if(match){
        res.send(match)
    }else{
        res.status(404).send({error: 'Sorry this item does not exist 😢'})
    }
})

app.post('/houses', (req, res) => {
    let errors: string[] = []

    if (typeof req.body.address !== 'string'){
        errors.push('Address of house not given! 🤨')
    }

    if (typeof req.body.type !== 'string'){
        errors.push('Type of house not given! 🤨')
    }

    if (typeof req.body.residentId !== 'number'){
        errors.push('Resident not given! 🤨')
    }

    let resident = residents.find(resident => resident.id === req.body.residentId)
    if (!resident){
        errors.push('Resident does not exist! 😒')
    }

    if (errors.length === 0){
        const newHouse = {
            id: houses.length === 0 ? 1 : houses[houses.length - 1].id + 1, 
            address: req.body.address,
            type: req.body.type,
            residentId: req.body.residentId
        }
        houses.push(newHouse)
        res.send(newHouse)
    } else{
        res.status(400).send({errors})
    }
})

//Residents

app.get('/residents', (req, res) => {
    let residentToSend = residents.map(resident => {
        const housesWithResidents = houses.filter(house => house.residentId === resident.id)
        return {...resident, houses: housesWithResidents}
    })
    res.send(residentToSend)
})

app.get('/residents/:id', (req, res) => {
    const id = Number(req.params.id)
    const match = residents.find(item => item.id === id)

    if(match){
        res.send(match)
    }else{
        res.status(404).send({error: 'Sorry this item does not exist 😢'})
    }
})

app.post('/residents', (req, res) => {
    let errors: string[] = []

    if (typeof req.body.name !== 'string'){
        errors.push('Name of resident not given! 🤨')
    }

    if (typeof req.body.age !== 'number'){
        errors.push('Type not given! 🤨')
    }

    if (typeof req.body.gender !== 'string'){
        errors.push('Residents gender not given! 🤨')
    }

    if (errors.length === 0){
        const newResident = {
            id: residents.length === 0 ? 1 : residents[residents.length - 1].id + 1, 
            name: req.body.name,
            age: req.body.age,
            gender: req.body.gender
        }
        residents.push(newResident)
        res.send(newResident)
    } else{
        res.status(400).send({errors})
    }
})

//General

app.listen(port, () => {
    console.log (`App running on port: ${port} `)
})