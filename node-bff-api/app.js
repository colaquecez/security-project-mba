const https = require('https');
const fs = require('fs')

const privateKey  = fs.readFileSync('./sslcert/selfsigned.key', 'utf8');
const certificate = fs.readFileSync('./sslcert/selfsigned.crt', 'utf8');

const credentials = {key: privateKey, cert: certificate};

const express = require('express')
var cors = require('cors')
const app = express()
const port = 3000

const db = require("./db");

var cookieParser = require('cookie-parser'); 
const bodyParser = require('body-parser');

const { auth, requiredScopes } = require('express-oauth2-jwt-bearer');
const checkScopes = requiredScopes('openid');


app.use(cors());

app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.json());
app.use(cookieParser()); 

var request = require('request');

var host = process.env.DOCKER_HOST_IP || 'http://localhost'

const { auth } = require('express-oauth2-jwt-bearer');

const checkJwt = auth({
   audience: 'http://localhost:4200',
   issuerBaseURL: `https://dev-kwzy6a4g.us.auth0.com`,
});

app.use(function(req, res, next) {
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
   res.setHeader('Access-Control-Allow-Headers', 'Content-Type, authorization');
   res.setHeader('Access-Control-Allow-Credentials', true);
   next();
});

app.get('/products',checkJwt, checkScopes, async (req, res, next) => { 
    request(`${host}:3001/products`, function(err, body){
        return res.json(JSON.parse(body.body));
    });
});

app.post('/buy', async (req, res, next) => { 
    request({
        url: `${host}:3002/orders`,
        headers: {'content-type' : 'application/json'},
        method: 'POST',
        body: JSON.stringify(req.body)
    }, function(error, response, body){
        if(error) {
            console.log(error);
        } else {
            console.log(response.statusCode, body);
            var resp = JSON.parse(body);
            resp.status = response.statusCode;
            return res.json(resp);
        }
    });
});

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
});

