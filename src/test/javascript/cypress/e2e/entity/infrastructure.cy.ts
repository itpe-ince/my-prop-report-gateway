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

describe('Infrastructure e2e test', () => {
  const infrastructurePageUrl = '/infrastructure';
  const infrastructurePageUrlPattern = new RegExp('/infrastructure(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const infrastructureSample = { reportId: 31914, infraType: 'TRANSPRT', infraName: 'or', conditionLevel: 'HIGH' };

  let infrastructure;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/services/reportservice/api/infrastructures+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/services/reportservice/api/infrastructures').as('postEntityRequest');
    cy.intercept('DELETE', '/services/reportservice/api/infrastructures/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (infrastructure) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/reportservice/api/infrastructures/${infrastructure.id}`,
      }).then(() => {
        infrastructure = undefined;
      });
    }
  });

  it('Infrastructures menu should load Infrastructures page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('infrastructure');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Infrastructure').should('exist');
    cy.url().should('match', infrastructurePageUrlPattern);
  });

  describe('Infrastructure page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(infrastructurePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Infrastructure page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/infrastructure/new$'));
        cy.getEntityCreateUpdateHeading('Infrastructure');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', infrastructurePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/services/reportservice/api/infrastructures',
          body: infrastructureSample,
        }).then(({ body }) => {
          infrastructure = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/services/reportservice/api/infrastructures+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/services/reportservice/api/infrastructures?page=0&size=20>; rel="last",<http://localhost/services/reportservice/api/infrastructures?page=0&size=20>; rel="first"',
              },
              body: [infrastructure],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(infrastructurePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Infrastructure page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('infrastructure');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', infrastructurePageUrlPattern);
      });

      it('edit button click should load edit Infrastructure page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Infrastructure');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', infrastructurePageUrlPattern);
      });

      it('edit button click should load edit Infrastructure page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Infrastructure');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', infrastructurePageUrlPattern);
      });

      it('last delete button click should delete instance of Infrastructure', () => {
        cy.intercept('GET', '/services/reportservice/api/infrastructures/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('infrastructure').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', infrastructurePageUrlPattern);

        infrastructure = undefined;
      });
    });
  });

  describe('new Infrastructure page', () => {
    beforeEach(() => {
      cy.visit(`${infrastructurePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Infrastructure');
    });

    it('should create an instance of Infrastructure', () => {
      cy.get(`[data-cy="reportId"]`).type('31404');
      cy.get(`[data-cy="reportId"]`).should('have.value', '31404');

      cy.get(`[data-cy="infraType"]`).select('CONVENIENCE');

      cy.get(`[data-cy="infraName"]`).type('barring 조언');
      cy.get(`[data-cy="infraName"]`).should('have.value', 'barring 조언');

      cy.get(`[data-cy="conditionLevel"]`).select('MIDDLE');

      cy.get(`[data-cy="infraDistance"]`).type('11853');
      cy.get(`[data-cy="infraDistance"]`).should('have.value', '11853');

      cy.get(`[data-cy="infraDistanceUnit"]`).select('LOW');

      cy.get(`[data-cy="remarks"]`).type('똑똑하게 now');
      cy.get(`[data-cy="remarks"]`).should('have.value', '똑똑하게 now');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        infrastructure = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', infrastructurePageUrlPattern);
    });
  });
});
