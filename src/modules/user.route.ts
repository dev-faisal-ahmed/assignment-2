import express from 'express';
import { UserController } from './user.controller';

const router = express.Router();

router.post('/', UserController.createUser);
router.get('/', UserController.getAllUser);
router.get('/:userId', UserController.getSpecificUser);
router.put('/:userId', UserController.updateUser);

export const StudentRoutes = router;
