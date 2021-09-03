const {Sequelize, Model, DataTypes} = require('sequelize')
const path = require('path')

const connectionSettings = {
    test: {dialect: 'sqlite', storage: ':memory:'},
    dev: {dialect: 'sqlite', storage: path.join(__dirname, 'data.db')},
    production: {dialect: 'postgres', ssl: true, dialectOptions: {ssl: true}}
}

const sequelize = process.env.NODE_ENV === 'production'
    ? new Sequelize(process.env.DATABASE_URL, connectionSettings[process.env.NODE_ENV])
    : new Sequelize(connectionSettings[process.env.NODE_ENV])

class User extends Model {}
class Board extends Model {}
class Task extends Model {}
User.init({
    name: DataTypes.STRING,
    avatar: DataTypes.STRING
}, {sequelize})
Board.init({
    title: DataTypes.STRING
}, {sequelize})
Task.init({
    desc: DataTypes.STRING,
    status: DataTypes.NUMBER
}, {sequelize})
Board.hasMany(Task, {as: 'tasks'})
Task.belongsTo(Board)

module.exports = {
    Board,
    User,
    Task,
    sequelize
}