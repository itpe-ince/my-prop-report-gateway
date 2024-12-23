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

describe('Complex e2e test', () => {
  const complexPageUrl = '/complex';
  const complexPageUrlPattern = new RegExp('/complex(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const complexSample = { complexName: '단호한 멍든 ah', createdAt: '2024-12-22T19:07:55.142Z' };

  let complex;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/services/propservice/api/complexes+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/services/propservice/api/complexes').as('postEntityRequest');
    cy.intercept('DELETE', '/services/propservice/api/complexes/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (complex) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/propservice/api/complexes/${complex.id}`,
      }).then(() => {
        complex = undefined;
      });
    }
  });

  it('Complexes menu should load Complexes page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('complex');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Complex').should('exist');
    cy.url().should('match', complexPageUrlPattern);
  });

  describe('Complex page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(complexPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Complex page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/complex/new$'));
        cy.getEntityCreateUpdateHeading('Complex');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', complexPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/services/propservice/api/complexes',
          body: complexSample,
        }).then(({ body }) => {
          complex = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/services/propservice/api/complexes+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/services/propservice/api/complexes?page=0&size=20>; rel="last",<http://localhost/services/propservice/api/complexes?page=0&size=20>; rel="first"',
              },
              body: [complex],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(complexPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Complex page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('complex');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', complexPageUrlPattern);
      });

      it('edit button click should load edit Complex page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Complex');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', complexPageUrlPattern);
      });

      it('edit button click should load edit Complex page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Complex');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', complexPageUrlPattern);
      });

      it('last delete button click should delete instance of Complex', () => {
        cy.intercept('GET', '/services/propservice/api/complexes/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('complex').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', complexPageUrlPattern);

        complex = undefined;
      });
    });
  });

  describe('new Complex page', () => {
    beforeEach(() => {
      cy.visit(`${complexPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Complex');
    });

    it('should create an instance of Complex', () => {
      cy.get(`[data-cy="complexName"]`).type('천하게 행동 bah');
      cy.get(`[data-cy="complexName"]`).should('have.value', '천하게 행동 bah');

      cy.get(`[data-cy="state"]`).type('above ugh 사랑스러운');
      cy.get(`[data-cy="state"]`).should('have.value', 'above ugh 사랑스러운');

      cy.get(`[data-cy="county"]`).type('gah 거만하게');
      cy.get(`[data-cy="county"]`).should('have.value', 'gah 거만하게');

      cy.get(`[data-cy="city"]`).type('부천구');
      cy.get(`[data-cy="city"]`).should('have.value', '부천구');

      cy.get(`[data-cy="town"]`).type('대안');
      cy.get(`[data-cy="town"]`).should('have.value', '대안');

      cy.get(`[data-cy="addressCode"]`).type('provided');
      cy.get(`[data-cy="addressCode"]`).should('have.value', 'provided');

      cy.get(`[data-cy="createdAt"]`).type('2024-12-22T22:27');
      cy.get(`[data-cy="createdAt"]`).blur();
      cy.get(`[data-cy="createdAt"]`).should('have.value', '2024-12-22T22:27');

      cy.get(`[data-cy="updatedAt"]`).type('2024-12-23T05:23');
      cy.get(`[data-cy="updatedAt"]`).blur();
      cy.get(`[data-cy="updatedAt"]`).should('have.value', '2024-12-23T05:23');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        complex = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', complexPageUrlPattern);
    });
  });
});
