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

describe('EnvFactor e2e test', () => {
  const envFactorPageUrl = '/env-factor';
  const envFactorPageUrlPattern = new RegExp('/env-factor(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const envFactorSample = { reportId: 1630, envFactorName: 'failing via 맹목적으로' };

  let envFactor;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/services/reportservice/api/env-factors+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/services/reportservice/api/env-factors').as('postEntityRequest');
    cy.intercept('DELETE', '/services/reportservice/api/env-factors/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (envFactor) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/reportservice/api/env-factors/${envFactor.id}`,
      }).then(() => {
        envFactor = undefined;
      });
    }
  });

  it('EnvFactors menu should load EnvFactors page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('env-factor');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('EnvFactor').should('exist');
    cy.url().should('match', envFactorPageUrlPattern);
  });

  describe('EnvFactor page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(envFactorPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create EnvFactor page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/env-factor/new$'));
        cy.getEntityCreateUpdateHeading('EnvFactor');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', envFactorPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/services/reportservice/api/env-factors',
          body: envFactorSample,
        }).then(({ body }) => {
          envFactor = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/services/reportservice/api/env-factors+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/services/reportservice/api/env-factors?page=0&size=20>; rel="last",<http://localhost/services/reportservice/api/env-factors?page=0&size=20>; rel="first"',
              },
              body: [envFactor],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(envFactorPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details EnvFactor page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('envFactor');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', envFactorPageUrlPattern);
      });

      it('edit button click should load edit EnvFactor page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('EnvFactor');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', envFactorPageUrlPattern);
      });

      it('edit button click should load edit EnvFactor page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('EnvFactor');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', envFactorPageUrlPattern);
      });

      it('last delete button click should delete instance of EnvFactor', () => {
        cy.intercept('GET', '/services/reportservice/api/env-factors/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('envFactor').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', envFactorPageUrlPattern);

        envFactor = undefined;
      });
    });
  });

  describe('new EnvFactor page', () => {
    beforeEach(() => {
      cy.visit(`${envFactorPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('EnvFactor');
    });

    it('should create an instance of EnvFactor', () => {
      cy.get(`[data-cy="reportId"]`).type('32083');
      cy.get(`[data-cy="reportId"]`).should('have.value', '32083');

      cy.get(`[data-cy="envFactorName"]`).type('despite');
      cy.get(`[data-cy="envFactorName"]`).should('have.value', 'despite');

      cy.get(`[data-cy="envFactorDistance"]`).type('23494.74');
      cy.get(`[data-cy="envFactorDistance"]`).should('have.value', '23494.74');

      cy.get(`[data-cy="remarks"]`).type('탄력 있는');
      cy.get(`[data-cy="remarks"]`).should('have.value', '탄력 있는');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        envFactor = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', envFactorPageUrlPattern);
    });
  });
});
