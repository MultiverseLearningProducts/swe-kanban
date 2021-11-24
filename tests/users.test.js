const { User, sequelize } = require('../src/models')

describe('Users', () => {
    beforeAll(async () => {
        await sequelize.sync()
    })
    test('Can create a user', async () => {
        const user = await User.create({name: 'test user', avatar: 'avatar_url'})
        expect(user.name).toBe('test user')
    })
})