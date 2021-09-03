const { User, Board, Task, sequelize } = require('../src/models')

describe('Kanban', () => {
    beforeAll(async () => {
        await sequelize.sync()
    })
    test('Can create a board', async () => {
        const board = await Board.create({title: 'test project'})
        expect(board.title).toBe('test project')
    })
    test('can add a task to a board', async () => {
        const _board = await Board.create({title: 'test project'})
        await _board.createTask({desc: 'test task', status: 0})
        const result = await Board.findByPk(_board.id, {include: Task})
        expect(result.Tasks[0].desc).toBe('test task')
        expect(result.Tasks[0].status).toBe(0)
    })
    test('can assign users to tasks', async () => {
        const _board = await Board.create({title: 'test project 3'})
        const _user = await User.create({name: 'test user', avatar: '/url'})
        await Task.create({
            desc: 'first task',
            status: 0,
            BoardId: _board.id,
            UserId: _user.id
        })
        const result = await Board.findByPk(_board.id, {
            include: {
                model: Task,
                include: {
                    model: User
                }
            }
        })
        expect(result.Tasks[0].User.name).toBe('test user')
    })
})