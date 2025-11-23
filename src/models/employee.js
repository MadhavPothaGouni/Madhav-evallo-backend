module.exports = (sequelize, DataTypes) => {
  const Employee = sequelize.define(
    'Employee',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      organisation_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      first_name: {
        type: DataTypes.STRING
      },
      last_name: {
        type: DataTypes.STRING
      },
      email: {
        type: DataTypes.STRING
      },
      phone: {
        type: DataTypes.STRING
      }
    },
    {
      tableName: 'employees',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false
    }
  );

  return Employee;
};
