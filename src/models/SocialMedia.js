const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const SocialMedia = sequelize.define('SocialMedia', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    platform: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        isUrl: true
      }
    },
    enabled: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    contactInfoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'ContactInfos',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    }
  }, {
    tableName: 'SocialMedia',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['contactInfoId', 'platform'],
        name: 'unique_social_platform_per_contact'
      }
    ]
  });

  SocialMedia.associate = function(models) {
    // Define relationship with ContactInfo
    SocialMedia.belongsTo(models.ContactInfo, {
      foreignKey: 'contactInfoId',
      as: 'contactInfo'
    });
  };

  return SocialMedia;
}; 