const { Team, Employee, EmployeeTeam, Log } = require('../db');

const listTeams = async (req, res, next) => {
  try {
    const orgId = req.user.orgId;
    const teams = await Team.findAll({
      where: { organisation_id: orgId },
      include: [{ model: Employee, through: { attributes: [] } }],
    });
    res.json(teams);
  } catch (err) {
    next(err);
  }
};

const createTeam = async (req, res, next) => {
  try {
    const orgId = req.user.orgId;
    const userId = req.user.userId;
    const { name, description } = req.body;

    const team = await Team.create({
      organisation_id: orgId,
      name,
      description,
    });

    await Log.create({
      organisation_id: orgId,
      user_id: userId,
      action: 'team_created',
      meta: { team_id: team.id },
    });

    res.status(201).json(team);
  } catch (err) {
    next(err);
  }
};

const updateTeam = async (req, res, next) => {
  try {
    const orgId = req.user.orgId;
    const userId = req.user.userId;
    const { id } = req.params;
    const { name, description } = req.body;

    const team = await Team.findOne({
      where: { id, organisation_id: orgId },
    });
    if (!team) return res.status(404).json({ message: 'Team not found' });

    team.name = name ?? team.name;
    team.description = description ?? team.description;
    await team.save();

    await Log.create({
      organisation_id: orgId,
      user_id: userId,
      action: 'team_updated',
      meta: { team_id: team.id },
    });

    res.json(team);
  } catch (err) {
    next(err);
  }
};

const deleteTeam = async (req, res, next) => {
  try {
    const orgId = req.user.orgId;
    const userId = req.user.userId;
    const { id } = req.params;

    const team = await Team.findOne({
      where: { id, organisation_id: orgId },
    });
    if (!team) return res.status(404).json({ message: 'Team not found' });

    await team.destroy();

    await Log.create({
      organisation_id: orgId,
      user_id: userId,
      action: 'team_deleted',
      meta: { team_id: id },
    });

    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};

const assignEmployee = async (req, res, next) => {
  try {
    const orgId = req.user.orgId;
    const userId = req.user.userId;
    const { teamId } = req.params;
    const { employeeId } = req.body;

    const teamIdNum = parseInt(teamId, 10);
    const employeeIdNum = parseInt(employeeId, 10);

    if (!Number.isInteger(teamIdNum) || !Number.isInteger(employeeIdNum)) {
      return res.status(400).json({ message: 'Invalid team or employee id' });
    }

    const team = await Team.findOne({
      where: { id: teamIdNum, organisation_id: orgId },
    });
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    const employee = await Employee.findOne({
      where: { id: employeeIdNum, organisation_id: orgId },
    });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    await EmployeeTeam.findOrCreate({
      where: { employee_id: employee.id, team_id: team.id },
    });

    await Log.create({
      organisation_id: orgId,
      user_id: userId,
      action: 'assigned_employee_to_team',
      meta: { employee_id: employee.id, team_id: team.id },
    });

    res.json({ message: 'Assigned' });
  } catch (err) {
    next(err);
  }
};

const unassignEmployee = async (req, res, next) => {
  try {
    const orgId = req.user.orgId;
    const userId = req.user.userId;
    const { teamId } = req.params;
    const { employeeId } = req.body;

    const teamIdNum = parseInt(teamId, 10);
    const employeeIdNum = parseInt(employeeId, 10);

    if (!Number.isInteger(teamIdNum) || !Number.isInteger(employeeIdNum)) {
      return res.status(400).json({ message: 'Invalid team or employee id' });
    }

    const team = await Team.findOne({
      where: { id: teamIdNum, organisation_id: orgId },
    });
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    const employee = await Employee.findOne({
      where: { id: employeeIdNum, organisation_id: orgId },
    });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    await EmployeeTeam.destroy({
      where: { employee_id: employee.id, team_id: team.id },
    });

    await Log.create({
      organisation_id: orgId,
      user_id: userId,
      action: 'unassigned_employee_from_team',
      meta: { employee_id: employee.id, team_id: team.id },
    });

    res.json({ message: 'Unassigned' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listTeams,
  createTeam,
  updateTeam,
  deleteTeam,
  assignEmployee,
  unassignEmployee,
};
