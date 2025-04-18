import express from "express";
import connectToDb from "./utils/connectToDb.js";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import userRoutes from "./routers/user.router.js";
import passwordRoutes from "./routers/password.router.js";
import emailRoutes from "./routers/email.router.js";
import collectionRouter from './routers/collection.router.js';
import noteRouter from './routers/note.router.js';
import rootRouter from './routers/root.router.js';
import contributionRouter from './routers/contribution.router.js'

config();
const app = express();

app.use(express.json({limit: '10mb'}));
app.use(cookieParser());
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175' ],
    credentials: true,
}))

app.get('/', (req, res)=>{
    res.status(200).json({message: "hello from the server."});
})

//ROUTES
app.use('/api/user', userRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/password', passwordRoutes);
app.use('/api/collection', collectionRouter);
app.use('/api/note', noteRouter);
app.use('/api', rootRouter);
app.use('/api/contribution', contributionRouter);

const PORT = process.env.PORT;
app.listen(PORT, ()=>{
    console.log(`running on http://localhost:${PORT}`);
    connectToDb();
})
