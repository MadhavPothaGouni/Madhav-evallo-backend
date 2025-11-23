const { Employee, Team, Log } = require('../db');

const listEmployees = async (req, res, next) => {
  try {
    const orgId = req.user.orgId;
    const employees = await Employee.findAll({
      where: { organisation_id: orgId },
      include: [{ model: Team, through: { attributes: [] } }]
    });
    res.json(employees);
  } catch (err) {
    next(err);
  }
};

const getEmployee = async (req, res, next) => {
  try {
    const orgId = req.user.orgId;
    const { id } = req.params;

    const employee = await Employee.findOne({
      where: { id, organisation_id: orgId },
      include: [{ model: Team, through: { attributes: [] } }]
    });

    if (!employee) return res.status(404).json({ message: 'Not found' });

    res.json(employee);
  } catch (err) {
    next(err);
  }
};

const createEmployee = async (req, res, next) => {
  try {
    const orgId = req.user.orgId;
    const userId = req.user.userId;
    const { first_name, last_name, email, phone } = req.body;

    const employee = await Employee.create({
      organisation_id: orgId,
      first_name,
      last_name,
      email,
      phone
    });

    await Log.create({
      organisation_id: orgId,
      user_id: userId,
      action: 'employee_created',
      meta: { employee_id: employee.id }
    });

    res.status(201).json(employee);
  } catch (err) {
    next(err);
  }
};

const updateEmployee = async (req, res, next) => {
  try {
    const orgId = req.user.orgId;
    const userId = req.user.userId;
    const { id } = req.params;
    const { first_name, last_name, email, phone } = req.body;

    const employee = await Employee.findOne({
      where: { id, organisation_id: orgId }
    });
    if (!employee) return res.status(404).json({ message: 'Not found' });

    employee.first_name = first_name ?? employee.first_name;
    employee.last_name = last_name ?? employee.last_name;
    employee.email = email ?? employee.email;
    employee.phone = phone ?? employee.phone;

    await employee.save();

    await Log.create({
      organisation_id: orgId,
      user_id: userId,
      action: 'employee_updated',
      meta: { employee_id: employee.id }
    });

    res.json(employee);
  } catch (err) {
    next(err);
  }
};

const deleteEmployee = async (req, res, next) => {
  try {
    const orgId = req.user.orgId;
    const userId = req.user.userId;
    const { id } = req.params;

    const employee = await Employee.findOne({
      where: { id, organisation_id: orgId }
    });
    if (!employee) return res.status(404).json({ message: 'Not found' });

    await employee.destroy();

    await Log.create({
      organisation_id: orgId,
      user_id: userId,
      action: 'employee_deleted',
      meta: { employee_id: id }
    });

    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  listEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee
};
