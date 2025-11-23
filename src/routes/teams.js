const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const {
  listTeams,
  createTeam,
  updateTeam,
  deleteTeam,
  assignEmployee,
  unassignEmployee,
} = require('../controllers/teamController');

router.use(authMiddleware);

// CRUD
router.get('/', listTeams);
router.post('/', createTeam);
router.put('/:id', updateTeam);
router.delete('/:id', deleteTeam);

// employee ↔ team assignment
router.post('/:teamId/assign', assignEmployee);
router.post('/:teamId/unassign', unassignEmployee);

module.exports = router;
