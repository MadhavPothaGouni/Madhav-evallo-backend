// src/db.js
const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

// Prefer DATABASE_URL (Render / cloud) and fall back to local DB_* variables
let sequelize;

if (process.env.DATABASE_URL) {
  // Used in Render (or any environment that gives a full connection string)
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Render's managed Postgres usually needs this
      },
    },
  });
} else {
  // Used locally (your laptop)
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      dialect: 'postgres',
      logging: false,
    }
  );
}

// Import model factories
const OrganisationModel = require('./models/organisation');
const UserModel = require('./models/user');
const EmployeeModel = require('./models/employee');
const TeamModel = require('./models/team');
const EmployeeTeamModel = require('./models/employeeTeam');
const LogModel = require('./models/log');

// Initialize models
const Organisation = OrganisationModel(sequelize, DataTypes);
const User = UserModel(sequelize, DataTypes);
const Employee = EmployeeModel(sequelize, DataTypes);
const Team = TeamModel(sequelize, DataTypes);
const EmployeeTeam = EmployeeTeamModel(sequelize, DataTypes);
const Log = LogModel(sequelize, DataTypes);

// Associations
Organisation.hasMany(User, { foreignKey: 'organisation_id' });
User.belongsTo(Organisation, { foreignKey: 'organisation_id' });

Organisation.hasMany(Employee, { foreignKey: 'organisation_id' });
Employee.belongsTo(Organisation, { foreignKey: 'organisation_id' });

Organisation.hasMany(Team, { foreignKey: 'organisation_id' });
Team.belongsTo(Organisation, { foreignKey: 'organisation_id' });

Employee.belongsToMany(Team, {
  through: EmployeeTeam,
  foreignKey: 'employee_id',
});
Team.belongsToMany(Employee, {
  through: EmployeeTeam,
  foreignKey: 'team_id',
});

Organisation.hasMany(Log, { foreignKey: 'organisation_id' });
User.hasMany(Log, { foreignKey: 'user_id' });
Log.belongsTo(Organisation, { foreignKey: 'organisation_id' });
Log.belongsTo(User, { foreignKey: 'user_id' });

const db = {
  sequelize,
  Sequelize,
  Organisation,
  User,
  Employee,
  Team,
  EmployeeTeam,
  Log,
};

module.exports = db;
