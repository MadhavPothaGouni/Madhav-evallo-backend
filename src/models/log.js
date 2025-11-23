module.exports = (sequelize, DataTypes) => {
  const Log = sequelize.define(
    'Log',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      organisation_id: {
        type: DataTypes.INTEGER
      },
      user_id: {
        type: DataTypes.INTEGER
      },
      action: {
        type: DataTypes.STRING,
        allowNull: false
      },
      meta: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    },
    {
      tableName: 'logs',
      underscored: true,
      timestamps: false
    }
  );

  return Log;
};
