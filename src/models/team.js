module.exports = (sequelize, DataTypes) => {
  const Team = sequelize.define(
    'Team',
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
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.TEXT
      }
    },
    {
      tableName: 'teams',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false
    }
  );

  return Team;
};
