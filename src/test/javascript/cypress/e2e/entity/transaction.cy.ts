import {
  entityConfirmDeleteButtonSelector,
  entityCreateButtonSelector,
  entityCreateCancelButtonSelector,
  entityCreateSaveButtonSelector,
  entityDeleteButtonSelector,
  entityDetailsBackButtonSelector,
  entityDetailsButtonSelector,
  entityEditButtonSelector,
  entityTableSelector,
} from '../../support/entity';

describe('Transaction e2e test', () => {
  const transactionPageUrl = '/transaction';
  const transactionPageUrlPattern = new RegExp('/transaction(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const transactionSample = {
    propertyId: 24687,
    transactionType: 'since',
    price: 9754.51,
    transactionDate: '2024-12-12T00:42:37.178Z',
    createdAt: '2024-12-11T07:56:23.072Z',
  };

  let transaction;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/services/propservice/api/transactions+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/services/propservice/api/transactions').as('postEntityRequest');
    cy.intercept('DELETE', '/services/propservice/api/transactions/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (transaction) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/propservice/api/transactions/${transaction.id}`,
      }).then(() => {
        transaction = undefined;
      });
    }
  });

  it('Transactions menu should load Transactions page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('transaction');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Transaction').should('exist');
    cy.url().should('match', transactionPageUrlPattern);
  });

  describe('Transaction page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(transactionPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Transaction page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/transaction/new$'));
        cy.getEntityCreateUpdateHeading('Transaction');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', transactionPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/services/propservice/api/transactions',
          body: transactionSample,
        }).then(({ body }) => {
          transaction = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/services/propservice/api/transactions+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/services/propservice/api/transactions?page=0&size=20>; rel="last",<http://localhost/services/propservice/api/transactions?page=0&size=20>; rel="first"',
              },
              body: [transaction],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(transactionPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Transaction page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('transaction');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', transactionPageUrlPattern);
      });

      it('edit button click should load edit Transaction page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Transaction');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', transactionPageUrlPattern);
      });

      it('edit button click should load edit Transaction page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Transaction');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', transactionPageUrlPattern);
      });

      it('last delete button click should delete instance of Transaction', () => {
        cy.intercept('GET', '/services/propservice/api/transactions/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('transaction').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', transactionPageUrlPattern);

        transaction = undefined;
      });
    });
  });

  describe('new Transaction page', () => {
    beforeEach(() => {
      cy.visit(`${transactionPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Transaction');
    });

    it('should create an instance of Transaction', () => {
      cy.get(`[data-cy="propertyId"]`).type('545');
      cy.get(`[data-cy="propertyId"]`).should('have.value', '545');

      cy.get(`[data-cy="transactionType"]`).type('if schlep 거꾸로');
      cy.get(`[data-cy="transactionType"]`).should('have.value', 'if schlep 거꾸로');

      cy.get(`[data-cy="price"]`).type('1695.4');
      cy.get(`[data-cy="price"]`).should('have.value', '1695.4');

      cy.get(`[data-cy="transactionDate"]`).type('2024-12-11T22:50');
      cy.get(`[data-cy="transactionDate"]`).blur();
      cy.get(`[data-cy="transactionDate"]`).should('have.value', '2024-12-11T22:50');

      cy.get(`[data-cy="buyer"]`).type('진지한 up');
      cy.get(`[data-cy="buyer"]`).should('have.value', '진지한 up');

      cy.get(`[data-cy="seller"]`).type('incidentally');
      cy.get(`[data-cy="seller"]`).should('have.value', 'incidentally');

      cy.get(`[data-cy="agent"]`).type('예술적인');
      cy.get(`[data-cy="agent"]`).should('have.value', '예술적인');

      cy.get(`[data-cy="createdAt"]`).type('2024-12-12T00:16');
      cy.get(`[data-cy="createdAt"]`).blur();
      cy.get(`[data-cy="createdAt"]`).should('have.value', '2024-12-12T00:16');

      cy.get(`[data-cy="updatedAt"]`).type('2024-12-11T04:50');
      cy.get(`[data-cy="updatedAt"]`).blur();
      cy.get(`[data-cy="updatedAt"]`).should('have.value', '2024-12-11T04:50');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        transaction = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', transactionPageUrlPattern);
    });
  });
});
