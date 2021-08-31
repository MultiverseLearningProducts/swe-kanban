const { expect } = require("chai")

describe('Adding Users', () => {
    it('has a modal opened by an add task button', () => {
        cy.visit(`http://0.0.0.0:3001`)
        cy.get('#modal').should('not.be.visible')
        cy.get('.user-list button').click()
        cy.get('#modal').contains('Add User')
    })
})