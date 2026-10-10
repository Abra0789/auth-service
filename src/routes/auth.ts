import e from 'express';
import { AppDataSource } from '../data-source.js';
import { User } from '../entities/User.js';
import { UserService } from '../services/UserService.js';
import { AuthController } from './../controllers/AuthController.js';

const router = e.Router();
const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);
const authController = new AuthController(userService);

router.post('/register', (req, res) => authController.register(req, res));

export default router;
