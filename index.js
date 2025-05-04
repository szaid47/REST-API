const express = require('express');
const users = require('./MOCK_DATA.json')
const fs = require("fs")

const app = express();
const PORT = 8000;

app.use(express.urlencoded({extended: false}))

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
    res.json(users);
})

app.route("/api/users/:id").get((req,res)=>{
    const id  = Number(req.params.id);
    const user = users.find((user)=>user.id === id);
    if (user == null){
        return res.json({status : "user doesnt exist"})
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
    users.push({...body ,id: users.length+1})
    fs.writeFile("./MOCK_DATA.json",JSON.stringify(users),(err,data)=>{
         return res.json({status:"user added", id : users.length},)
    });

    
})

app.listen(PORT, ()=> console.log(`server is running on port ${PORT}`));
