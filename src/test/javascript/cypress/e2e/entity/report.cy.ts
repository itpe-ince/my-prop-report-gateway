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

describe('Report e2e test', () => {
  const reportPageUrl = '/report';
  const reportPageUrlPattern = new RegExp('/report(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const reportSample = {
    reportTitle: 'astride',
    exteriorState: 'MIDDLE',
    maintenanceState: 'MIDDLE',
    elevatorState: 'HIGH',
    noiseState: 'HIGH',
    homepadState: 'LOW',
    fireSafetyState: 'MIDDLE',
    doorSecurityState: 'HIGH',
    complexId: 24358,
    complexName: '대담한 for 유추',
    propertyId: 9355,
    propertyName: 'until 배당',
    createdAt: '2024-12-23T03:23:57.500Z',
  };

  let report;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/services/reportservice/api/reports+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/services/reportservice/api/reports').as('postEntityRequest');
    cy.intercept('DELETE', '/services/reportservice/api/reports/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (report) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/reportservice/api/reports/${report.id}`,
      }).then(() => {
        report = undefined;
      });
    }
  });

  it('Reports menu should load Reports page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('report');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Report').should('exist');
    cy.url().should('match', reportPageUrlPattern);
  });

  describe('Report page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(reportPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Report page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/report/new$'));
        cy.getEntityCreateUpdateHeading('Report');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', reportPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/services/reportservice/api/reports',
          body: reportSample,
        }).then(({ body }) => {
          report = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/services/reportservice/api/reports+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/services/reportservice/api/reports?page=0&size=20>; rel="last",<http://localhost/services/reportservice/api/reports?page=0&size=20>; rel="first"',
              },
              body: [report],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(reportPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Report page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('report');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', reportPageUrlPattern);
      });

      it('edit button click should load edit Report page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Report');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', reportPageUrlPattern);
      });

      it('edit button click should load edit Report page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Report');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', reportPageUrlPattern);
      });

      it('last delete button click should delete instance of Report', () => {
        cy.intercept('GET', '/services/reportservice/api/reports/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('report').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', reportPageUrlPattern);

        report = undefined;
      });
    });
  });

  describe('new Report page', () => {
    beforeEach(() => {
      cy.visit(`${reportPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Report');
    });

    it('should create an instance of Report', () => {
      cy.get(`[data-cy="reportTitle"]`).type('옹호');
      cy.get(`[data-cy="reportTitle"]`).should('have.value', '옹호');

      cy.get(`[data-cy="reportDate"]`).type('2024-12-22T20:19');
      cy.get(`[data-cy="reportDate"]`).blur();
      cy.get(`[data-cy="reportDate"]`).should('have.value', '2024-12-22T20:19');

      cy.get(`[data-cy="summary"]`).type('용기 있는 깊이');
      cy.get(`[data-cy="summary"]`).should('have.value', '용기 있는 깊이');

      cy.get(`[data-cy="exteriorState"]`).select('MIDDLE');

      cy.get(`[data-cy="constructionYear"]`).type('17208');
      cy.get(`[data-cy="constructionYear"]`).should('have.value', '17208');

      cy.get(`[data-cy="maintenanceState"]`).select('HIGH');

      cy.get(`[data-cy="parkingFacility"]`).type('whoever 같은');
      cy.get(`[data-cy="parkingFacility"]`).should('have.value', 'whoever 같은');

      cy.get(`[data-cy="parkingCount"]`).type('11657');
      cy.get(`[data-cy="parkingCount"]`).should('have.value', '11657');

      cy.get(`[data-cy="elevatorState"]`).select('MIDDLE');

      cy.get(`[data-cy="noiseState"]`).select('MIDDLE');

      cy.get(`[data-cy="homepadState"]`).select('HIGH');

      cy.get(`[data-cy="cctvYn"]`).type('활');
      cy.get(`[data-cy="cctvYn"]`).should('have.value', '활');

      cy.get(`[data-cy="fireSafetyState"]`).select('HIGH');

      cy.get(`[data-cy="doorSecurityState"]`).select('LOW');

      cy.get(`[data-cy="maintenanceFee"]`).type('5222');
      cy.get(`[data-cy="maintenanceFee"]`).should('have.value', '5222');

      cy.get(`[data-cy="redevelopmentYn"]`).type('b');
      cy.get(`[data-cy="redevelopmentYn"]`).should('have.value', 'b');

      cy.get(`[data-cy="rentalDemand"]`).type('duh');
      cy.get(`[data-cy="rentalDemand"]`).should('have.value', 'duh');

      cy.get(`[data-cy="communityRules"]`).type('경보 huzzah boohoo');
      cy.get(`[data-cy="communityRules"]`).should('have.value', '경보 huzzah boohoo');

      cy.get(`[data-cy="complexId"]`).type('32076');
      cy.get(`[data-cy="complexId"]`).should('have.value', '32076');

      cy.get(`[data-cy="complexName"]`).type('행복하게');
      cy.get(`[data-cy="complexName"]`).should('have.value', '행복하게');

      cy.get(`[data-cy="propertyId"]`).type('7240');
      cy.get(`[data-cy="propertyId"]`).should('have.value', '7240');

      cy.get(`[data-cy="propertyName"]`).type('psst 예의 바른');
      cy.get(`[data-cy="propertyName"]`).should('have.value', 'psst 예의 바른');

      cy.get(`[data-cy="createdAt"]`).type('2024-12-22T23:33');
      cy.get(`[data-cy="createdAt"]`).blur();
      cy.get(`[data-cy="createdAt"]`).should('have.value', '2024-12-22T23:33');

      cy.get(`[data-cy="updatedAt"]`).type('2024-12-23T04:24');
      cy.get(`[data-cy="updatedAt"]`).blur();
      cy.get(`[data-cy="updatedAt"]`).should('have.value', '2024-12-23T04:24');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        report = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', reportPageUrlPattern);
    });
  });
});
