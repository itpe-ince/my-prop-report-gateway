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

describe('Kitchen e2e test', () => {
  const kitchenPageUrl = '/kitchen';
  const kitchenPageUrlPattern = new RegExp('/kitchen(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const kitchenSample = { reportId: 23031, kitchenName: 'whose', conditionLevel: 'LOW', sinkCondition: 'LOW' };

  let kitchen;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/services/reportservice/api/kitchens+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/services/reportservice/api/kitchens').as('postEntityRequest');
    cy.intercept('DELETE', '/services/reportservice/api/kitchens/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (kitchen) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/reportservice/api/kitchens/${kitchen.id}`,
      }).then(() => {
        kitchen = undefined;
      });
    }
  });

  it('Kitchens menu should load Kitchens page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('kitchen');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Kitchen').should('exist');
    cy.url().should('match', kitchenPageUrlPattern);
  });

  describe('Kitchen page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(kitchenPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Kitchen page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/kitchen/new$'));
        cy.getEntityCreateUpdateHeading('Kitchen');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', kitchenPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/services/reportservice/api/kitchens',
          body: kitchenSample,
        }).then(({ body }) => {
          kitchen = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/services/reportservice/api/kitchens+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/services/reportservice/api/kitchens?page=0&size=20>; rel="last",<http://localhost/services/reportservice/api/kitchens?page=0&size=20>; rel="first"',
              },
              body: [kitchen],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(kitchenPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Kitchen page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('kitchen');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', kitchenPageUrlPattern);
      });

      it('edit button click should load edit Kitchen page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Kitchen');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', kitchenPageUrlPattern);
      });

      it('edit button click should load edit Kitchen page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Kitchen');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', kitchenPageUrlPattern);
      });

      it('last delete button click should delete instance of Kitchen', () => {
        cy.intercept('GET', '/services/reportservice/api/kitchens/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('kitchen').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', kitchenPageUrlPattern);

        kitchen = undefined;
      });
    });
  });

  describe('new Kitchen page', () => {
    beforeEach(() => {
      cy.visit(`${kitchenPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Kitchen');
    });

    it('should create an instance of Kitchen', () => {
      cy.get(`[data-cy="reportId"]`).type('10596');
      cy.get(`[data-cy="reportId"]`).should('have.value', '10596');

      cy.get(`[data-cy="kitchenName"]`).type('정확한 modulo');
      cy.get(`[data-cy="kitchenName"]`).should('have.value', '정확한 modulo');

      cy.get(`[data-cy="conditionLevel"]`).select('MIDDLE');

      cy.get(`[data-cy="builtInCabinet"]`).type('고');
      cy.get(`[data-cy="builtInCabinet"]`).should('have.value', '고');

      cy.get(`[data-cy="sinkCondition"]`).select('LOW');

      cy.get(`[data-cy="ventilationSystem"]`).type('극적인');
      cy.get(`[data-cy="ventilationSystem"]`).should('have.value', '극적인');

      cy.get(`[data-cy="applianceProvision"]`).type('meh');
      cy.get(`[data-cy="applianceProvision"]`).should('have.value', 'meh');

      cy.get(`[data-cy="remarks"]`).type('gee 거꾸로');
      cy.get(`[data-cy="remarks"]`).should('have.value', 'gee 거꾸로');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        kitchen = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', kitchenPageUrlPattern);
    });
  });
});
