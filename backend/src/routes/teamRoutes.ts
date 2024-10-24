import { Router } from 'express';
import { createTeam, joinTeam, getAllTeams} from '../controllers/TeamController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Route to create a team (requires authentication)
router.post('/', authMiddleware, createTeam);

// Route to join a team (requires authentication)
router.post('/join', authMiddleware, joinTeam);

router.get('/',authMiddleware, getAllTeams);

export default router;