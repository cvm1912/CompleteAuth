import router from 'express';
import { registerUser } from '../controllers/user.controller';
const userRouter = router();
userRouter.post('/register', registerUser);
export default userRouter;
