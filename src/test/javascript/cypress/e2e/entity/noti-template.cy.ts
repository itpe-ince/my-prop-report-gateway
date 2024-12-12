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

describe('NotiTemplate e2e test', () => {
  const notiTemplatePageUrl = '/noti-template';
  const notiTemplatePageUrlPattern = new RegExp('/noti-template(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const notiTemplateSample = {
    templateTitle: '여파 불안한',
    templateBody: 'draft 승인',
    templateFormat: 'JSON',
    createdAt: '2024-12-12T00:46:55.468Z',
  };

  let notiTemplate;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/services/commonservice/api/noti-templates+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/services/commonservice/api/noti-templates').as('postEntityRequest');
    cy.intercept('DELETE', '/services/commonservice/api/noti-templates/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (notiTemplate) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/commonservice/api/noti-templates/${notiTemplate.id}`,
      }).then(() => {
        notiTemplate = undefined;
      });
    }
  });

  it('NotiTemplates menu should load NotiTemplates page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('noti-template');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('NotiTemplate').should('exist');
    cy.url().should('match', notiTemplatePageUrlPattern);
  });

  describe('NotiTemplate page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(notiTemplatePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create NotiTemplate page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/noti-template/new$'));
        cy.getEntityCreateUpdateHeading('NotiTemplate');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', notiTemplatePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/services/commonservice/api/noti-templates',
          body: notiTemplateSample,
        }).then(({ body }) => {
          notiTemplate = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/services/commonservice/api/noti-templates+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/services/commonservice/api/noti-templates?page=0&size=20>; rel="last",<http://localhost/services/commonservice/api/noti-templates?page=0&size=20>; rel="first"',
              },
              body: [notiTemplate],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(notiTemplatePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details NotiTemplate page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('notiTemplate');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', notiTemplatePageUrlPattern);
      });

      it('edit button click should load edit NotiTemplate page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('NotiTemplate');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', notiTemplatePageUrlPattern);
      });

      it('edit button click should load edit NotiTemplate page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('NotiTemplate');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', notiTemplatePageUrlPattern);
      });

      it('last delete button click should delete instance of NotiTemplate', () => {
        cy.intercept('GET', '/services/commonservice/api/noti-templates/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('notiTemplate').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', notiTemplatePageUrlPattern);

        notiTemplate = undefined;
      });
    });
  });

  describe('new NotiTemplate page', () => {
    beforeEach(() => {
      cy.visit(`${notiTemplatePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('NotiTemplate');
    });

    it('should create an instance of NotiTemplate', () => {
      cy.get(`[data-cy="templateTitle"]`).type('psst hm er');
      cy.get(`[data-cy="templateTitle"]`).should('have.value', 'psst hm er');

      cy.get(`[data-cy="templateBody"]`).type('across');
      cy.get(`[data-cy="templateBody"]`).should('have.value', 'across');

      cy.get(`[data-cy="templateFormat"]`).select('TEXT');

      cy.get(`[data-cy="createdAt"]`).type('2024-12-11T18:21');
      cy.get(`[data-cy="createdAt"]`).blur();
      cy.get(`[data-cy="createdAt"]`).should('have.value', '2024-12-11T18:21');

      cy.get(`[data-cy="updatedAt"]`).type('2024-12-12T01:48');
      cy.get(`[data-cy="updatedAt"]`).blur();
      cy.get(`[data-cy="updatedAt"]`).should('have.value', '2024-12-12T01:48');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        notiTemplate = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', notiTemplatePageUrlPattern);
    });
  });
});
