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

describe('Bathroom e2e test', () => {
  const bathroomPageUrl = '/bathroom';
  const bathroomPageUrlPattern = new RegExp('/bathroom(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const bathroomSample = { bathroomName: 'absent after', condtionLevel: 'LOW', waterPressure: 'LOW', floorAndCeiling: 'HIGH' };

  let bathroom;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/services/reportservice/api/bathrooms+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/services/reportservice/api/bathrooms').as('postEntityRequest');
    cy.intercept('DELETE', '/services/reportservice/api/bathrooms/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (bathroom) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/reportservice/api/bathrooms/${bathroom.id}`,
      }).then(() => {
        bathroom = undefined;
      });
    }
  });

  it('Bathrooms menu should load Bathrooms page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('bathroom');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Bathroom').should('exist');
    cy.url().should('match', bathroomPageUrlPattern);
  });

  describe('Bathroom page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(bathroomPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Bathroom page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/bathroom/new$'));
        cy.getEntityCreateUpdateHeading('Bathroom');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', bathroomPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/services/reportservice/api/bathrooms',
          body: bathroomSample,
        }).then(({ body }) => {
          bathroom = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/services/reportservice/api/bathrooms+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/services/reportservice/api/bathrooms?page=0&size=20>; rel="last",<http://localhost/services/reportservice/api/bathrooms?page=0&size=20>; rel="first"',
              },
              body: [bathroom],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(bathroomPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Bathroom page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('bathroom');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', bathroomPageUrlPattern);
      });

      it('edit button click should load edit Bathroom page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Bathroom');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', bathroomPageUrlPattern);
      });

      it('edit button click should load edit Bathroom page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Bathroom');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', bathroomPageUrlPattern);
      });

      it('last delete button click should delete instance of Bathroom', () => {
        cy.intercept('GET', '/services/reportservice/api/bathrooms/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('bathroom').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', bathroomPageUrlPattern);

        bathroom = undefined;
      });
    });
  });

  describe('new Bathroom page', () => {
    beforeEach(() => {
      cy.visit(`${bathroomPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Bathroom');
    });

    it('should create an instance of Bathroom', () => {
      cy.get(`[data-cy="bathroomName"]`).type('huzzah 흥미롭게');
      cy.get(`[data-cy="bathroomName"]`).should('have.value', 'huzzah 흥미롭게');

      cy.get(`[data-cy="condtionLevel"]`).select('MIDDLE');

      cy.get(`[data-cy="bathroomSize"]`).type('5224.43');
      cy.get(`[data-cy="bathroomSize"]`).should('have.value', '5224.43');

      cy.get(`[data-cy="waterPressure"]`).select('HIGH');

      cy.get(`[data-cy="showerBoothPresence"]`).type('전');
      cy.get(`[data-cy="showerBoothPresence"]`).should('have.value', '전');

      cy.get(`[data-cy="bathtubPresence"]`).type('동');
      cy.get(`[data-cy="bathtubPresence"]`).should('have.value', '동');

      cy.get(`[data-cy="floorAndCeiling"]`).select('LOW');

      cy.get(`[data-cy="remarks"]`).type('알파카 거만하게');
      cy.get(`[data-cy="remarks"]`).should('have.value', '알파카 거만하게');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        bathroom = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', bathroomPageUrlPattern);
    });
  });
});
