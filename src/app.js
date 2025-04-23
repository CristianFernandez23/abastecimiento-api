import express from 'express';
import session from 'express-session';
import cors from 'cors';
import MongoSingleton from './config/mongoDB.config.js';
import { addLogger, appLogger } from './config/loggers.config.js';
import { __dirname } from './path.js';
// import indexRouter from './routes/index.routes.js';
import dotenv from 'dotenv';
import MongoStore from "connect-mongo";

const app = express();

dotenv.config()

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/public'));

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: "mongodb+srv://cfernandezprogramacion:HWPuBZz7MVQKIJfw@cluster0.vtt2jfp.mongodb.net/Abastecimiento"
    }),
    secret: "abastecimiento*GB2-crbws",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 1000 * 60 * 60,
    },
  })
);

app.use(addLogger);
console.log(process.env.DBURL);

// app.use(indexRouter);

async function connectMongo() {
  appLogger.info('Conectando a MongoDB...');
  try {
    await MongoSingleton.getInstance()
  } catch (error) {
    appLogger.error('Error en la conexion con MongoDB: ', error);
    process.exit(1);
  }
}

let PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    appLogger.http(`Servidor iniciado en PUERTO: ${PORT}`);
    connectMongo()
});