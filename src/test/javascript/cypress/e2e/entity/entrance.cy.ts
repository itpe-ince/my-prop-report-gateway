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
  const entranceSample = { reportId: 831, entranceName: '행복한 pace 충실한', condtionLevel: 'LOW' };

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
      cy.get(`[data-cy="reportId"]`).type('28474');
      cy.get(`[data-cy="reportId"]`).should('have.value', '28474');

      cy.get(`[data-cy="entranceName"]`).type('swill');
      cy.get(`[data-cy="entranceName"]`).should('have.value', 'swill');

      cy.get(`[data-cy="condtionLevel"]`).select('LOW');

      cy.get(`[data-cy="entranceSize"]`).type('7393.44');
      cy.get(`[data-cy="entranceSize"]`).should('have.value', '7393.44');

      cy.get(`[data-cy="shoeRackSize"]`).type('10103.52');
      cy.get(`[data-cy="shoeRackSize"]`).should('have.value', '10103.52');

      cy.get(`[data-cy="pantryPresence"]`).type('c');
      cy.get(`[data-cy="pantryPresence"]`).should('have.value', 'c');

      cy.get(`[data-cy="remarks"]`).type('yahoo 예의 바른');
      cy.get(`[data-cy="remarks"]`).should('have.value', 'yahoo 예의 바른');

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
