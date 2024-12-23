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

describe('Bedroom e2e test', () => {
  const bedroomPageUrl = '/bedroom';
  const bedroomPageUrlPattern = new RegExp('/bedroom(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const bedroomSample = { bedroomName: 'unto', conditionLevel: 'LOW' };

  let bedroom;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/services/reportservice/api/bedrooms+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/services/reportservice/api/bedrooms').as('postEntityRequest');
    cy.intercept('DELETE', '/services/reportservice/api/bedrooms/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (bedroom) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/reportservice/api/bedrooms/${bedroom.id}`,
      }).then(() => {
        bedroom = undefined;
      });
    }
  });

  it('Bedrooms menu should load Bedrooms page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('bedroom');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Bedroom').should('exist');
    cy.url().should('match', bedroomPageUrlPattern);
  });

  describe('Bedroom page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(bedroomPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Bedroom page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/bedroom/new$'));
        cy.getEntityCreateUpdateHeading('Bedroom');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', bedroomPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/services/reportservice/api/bedrooms',
          body: bedroomSample,
        }).then(({ body }) => {
          bedroom = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/services/reportservice/api/bedrooms+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/services/reportservice/api/bedrooms?page=0&size=20>; rel="last",<http://localhost/services/reportservice/api/bedrooms?page=0&size=20>; rel="first"',
              },
              body: [bedroom],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(bedroomPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Bedroom page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('bedroom');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', bedroomPageUrlPattern);
      });

      it('edit button click should load edit Bedroom page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Bedroom');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', bedroomPageUrlPattern);
      });

      it('edit button click should load edit Bedroom page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Bedroom');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', bedroomPageUrlPattern);
      });

      it('last delete button click should delete instance of Bedroom', () => {
        cy.intercept('GET', '/services/reportservice/api/bedrooms/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('bedroom').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', bedroomPageUrlPattern);

        bedroom = undefined;
      });
    });
  });

  describe('new Bedroom page', () => {
    beforeEach(() => {
      cy.visit(`${bedroomPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Bedroom');
    });

    it('should create an instance of Bedroom', () => {
      cy.get(`[data-cy="bedroomName"]`).type('or 붐비는');
      cy.get(`[data-cy="bedroomName"]`).should('have.value', 'or 붐비는');

      cy.get(`[data-cy="conditionLevel"]`).select('MIDDLE');

      cy.get(`[data-cy="roomSize"]`).type('17856.51');
      cy.get(`[data-cy="roomSize"]`).should('have.value', '17856.51');

      cy.get(`[data-cy="closetYn"]`).type('g');
      cy.get(`[data-cy="closetYn"]`).should('have.value', 'g');

      cy.get(`[data-cy="acYn"]`).type('전');
      cy.get(`[data-cy="acYn"]`).should('have.value', '전');

      cy.get(`[data-cy="windowLocation"]`).type('of');
      cy.get(`[data-cy="windowLocation"]`).should('have.value', 'of');

      cy.get(`[data-cy="windowSize"]`).type('boohoo out');
      cy.get(`[data-cy="windowSize"]`).should('have.value', 'boohoo out');

      cy.get(`[data-cy="remarks"]`).type('쿨하게');
      cy.get(`[data-cy="remarks"]`).should('have.value', '쿨하게');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        bedroom = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', bedroomPageUrlPattern);
    });
  });
});
