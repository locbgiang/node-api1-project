const express = require('express');
const shortid = require('shortid');

const server = express();

server.use(express.json());

let users = [
]

server.post(`/api/users`, function(req,res){
    const userInformation = {id:shortid.generate(), ...req.body};
    if(userInformation.name == undefined || userInformation.bio == undefined){
        res.status(400).json({errorMessage: "Please provide name and bio for the user."})
    }else if(userInformation.name != undefined && userInformation.bio != undefined){
        users.push(userInformation);
        res.status(200).json(userInformation);
    }else{
        res.status(500).json({errorMessage:"There was an error while saving the user to the database"});
    }
})

server.get(`/api/users`, function(req,res){
    if(users == undefined){
        res.status(500).json({errorMessage: "The users information could not be retrieved"})
    }else{
        res.json(users);
    }
})

server.get(`/api/users/:id`, function(req,res){
    const id = req.params.id;
    for(let i=0; i<users.length;i++){
        console.log('i is', i);
        console.log('user length is', users.length);

        if(i==users.length-1 && users[i].id != id){
            res.status(404).json({errorMessage:"The user with the specific ID does not exist."})
        }else if(users[i].id == id){
            res.json(users[i]);
        }
    }
    res.status(500).json({errorMessage:"The user information could not be retrieved."})
})

server.delete(`/api/users/:id`, function(req,res){
    const id = req.params.id;
    for (let i=0; i<users.length; i++){
        if(i==users.length-1 && users[i].id != id){
            res.status(404).json({errorMessage:"The user with the specified ID does not exist."})
        }else if(users[i].id == id){
            users = users.filter(user=> user.id!=id);
            res.status(200).json(users);
        }
    }
    res.status(500).json({errorMessage:"The user could not be removed"})
})

server.put(`/api/users/:id`, function(req,res){
    const id = req.params.id;
    for ( let i =0 ; i<users.length; i++){
        if(i==users.length-1 && users[i].id != id){
            res.status(404).json({errorMessage:"The user with the specified ID does not exist."})
        }else if(users[i].id == id){
            if(req.body.name == undefined || req.body.bio == undefined){
                res.status(400).json({errorMessage: "Please provide name and bio for the user."})
            }else if(req.body.name != undefined && req.body.bio != undefined){
                users[i] = {id: req.params.id, ...req.body};
                res.status(200).json(users[i]);
            }else{
                res.status(500).json({errorMessage:"The user information could not be modified."});
            }
        }
    }
})

server.get('/', (req , res) =>{
    res.json({ api: ' Up and running!' });
});

server.listen(9000, () => console.log('\nProject API is working\n'));