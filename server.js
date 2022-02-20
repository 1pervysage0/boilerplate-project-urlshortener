require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns=require("dns");
const url=require('url');
const bodyParser=require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const short_url=Math.floor((Math.random()*50)+1);
var inc_url="";
app.post("/api/shorturl",(req,res)=>{
   inc_url=req.body.url;
  var furl=url.parse(inc_url);
  console.log( url.parse(inc_url));
   console.log(furl.hostname);
  dns.lookup(furl.hostname,(err,add,fam)=>{ //dns check
    if(err){
      return res.json({error:"invalid url"});
    }
    else if(furl.protocol==null||furl.host==null){  //if host and protocol not defined
     return res.json({
        error:"invalid url",
      });
    }
    else{
     return res.json({
        original_url:inc_url,
        short_url:short_url
      })
    }
  })
});

app.get(`/api/shorturl/${short_url}`,(req,res)=>{
  console.log(`/api/shorturl/${short_url}`);
  res.redirect(inc_url);
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
