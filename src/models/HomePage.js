const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const HomePage = sequelize.define('HomePage', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    subtitle: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    profession: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    profileImage: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'HomePages',
    timestamps: true
  });

  HomePage.associate = function(models) {
    // Define relationship with Services
    HomePage.hasMany(models.Service, {
      foreignKey: 'homePageId',
      as: 'services',
      onDelete: 'CASCADE'
    });
  };

  // Static method to get home page with services
  HomePage.getWithServices = async function() {
    try {
      console.log('HomePage.getWithServices: Fetching home page with services');
      const homePageData = await HomePage.findOne({
        include: [
          {
            association: 'services',
            attributes: ['id', 'title', 'description']
          }
        ]
      });
      
      // If no home page found, return null
      if (!homePageData) {
        console.log('HomePage.getWithServices: No home page found');
        return null;
      }
      
      // Format the response to match the frontend expected structure
      const formatted = homePageData.toJSON();
      console.log('HomePage.getWithServices: Raw home page data:', JSON.stringify(formatted));
      
      // Verify if services are included
      if (!formatted.services) {
        console.log('HomePage.getWithServices: No services found in the response');
        formatted.services = [];
      } else {
        console.log(`HomePage.getWithServices: Found ${formatted.services.length} services`);
      }
      
      // Structure the response to match the frontend expected format
      return {
        hero: {
          id: formatted.id,
          title: formatted.title,
          subtitle: formatted.subtitle,
          profession: formatted.profession,
          profileImage: formatted.profileImage,
          services: formatted.services.map(service => ({
            id: service.id.toString(), // Convert to string to match frontend expectations
            title: service.title,
            description: service.description
          }))
        }
      };
    } catch (error) {
      console.error('HomePage.getWithServices error:', error);
      throw error;
    }
  };

  // Static method to create or update home page
  HomePage.createOrUpdate = async function(homeData) {
    const [homePage, created] = await HomePage.findOrCreate({
      where: { id: homeData.id || 1 },
      defaults: {
        title: homeData.title,
        subtitle: homeData.subtitle,
        profession: homeData.profession,
        profileImage: homeData.profileImage
      }
    });

    if (!created) {
      await homePage.update({
        title: homeData.title,
        subtitle: homeData.subtitle,
        profession: homeData.profession,
        profileImage: homeData.profileImage
      });
    }

    return homePage;
  };

  return HomePage;
}; 