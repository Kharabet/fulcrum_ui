import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import api from './api';
import config from './config.json';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';


let app = express();
app.server = http.createServer(app);

// logger
app.use(morgan('dev'));

// 3rd party middleware
app.use(cors({
    exposedHeaders: config.corsHeaders
}));

app.use(bodyParser.json({
    limit: config.bodyLimit
}));


// api router
app.use('/api', api({ config }));

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.server.listen({
    port: process.env.PORT || config.port,
    host: '0.0.0.0'
}, () => {
    console.log(`Started on port ${app.server.address().port}`);
});

export default app;
