import router from 'express';
import { registerUser, verifyOTP } from '../controllers/user.controller';
const userRouter = router();
userRouter.post('/register', registerUser);
userRouter.post('/verify-otp', verifyOTP);
export default userRouter;
