const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const BlogPost = sequelize.define('BlogPost', {
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
    excerpt: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    content: {
      type: DataTypes.TEXT('long'),
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isUrlOrLocalhost(value) {
          // Regular expression for URL validation that also accepts localhost URLs
          const urlRegex = /^(https?:\/\/)?(localhost(:\d+)?|([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,})(\/\S*)?$/;
          
          // Also accept relative paths that start with /
          const isRelativePath = value.startsWith('/');
          
          if (!urlRegex.test(value) && !isRelativePath) {
            throw new Error('Must be a valid URL for the image');
          }
        }
      }
    },
    authorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Categories',
        key: 'id'
      }
    }
  }, {
    tableName: 'BlogPosts',
    timestamps: true
  });

  BlogPost.associate = function(models) {
    // Many-to-one relationship with User (as author)
    BlogPost.belongsTo(models.User, {
      foreignKey: 'authorId',
      as: 'author'
    });

    // Many-to-one relationship with Category
    BlogPost.belongsTo(models.Category, {
      foreignKey: 'categoryId',
      as: 'category'
    });
  };

  return BlogPost;
}; 