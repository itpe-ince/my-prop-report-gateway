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

describe('NotiSend e2e test', () => {
  const notiSendPageUrl = '/noti-send';
  const notiSendPageUrlPattern = new RegExp('/noti-send(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const notiSendSample = { notiName: '공항 보적', notiType: 'EMAIL' };

  let notiSend;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/services/commonservice/api/noti-sends+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/services/commonservice/api/noti-sends').as('postEntityRequest');
    cy.intercept('DELETE', '/services/commonservice/api/noti-sends/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (notiSend) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/commonservice/api/noti-sends/${notiSend.id}`,
      }).then(() => {
        notiSend = undefined;
      });
    }
  });

  it('NotiSends menu should load NotiSends page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('noti-send');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('NotiSend').should('exist');
    cy.url().should('match', notiSendPageUrlPattern);
  });

  describe('NotiSend page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(notiSendPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create NotiSend page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/noti-send/new$'));
        cy.getEntityCreateUpdateHeading('NotiSend');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', notiSendPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/services/commonservice/api/noti-sends',
          body: notiSendSample,
        }).then(({ body }) => {
          notiSend = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/services/commonservice/api/noti-sends+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/services/commonservice/api/noti-sends?page=0&size=20>; rel="last",<http://localhost/services/commonservice/api/noti-sends?page=0&size=20>; rel="first"',
              },
              body: [notiSend],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(notiSendPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details NotiSend page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('notiSend');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', notiSendPageUrlPattern);
      });

      it('edit button click should load edit NotiSend page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('NotiSend');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', notiSendPageUrlPattern);
      });

      it('edit button click should load edit NotiSend page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('NotiSend');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', notiSendPageUrlPattern);
      });

      it('last delete button click should delete instance of NotiSend', () => {
        cy.intercept('GET', '/services/commonservice/api/noti-sends/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('notiSend').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', notiSendPageUrlPattern);

        notiSend = undefined;
      });
    });
  });

  describe('new NotiSend page', () => {
    beforeEach(() => {
      cy.visit(`${notiSendPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('NotiSend');
    });

    it('should create an instance of NotiSend', () => {
      cy.get(`[data-cy="notiName"]`).type('열심히 어지러운');
      cy.get(`[data-cy="notiName"]`).should('have.value', '열심히 어지러운');

      cy.get(`[data-cy="notiType"]`).select('EMAIL');

      cy.get(`[data-cy="notiMsg"]`).type('meh a times');
      cy.get(`[data-cy="notiMsg"]`).should('have.value', 'meh a times');

      cy.get(`[data-cy="createdAt"]`).type('2024-12-22T23:24');
      cy.get(`[data-cy="createdAt"]`).blur();
      cy.get(`[data-cy="createdAt"]`).should('have.value', '2024-12-22T23:24');

      cy.get(`[data-cy="updatedAt"]`).type('2024-12-22T12:23');
      cy.get(`[data-cy="updatedAt"]`).blur();
      cy.get(`[data-cy="updatedAt"]`).should('have.value', '2024-12-22T12:23');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        notiSend = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', notiSendPageUrlPattern);
    });
  });
});
