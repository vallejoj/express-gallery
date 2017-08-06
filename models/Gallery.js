module.exports = function(sequelize, DataTypes) {
  var Gallery = sequelize.define("Gallery", {

    link: DataTypes.STRING,
      author: DataTypes.STRING,
    description: DataTypes.STRING

  }, {
    classMethods: {
      associate: function(models) {
      }
    }
  });

  return Gallery;
};
