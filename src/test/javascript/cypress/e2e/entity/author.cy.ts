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

describe('Author e2e test', () => {
  const authorPageUrl = '/author';
  const authorPageUrlPattern = new RegExp('/author(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const authorSample = { name: 'dock', contactInfo: '즐겁게 mummify' };

  let author;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/services/reportservice/api/authors+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/services/reportservice/api/authors').as('postEntityRequest');
    cy.intercept('DELETE', '/services/reportservice/api/authors/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (author) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/reportservice/api/authors/${author.id}`,
      }).then(() => {
        author = undefined;
      });
    }
  });

  it('Authors menu should load Authors page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('author');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Author').should('exist');
    cy.url().should('match', authorPageUrlPattern);
  });

  describe('Author page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(authorPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Author page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/author/new$'));
        cy.getEntityCreateUpdateHeading('Author');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', authorPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/services/reportservice/api/authors',
          body: authorSample,
        }).then(({ body }) => {
          author = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/services/reportservice/api/authors+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/services/reportservice/api/authors?page=0&size=20>; rel="last",<http://localhost/services/reportservice/api/authors?page=0&size=20>; rel="first"',
              },
              body: [author],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(authorPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Author page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('author');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', authorPageUrlPattern);
      });

      it('edit button click should load edit Author page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Author');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', authorPageUrlPattern);
      });

      it('edit button click should load edit Author page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Author');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', authorPageUrlPattern);
      });

      it('last delete button click should delete instance of Author', () => {
        cy.intercept('GET', '/services/reportservice/api/authors/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('author').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', authorPageUrlPattern);

        author = undefined;
      });
    });
  });

  describe('new Author page', () => {
    beforeEach(() => {
      cy.visit(`${authorPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Author');
    });

    it('should create an instance of Author', () => {
      cy.get(`[data-cy="name"]`).type('ah 완벽한');
      cy.get(`[data-cy="name"]`).should('have.value', 'ah 완벽한');

      cy.get(`[data-cy="contactInfo"]`).type('how the');
      cy.get(`[data-cy="contactInfo"]`).should('have.value', 'how the');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        author = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', authorPageUrlPattern);
    });
  });
});
