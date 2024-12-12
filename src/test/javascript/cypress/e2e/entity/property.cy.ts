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

describe('Property e2e test', () => {
  const propertyPageUrl = '/property';
  const propertyPageUrlPattern = new RegExp('/property(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const propertySample = {
    complexId: 9030,
    address: 'underneath 의심스럽게 달력',
    type: '맹목적으로 행복하게 likewise',
    area: 13688.5,
    rooms: 1175,
    bathrooms: 12650,
    buildYear: 21309,
    createdAt: '2024-12-11T12:43:29.750Z',
  };

  let property;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/services/propservice/api/properties+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/services/propservice/api/properties').as('postEntityRequest');
    cy.intercept('DELETE', '/services/propservice/api/properties/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (property) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/propservice/api/properties/${property.id}`,
      }).then(() => {
        property = undefined;
      });
    }
  });

  it('Properties menu should load Properties page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('property');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Property').should('exist');
    cy.url().should('match', propertyPageUrlPattern);
  });

  describe('Property page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(propertyPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Property page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/property/new$'));
        cy.getEntityCreateUpdateHeading('Property');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', propertyPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/services/propservice/api/properties',
          body: propertySample,
        }).then(({ body }) => {
          property = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/services/propservice/api/properties+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/services/propservice/api/properties?page=0&size=20>; rel="last",<http://localhost/services/propservice/api/properties?page=0&size=20>; rel="first"',
              },
              body: [property],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(propertyPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Property page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('property');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', propertyPageUrlPattern);
      });

      it('edit button click should load edit Property page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Property');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', propertyPageUrlPattern);
      });

      it('edit button click should load edit Property page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Property');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', propertyPageUrlPattern);
      });

      it('last delete button click should delete instance of Property', () => {
        cy.intercept('GET', '/services/propservice/api/properties/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('property').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', propertyPageUrlPattern);

        property = undefined;
      });
    });
  });

  describe('new Property page', () => {
    beforeEach(() => {
      cy.visit(`${propertyPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Property');
    });

    it('should create an instance of Property', () => {
      cy.get(`[data-cy="complexId"]`).type('6217');
      cy.get(`[data-cy="complexId"]`).should('have.value', '6217');

      cy.get(`[data-cy="address"]`).type('dicker');
      cy.get(`[data-cy="address"]`).should('have.value', 'dicker');

      cy.get(`[data-cy="regionCd"]`).type('gosh');
      cy.get(`[data-cy="regionCd"]`).should('have.value', 'gosh');

      cy.get(`[data-cy="localName"]`).type('이점 hmph');
      cy.get(`[data-cy="localName"]`).should('have.value', '이점 hmph');

      cy.get(`[data-cy="street"]`).type('검단동');
      cy.get(`[data-cy="street"]`).should('have.value', '검단동');

      cy.get(`[data-cy="floor"]`).type('16965');
      cy.get(`[data-cy="floor"]`).should('have.value', '16965');

      cy.get(`[data-cy="type"]`).type('고의로');
      cy.get(`[data-cy="type"]`).should('have.value', '고의로');

      cy.get(`[data-cy="area"]`).type('19942.98');
      cy.get(`[data-cy="area"]`).should('have.value', '19942.98');

      cy.get(`[data-cy="rooms"]`).type('24484');
      cy.get(`[data-cy="rooms"]`).should('have.value', '24484');

      cy.get(`[data-cy="bathrooms"]`).type('29364');
      cy.get(`[data-cy="bathrooms"]`).should('have.value', '29364');

      cy.get(`[data-cy="buildYear"]`).type('9128');
      cy.get(`[data-cy="buildYear"]`).should('have.value', '9128');

      cy.get(`[data-cy="parkingYn"]`).type('감');
      cy.get(`[data-cy="parkingYn"]`).should('have.value', '감');

      cy.get(`[data-cy="description"]`).type('전진 깊이');
      cy.get(`[data-cy="description"]`).should('have.value', '전진 깊이');

      cy.get(`[data-cy="createdAt"]`).type('2024-12-12T03:05');
      cy.get(`[data-cy="createdAt"]`).blur();
      cy.get(`[data-cy="createdAt"]`).should('have.value', '2024-12-12T03:05');

      cy.get(`[data-cy="updatedAt"]`).type('2024-12-11T14:07');
      cy.get(`[data-cy="updatedAt"]`).blur();
      cy.get(`[data-cy="updatedAt"]`).should('have.value', '2024-12-11T14:07');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        property = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', propertyPageUrlPattern);
    });
  });
});
