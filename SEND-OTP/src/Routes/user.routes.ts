import router from 'express';
import { registerUser, verifyOTP, loginUser, verifyMFA, forgotPassword, resetPassword, enableMFA} from '../controllers/user.controller';
const userRouter = router();
userRouter.post('/register', registerUser);
userRouter.post('/verify-otp', verifyOTP);
userRouter.post('/login', loginUser);
userRouter.post('/verify-mfa', verifyMFA);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password', resetPassword);
userRouter.post('/enable-mfa', enableMFA);

export default userRouter;
