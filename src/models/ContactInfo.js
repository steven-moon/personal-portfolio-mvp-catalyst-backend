const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ContactInfo = sequelize.define('ContactInfo', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    }
  }, {
    tableName: 'ContactInfos',
    timestamps: true
  });

  ContactInfo.associate = function(models) {
    // Define relationship with SocialMedia
    ContactInfo.hasMany(models.SocialMedia, {
      foreignKey: 'contactInfoId',
      as: 'socialMedia',
      onDelete: 'CASCADE'
    });
  };

  return ContactInfo;
}; 