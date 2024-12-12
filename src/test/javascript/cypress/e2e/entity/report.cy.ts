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
    reportTitle: 'flight',
    authorId: 21268,
    exteriorState: 'MIDDLE',
    maintenanceState: 'LOW',
    elevatorState: 'HIGH',
    noiseState: 'MIDDLE',
    homepadState: 'HIGH',
    fireSafetyState: 'HIGH',
    doorSecurityState: 'HIGH',
    complexId: 83,
    complexName: 'pro',
    propertyId: 26728,
    propertyName: 'once',
    createdAt: '2024-12-11T13:37:12.427Z',
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

      cy.get(`[data-cy="reportDate"]`).type('2024-12-11T13:58');
      cy.get(`[data-cy="reportDate"]`).blur();
      cy.get(`[data-cy="reportDate"]`).should('have.value', '2024-12-11T13:58');

      cy.get(`[data-cy="authorId"]`).type('21255');
      cy.get(`[data-cy="authorId"]`).should('have.value', '21255');

      cy.get(`[data-cy="summary"]`).type('극적인 밝게 upon');
      cy.get(`[data-cy="summary"]`).should('have.value', '극적인 밝게 upon');

      cy.get(`[data-cy="exteriorState"]`).select('MIDDLE');

      cy.get(`[data-cy="constructionYear"]`).type('16001');
      cy.get(`[data-cy="constructionYear"]`).should('have.value', '16001');

      cy.get(`[data-cy="maintenanceState"]`).select('LOW');

      cy.get(`[data-cy="parkingFacility"]`).type('indeed 이국적인');
      cy.get(`[data-cy="parkingFacility"]`).should('have.value', 'indeed 이국적인');

      cy.get(`[data-cy="parkingCount"]`).type('14831');
      cy.get(`[data-cy="parkingCount"]`).should('have.value', '14831');

      cy.get(`[data-cy="elevatorState"]`).select('MIDDLE');

      cy.get(`[data-cy="noiseState"]`).select('LOW');

      cy.get(`[data-cy="homepadState"]`).select('LOW');

      cy.get(`[data-cy="cctvYn"]`).type('관');
      cy.get(`[data-cy="cctvYn"]`).should('have.value', '관');

      cy.get(`[data-cy="fireSafetyState"]`).select('MIDDLE');

      cy.get(`[data-cy="doorSecurityState"]`).select('HIGH');

      cy.get(`[data-cy="maintenanceFee"]`).type('9041');
      cy.get(`[data-cy="maintenanceFee"]`).should('have.value', '9041');

      cy.get(`[data-cy="redevelopmentYn"]`).type('d');
      cy.get(`[data-cy="redevelopmentYn"]`).should('have.value', 'd');

      cy.get(`[data-cy="rentalDemand"]`).type('경보 huzzah boohoo');
      cy.get(`[data-cy="rentalDemand"]`).should('have.value', '경보 huzzah boohoo');

      cy.get(`[data-cy="communityRules"]`).type('entice 외계인 복잡한');
      cy.get(`[data-cy="communityRules"]`).should('have.value', 'entice 외계인 복잡한');

      cy.get(`[data-cy="complexId"]`).type('14086');
      cy.get(`[data-cy="complexId"]`).should('have.value', '14086');

      cy.get(`[data-cy="complexName"]`).type('whoever at');
      cy.get(`[data-cy="complexName"]`).should('have.value', 'whoever at');

      cy.get(`[data-cy="propertyId"]`).type('6301');
      cy.get(`[data-cy="propertyId"]`).should('have.value', '6301');

      cy.get(`[data-cy="propertyName"]`).type('snuggle 비행사 entrench');
      cy.get(`[data-cy="propertyName"]`).should('have.value', 'snuggle 비행사 entrench');

      cy.get(`[data-cy="createdAt"]`).type('2024-12-11T23:42');
      cy.get(`[data-cy="createdAt"]`).blur();
      cy.get(`[data-cy="createdAt"]`).should('have.value', '2024-12-11T23:42');

      cy.get(`[data-cy="updatedAt"]`).type('2024-12-11T21:29');
      cy.get(`[data-cy="updatedAt"]`).blur();
      cy.get(`[data-cy="updatedAt"]`).should('have.value', '2024-12-11T21:29');

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
