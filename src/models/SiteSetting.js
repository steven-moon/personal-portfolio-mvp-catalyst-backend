const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const SiteSetting = sequelize.define('SiteSetting', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    // General settings
    siteName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    authorName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    siteIcon: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ''
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    showEmailInFooter: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    // Appearance settings
    theme: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'light'
    },
    primaryColor: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: '#ffffff'
    },
    enableAnimations: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    fontFamily: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'inter'
    },
    // SEO settings
    metaDescription: {
      type: DataTypes.STRING,
      allowNull: true
    },
    keywords: {
      type: DataTypes.STRING,
      allowNull: true
    },
    enableSocialMetaTags: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    googleAnalyticsId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    // Feature toggles
    enableBlog: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    enableProjects: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    enableContactForm: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    enableNewsletter: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    enableMvpBanner: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    // Social media integration toggles
    enableGithub: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    enableLinkedin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    enableTwitter: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    enableInstagram: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    enableYoutube: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    enableFacebook: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    // Social media URLs
    githubUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    linkedinUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    twitterUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    instagramUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    youtubeUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    facebookUrl: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'SiteSettings',
    timestamps: true
  });

  return SiteSetting;
}; 