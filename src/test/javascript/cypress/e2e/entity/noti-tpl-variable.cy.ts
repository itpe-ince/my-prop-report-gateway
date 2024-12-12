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

describe('NotiTplVariable e2e test', () => {
  const notiTplVariablePageUrl = '/noti-tpl-variable';
  const notiTplVariablePageUrlPattern = new RegExp('/noti-tpl-variable(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const notiTplVariableSample = {
    notiTemplateId: 26911,
    variableName: 'before',
    defaultValue: 9081,
    desciption: 'eek',
    createdAt: '2024-12-11T10:12:38.532Z',
  };

  let notiTplVariable;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/services/commonservice/api/noti-tpl-variables+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/services/commonservice/api/noti-tpl-variables').as('postEntityRequest');
    cy.intercept('DELETE', '/services/commonservice/api/noti-tpl-variables/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (notiTplVariable) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/commonservice/api/noti-tpl-variables/${notiTplVariable.id}`,
      }).then(() => {
        notiTplVariable = undefined;
      });
    }
  });

  it('NotiTplVariables menu should load NotiTplVariables page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('noti-tpl-variable');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('NotiTplVariable').should('exist');
    cy.url().should('match', notiTplVariablePageUrlPattern);
  });

  describe('NotiTplVariable page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(notiTplVariablePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create NotiTplVariable page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/noti-tpl-variable/new$'));
        cy.getEntityCreateUpdateHeading('NotiTplVariable');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', notiTplVariablePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/services/commonservice/api/noti-tpl-variables',
          body: notiTplVariableSample,
        }).then(({ body }) => {
          notiTplVariable = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/services/commonservice/api/noti-tpl-variables+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/services/commonservice/api/noti-tpl-variables?page=0&size=20>; rel="last",<http://localhost/services/commonservice/api/noti-tpl-variables?page=0&size=20>; rel="first"',
              },
              body: [notiTplVariable],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(notiTplVariablePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details NotiTplVariable page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('notiTplVariable');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', notiTplVariablePageUrlPattern);
      });

      it('edit button click should load edit NotiTplVariable page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('NotiTplVariable');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', notiTplVariablePageUrlPattern);
      });

      it('edit button click should load edit NotiTplVariable page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('NotiTplVariable');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', notiTplVariablePageUrlPattern);
      });

      it('last delete button click should delete instance of NotiTplVariable', () => {
        cy.intercept('GET', '/services/commonservice/api/noti-tpl-variables/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('notiTplVariable').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', notiTplVariablePageUrlPattern);

        notiTplVariable = undefined;
      });
    });
  });

  describe('new NotiTplVariable page', () => {
    beforeEach(() => {
      cy.visit(`${notiTplVariablePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('NotiTplVariable');
    });

    it('should create an instance of NotiTplVariable', () => {
      cy.get(`[data-cy="notiTemplateId"]`).type('15826');
      cy.get(`[data-cy="notiTemplateId"]`).should('have.value', '15826');

      cy.get(`[data-cy="variableName"]`).type('즐겁게');
      cy.get(`[data-cy="variableName"]`).should('have.value', '즐겁게');

      cy.get(`[data-cy="defaultValue"]`).type('20536');
      cy.get(`[data-cy="defaultValue"]`).should('have.value', '20536');

      cy.get(`[data-cy="desciption"]`).type('psst 냉담한');
      cy.get(`[data-cy="desciption"]`).should('have.value', 'psst 냉담한');

      cy.get(`[data-cy="createdAt"]`).type('2024-12-11T09:17');
      cy.get(`[data-cy="createdAt"]`).blur();
      cy.get(`[data-cy="createdAt"]`).should('have.value', '2024-12-11T09:17');

      cy.get(`[data-cy="updatedAt"]`).type('2024-12-11T08:46');
      cy.get(`[data-cy="updatedAt"]`).blur();
      cy.get(`[data-cy="updatedAt"]`).should('have.value', '2024-12-11T08:46');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        notiTplVariable = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', notiTplVariablePageUrlPattern);
    });
  });
});
