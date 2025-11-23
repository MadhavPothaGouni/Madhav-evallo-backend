module.exports = (sequelize, DataTypes) => {
  const EmployeeTeam = sequelize.define(
    'EmployeeTeam',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      employee_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      team_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      assigned_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    },
    {
      tableName: 'employee_teams',
      underscored: true,
      timestamps: false
    }
  );

  return EmployeeTeam;
};
