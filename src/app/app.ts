import express, { Response, Application } from 'express';
import cors from 'cors';
import { errorResponse } from '../utils/helpers';
import { StudentRoutes } from '../modules/user.route';

export const app: Application = express();

// parsers
app.use(express.json());
app.use(cors());

// router
app.use('/api/users', StudentRoutes);

app.get('/', (_, response: Response) => {
  response.send('Server is running');
});

// error handling
app.all('*', (_, res: Response) => {
  res.status(404).json(errorResponse('Route not found', 404));
});
