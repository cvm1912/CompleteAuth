import router from 'express';
import { registerUser, verifyOTP, loginUser } from '../controllers/user.controller';
const userRouter = router();
userRouter.post('/register', registerUser);
userRouter.post('/verify-otp', verifyOTP);
userRouter.post('/login', loginUser);

export default userRouter;
