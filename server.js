const express = require('express')
const hbs = require('express-handlebars')
const fs = require('fs')

const server = express()

// Server configuration
server.use(express.static('public'))
server.use(express.urlencoded({ extended: false }))

// Handlebars configuration
server.engine('hbs', hbs({ extname: 'hbs' }))
server.set('view engine', 'hbs')

// Your routes/router(s) should go here

server.get('/', (req, res) => {
    fs.readFile(__dirname + '/data.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err)
            return
        }
        const viewData = JSON.parse(data)
        viewData.fishers.sort((a,b) => b.caught - a.caught)
        viewData.fishers.forEach((fisher, i) =>{
            fisher.position = i+1
            if(fisher.position === 1){
                fisher.position = "First"
            } else if(fisher.position === 2){
                fisher.position = "Second"
            } else if(fisher.position === 3){
                fisher.position = "Third"
            }

        })
        res.render('home', viewData)
    })
})

server.post('/', (req, res) => {
    fs.readFile(__dirname + '/data.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err)
            return
        }
        const viewData = JSON.parse(data) //convert json file to object
        const newEntry = {
            "id": (viewData.fishers.length) + 1,
            "image": "/fisherimage/fisher6.jpeg",
            "firstName": req.body.fname,
            "lastName": req.body.lname,
            "location": req.body.location,
            "species": req.body.species,
            "caught": req.body.caught
        }
        //add newEntry to data.json object/viewData
         viewData.fishers.push(newEntry)

        const updatedDetails = JSON.stringify(viewData, null, 2) //convert object back to json file

        //replace data.json with new data added to it === updatedDetails
        fs.writeFile('data.json', updatedDetails, function (err) {

            if (err) throw err;
            viewData.fishers.sort((a,b) => b.caught - a.caught)
            viewData.fishers.forEach((fisher, i) =>{
                fisher.position = i+1 
                if(fisher.position === 1){
                    fisher.position = "First"
                } else if(fisher.position === 2){
                    fisher.position = "Second"
                } else if(fisher.position === 3){
                    fisher.position = "Third"
                }
            });
            res.render('home', viewData)
        })
    })
})



module.exports = server