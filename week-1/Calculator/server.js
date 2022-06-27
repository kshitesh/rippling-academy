const express=require('express');
const path=require('path');
const app=express();
app.use(express.static(path.join(__dirname,'/')))
app.get('/',function(req,res){
    res.sendFile(path.join(__dirname,'proj.html'));
})
app.listen(3000);
console.log('listening on http://localhost:3000');