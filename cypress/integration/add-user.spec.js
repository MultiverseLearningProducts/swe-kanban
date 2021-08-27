const { expect } = require("chai")

describe('Adding Users', () => {
    it('has a modal opened by an add task button', () => {
        cy.visit(`http://kanban:3001`)
        cy.get('.user-list button').click()
        cy.get('#modal').contains('Add User')
    })
})