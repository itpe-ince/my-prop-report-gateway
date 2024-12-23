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

describe('NotiSendJob e2e test', () => {
  const notiSendJobPageUrl = '/noti-send-job';
  const notiSendJobPageUrlPattern = new RegExp('/noti-send-job(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const notiSendJobSample = {
    jobName: '비뚤어진 coop',
    jobTime: '유연 astride',
    jobType: 'RESERVE',
    jobStartAt: '심하게 yet toward',
    jobEndAt: 'till an drat',
    jobStatus: 'ACTIVE',
    createdAt: '2024-12-22T15:24:50.526Z',
  };

  let notiSendJob;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/services/commonservice/api/noti-send-jobs+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/services/commonservice/api/noti-send-jobs').as('postEntityRequest');
    cy.intercept('DELETE', '/services/commonservice/api/noti-send-jobs/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (notiSendJob) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/commonservice/api/noti-send-jobs/${notiSendJob.id}`,
      }).then(() => {
        notiSendJob = undefined;
      });
    }
  });

  it('NotiSendJobs menu should load NotiSendJobs page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('noti-send-job');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('NotiSendJob').should('exist');
    cy.url().should('match', notiSendJobPageUrlPattern);
  });

  describe('NotiSendJob page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(notiSendJobPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create NotiSendJob page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/noti-send-job/new$'));
        cy.getEntityCreateUpdateHeading('NotiSendJob');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', notiSendJobPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/services/commonservice/api/noti-send-jobs',
          body: notiSendJobSample,
        }).then(({ body }) => {
          notiSendJob = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/services/commonservice/api/noti-send-jobs+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/services/commonservice/api/noti-send-jobs?page=0&size=20>; rel="last",<http://localhost/services/commonservice/api/noti-send-jobs?page=0&size=20>; rel="first"',
              },
              body: [notiSendJob],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(notiSendJobPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details NotiSendJob page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('notiSendJob');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', notiSendJobPageUrlPattern);
      });

      it('edit button click should load edit NotiSendJob page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('NotiSendJob');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', notiSendJobPageUrlPattern);
      });

      it('edit button click should load edit NotiSendJob page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('NotiSendJob');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', notiSendJobPageUrlPattern);
      });

      it('last delete button click should delete instance of NotiSendJob', () => {
        cy.intercept('GET', '/services/commonservice/api/noti-send-jobs/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('notiSendJob').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', notiSendJobPageUrlPattern);

        notiSendJob = undefined;
      });
    });
  });

  describe('new NotiSendJob page', () => {
    beforeEach(() => {
      cy.visit(`${notiSendJobPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('NotiSendJob');
    });

    it('should create an instance of NotiSendJob', () => {
      cy.get(`[data-cy="jobName"]`).type('무더운 huzzah');
      cy.get(`[data-cy="jobName"]`).should('have.value', '무더운 huzzah');

      cy.get(`[data-cy="jobTime"]`).type('분석 below');
      cy.get(`[data-cy="jobTime"]`).should('have.value', '분석 below');

      cy.get(`[data-cy="jobType"]`).select('CRON');

      cy.get(`[data-cy="jobStartAt"]`).type('so blah wherever');
      cy.get(`[data-cy="jobStartAt"]`).should('have.value', 'so blah wherever');

      cy.get(`[data-cy="jobEndAt"]`).type('yowza ugh');
      cy.get(`[data-cy="jobEndAt"]`).should('have.value', 'yowza ugh');

      cy.get(`[data-cy="jobStatus"]`).select('INACTIVE');

      cy.get(`[data-cy="createdAt"]`).type('2024-12-22T11:55');
      cy.get(`[data-cy="createdAt"]`).blur();
      cy.get(`[data-cy="createdAt"]`).should('have.value', '2024-12-22T11:55');

      cy.get(`[data-cy="updatedAt"]`).type('2024-12-23T02:30');
      cy.get(`[data-cy="updatedAt"]`).blur();
      cy.get(`[data-cy="updatedAt"]`).should('have.value', '2024-12-23T02:30');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        notiSendJob = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', notiSendJobPageUrlPattern);
    });
  });
});
