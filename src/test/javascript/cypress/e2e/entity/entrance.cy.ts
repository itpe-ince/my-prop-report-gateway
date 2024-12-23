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

describe('Entrance e2e test', () => {
  const entrancePageUrl = '/entrance';
  const entrancePageUrlPattern = new RegExp('/entrance(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const entranceSample = { entranceName: 'satirise duh', condtionLevel: 'LOW' };

  let entrance;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/services/reportservice/api/entrances+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/services/reportservice/api/entrances').as('postEntityRequest');
    cy.intercept('DELETE', '/services/reportservice/api/entrances/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (entrance) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/reportservice/api/entrances/${entrance.id}`,
      }).then(() => {
        entrance = undefined;
      });
    }
  });

  it('Entrances menu should load Entrances page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('entrance');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Entrance').should('exist');
    cy.url().should('match', entrancePageUrlPattern);
  });

  describe('Entrance page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(entrancePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Entrance page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/entrance/new$'));
        cy.getEntityCreateUpdateHeading('Entrance');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', entrancePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/services/reportservice/api/entrances',
          body: entranceSample,
        }).then(({ body }) => {
          entrance = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/services/reportservice/api/entrances+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/services/reportservice/api/entrances?page=0&size=20>; rel="last",<http://localhost/services/reportservice/api/entrances?page=0&size=20>; rel="first"',
              },
              body: [entrance],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(entrancePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Entrance page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('entrance');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', entrancePageUrlPattern);
      });

      it('edit button click should load edit Entrance page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Entrance');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', entrancePageUrlPattern);
      });

      it('edit button click should load edit Entrance page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Entrance');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', entrancePageUrlPattern);
      });

      it('last delete button click should delete instance of Entrance', () => {
        cy.intercept('GET', '/services/reportservice/api/entrances/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('entrance').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', entrancePageUrlPattern);

        entrance = undefined;
      });
    });
  });

  describe('new Entrance page', () => {
    beforeEach(() => {
      cy.visit(`${entrancePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Entrance');
    });

    it('should create an instance of Entrance', () => {
      cy.get(`[data-cy="entranceName"]`).type('호박색 차가운 아름답게');
      cy.get(`[data-cy="entranceName"]`).should('have.value', '호박색 차가운 아름답게');

      cy.get(`[data-cy="condtionLevel"]`).select('MIDDLE');

      cy.get(`[data-cy="entranceSize"]`).type('2287.11');
      cy.get(`[data-cy="entranceSize"]`).should('have.value', '2287.11');

      cy.get(`[data-cy="shoeRackSize"]`).type('6048.71');
      cy.get(`[data-cy="shoeRackSize"]`).should('have.value', '6048.71');

      cy.get(`[data-cy="pantryPresence"]`).type('a');
      cy.get(`[data-cy="pantryPresence"]`).should('have.value', 'a');

      cy.get(`[data-cy="remarks"]`).type('의식하는');
      cy.get(`[data-cy="remarks"]`).should('have.value', '의식하는');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        entrance = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', entrancePageUrlPattern);
    });
  });
});
