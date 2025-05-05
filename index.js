const express = require('express');
const users = require('./MOCK_DATA.json')
const fs = require("fs")

const app = express();
const PORT = 8000;

app.use(express.urlencoded({extended: false}))

app.use((req,res,next)=>{
    fs.appendFile('log.txt', `${Date.now()} : ${req.method} : ${req.path}\n`, (err,data)=>{
        next();
    })
})

app.get("/users", (req,res)=>{
    const html =  `
    <ul>
    ${users.map((user)=>`<li>${user.first_name}</li>`).join("")}
    </ul>
    `;
    res.send(html)
})


//REST API 

app.get('/api/users', (req,res)=>{
    res.status(200).json(users);
})

app.route("/api/users/:id").get((req,res)=>{
    const id  = Number(req.params.id);
    const user = users.find((user)=>user.id === id);
    if (user == null){
        return res.status(404).json({status : "user doesnt exist"})
    }
    res.send(user);
})
.patch((req,res)=>{
    const id  = Number(req.params.id);
    const index = users.findIndex(user => user.id==id)
    if (index==-1){
        return res.json({status : "user doesnt exist"})
    }
    const body = req.body;
    users[index] = {...users[index],...body};
    fs.writeFile("./MOCK_DATA.json",JSON.stringify(users),(err,data)=>{
        res.json({status :"updated", id : id})
    })
})
.delete((req,res)=>{
    const id = Number(req.params.id);
    const index = users.findIndex(user => user.id == id);
    if (index ==-1){
        return res.json({ status : "user doesnt exist"})
    }
    users.splice(index,1);
    fs.writeFile("./MOCK_DATA.json",JSON.stringify(users),(err,data)=>{
        res.json({status :"deleted"})
    })

})



app.post("/api/users",(req,res)=>{
    
    
    const body = req.body;
    if(!body || !body.first_name || !body.last_name || !body.email || !body.gender || !body.job_title){
        return res.status(400).json({msg : "all fields are req ..."})
    }
    users.push({...body ,id: users.length+1})
    fs.writeFile("./MOCK_DATA.json",JSON.stringify(users),(err,data)=>{
         return res.json({status:"user added", id : users.length},)
    });

    
})

app.listen(PORT, ()=> console.log(`server is running on port ${PORT}`));
