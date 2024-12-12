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

describe('NotiSendTarget e2e test', () => {
  const notiSendTargetPageUrl = '/noti-send-target';
  const notiSendTargetPageUrlPattern = new RegExp('/noti-send-target(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const notiSendTargetSample = {
    notiId: 23154,
    targetUserNo: 28623,
    targetAddress: 'yowza 명랑하게 거만하게',
    sendMsg: 'alongside 에일 저주받은',
    sendStatus: 'SUCCESS',
    sendAt: '2024-12-11T20:16:16.569Z',
  };

  let notiSendTarget;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/services/commonservice/api/noti-send-targets+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/services/commonservice/api/noti-send-targets').as('postEntityRequest');
    cy.intercept('DELETE', '/services/commonservice/api/noti-send-targets/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (notiSendTarget) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/commonservice/api/noti-send-targets/${notiSendTarget.id}`,
      }).then(() => {
        notiSendTarget = undefined;
      });
    }
  });

  it('NotiSendTargets menu should load NotiSendTargets page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('noti-send-target');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('NotiSendTarget').should('exist');
    cy.url().should('match', notiSendTargetPageUrlPattern);
  });

  describe('NotiSendTarget page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(notiSendTargetPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create NotiSendTarget page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/noti-send-target/new$'));
        cy.getEntityCreateUpdateHeading('NotiSendTarget');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', notiSendTargetPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/services/commonservice/api/noti-send-targets',
          body: notiSendTargetSample,
        }).then(({ body }) => {
          notiSendTarget = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/services/commonservice/api/noti-send-targets+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/services/commonservice/api/noti-send-targets?page=0&size=20>; rel="last",<http://localhost/services/commonservice/api/noti-send-targets?page=0&size=20>; rel="first"',
              },
              body: [notiSendTarget],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(notiSendTargetPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details NotiSendTarget page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('notiSendTarget');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', notiSendTargetPageUrlPattern);
      });

      it('edit button click should load edit NotiSendTarget page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('NotiSendTarget');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', notiSendTargetPageUrlPattern);
      });

      it('edit button click should load edit NotiSendTarget page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('NotiSendTarget');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', notiSendTargetPageUrlPattern);
      });

      it('last delete button click should delete instance of NotiSendTarget', () => {
        cy.intercept('GET', '/services/commonservice/api/noti-send-targets/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('notiSendTarget').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', notiSendTargetPageUrlPattern);

        notiSendTarget = undefined;
      });
    });
  });

  describe('new NotiSendTarget page', () => {
    beforeEach(() => {
      cy.visit(`${notiSendTargetPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('NotiSendTarget');
    });

    it('should create an instance of NotiSendTarget', () => {
      cy.get(`[data-cy="notiId"]`).type('7891');
      cy.get(`[data-cy="notiId"]`).should('have.value', '7891');

      cy.get(`[data-cy="targetUserNo"]`).type('28861');
      cy.get(`[data-cy="targetUserNo"]`).should('have.value', '28861');

      cy.get(`[data-cy="targetAddress"]`).type('horn');
      cy.get(`[data-cy="targetAddress"]`).should('have.value', 'horn');

      cy.get(`[data-cy="sendMsg"]`).type('버려진 오후');
      cy.get(`[data-cy="sendMsg"]`).should('have.value', '버려진 오후');

      cy.get(`[data-cy="sendStatus"]`).select('PENDING');

      cy.get(`[data-cy="sendAt"]`).type('2024-12-12T01:51');
      cy.get(`[data-cy="sendAt"]`).blur();
      cy.get(`[data-cy="sendAt"]`).should('have.value', '2024-12-12T01:51');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        notiSendTarget = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', notiSendTargetPageUrlPattern);
    });
  });
});
