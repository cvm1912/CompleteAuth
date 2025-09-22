import express, { application } from "express";
import userRouter from "./Routes/user.routes";

const app = express();
app.use(express.json());

app.use('/api/users', userRouter);

export default app;
