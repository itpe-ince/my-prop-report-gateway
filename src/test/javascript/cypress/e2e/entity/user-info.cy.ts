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

describe('UserInfo e2e test', () => {
  const userInfoPageUrl = '/user-info';
  const userInfoPageUrlPattern = new RegExp('/user-info(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const userInfoSample = {
    userId: 'after',
    firstname: 'meh considering probate',
    lastname: '잔인하게 yuck 흥미롭게',
    alias: 'wherever though',
    gender: 'OTHER',
    email: 'vD@6-Z4.H9}?',
    createdAt: '2024-12-23T09:29:40.414Z',
  };

  let userInfo;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/services/userservice/api/user-infos+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/services/userservice/api/user-infos').as('postEntityRequest');
    cy.intercept('DELETE', '/services/userservice/api/user-infos/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (userInfo) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/userservice/api/user-infos/${userInfo.id}`,
      }).then(() => {
        userInfo = undefined;
      });
    }
  });

  it('UserInfos menu should load UserInfos page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('user-info');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('UserInfo').should('exist');
    cy.url().should('match', userInfoPageUrlPattern);
  });

  describe('UserInfo page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(userInfoPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create UserInfo page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/user-info/new$'));
        cy.getEntityCreateUpdateHeading('UserInfo');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', userInfoPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/services/userservice/api/user-infos',
          body: userInfoSample,
        }).then(({ body }) => {
          userInfo = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/services/userservice/api/user-infos+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/services/userservice/api/user-infos?page=0&size=20>; rel="last",<http://localhost/services/userservice/api/user-infos?page=0&size=20>; rel="first"',
              },
              body: [userInfo],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(userInfoPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details UserInfo page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('userInfo');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', userInfoPageUrlPattern);
      });

      it('edit button click should load edit UserInfo page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('UserInfo');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', userInfoPageUrlPattern);
      });

      it('edit button click should load edit UserInfo page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('UserInfo');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', userInfoPageUrlPattern);
      });

      it('last delete button click should delete instance of UserInfo', () => {
        cy.intercept('GET', '/services/userservice/api/user-infos/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('userInfo').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', userInfoPageUrlPattern);

        userInfo = undefined;
      });
    });
  });

  describe('new UserInfo page', () => {
    beforeEach(() => {
      cy.visit(`${userInfoPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('UserInfo');
    });

    it('should create an instance of UserInfo', () => {
      cy.get(`[data-cy="userId"]`).type('that 간단히');
      cy.get(`[data-cy="userId"]`).should('have.value', 'that 간단히');

      cy.get(`[data-cy="firstname"]`).type('meanwhile 달력 trek');
      cy.get(`[data-cy="firstname"]`).should('have.value', 'meanwhile 달력 trek');

      cy.get(`[data-cy="lastname"]`).type('yippee');
      cy.get(`[data-cy="lastname"]`).should('have.value', 'yippee');

      cy.get(`[data-cy="alias"]`).type('off');
      cy.get(`[data-cy="alias"]`).should('have.value', 'off');

      cy.get(`[data-cy="gender"]`).select('OTHER');

      cy.get(`[data-cy="email"]`).type('*p@k.%');
      cy.get(`[data-cy="email"]`).should('have.value', '*p@k.%');

      cy.get(`[data-cy="phone"]`).type('075-074-7570');
      cy.get(`[data-cy="phone"]`).should('have.value', '075-074-7570');

      cy.get(`[data-cy="addressLine1"]`).type('바쁘게 pivot');
      cy.get(`[data-cy="addressLine1"]`).should('have.value', '바쁘게 pivot');

      cy.get(`[data-cy="addressLine2"]`).type('incidentally');
      cy.get(`[data-cy="addressLine2"]`).should('have.value', 'incidentally');

      cy.get(`[data-cy="city"]`).type('강화시');
      cy.get(`[data-cy="city"]`).should('have.value', '강화시');

      cy.get(`[data-cy="country"]`).type('Latvia');
      cy.get(`[data-cy="country"]`).should('have.value', 'Latvia');

      cy.get(`[data-cy="createdAt"]`).type('2024-12-23T06:09');
      cy.get(`[data-cy="createdAt"]`).blur();
      cy.get(`[data-cy="createdAt"]`).should('have.value', '2024-12-23T06:09');

      cy.get(`[data-cy="updatedAt"]`).type('2024-12-22T22:58');
      cy.get(`[data-cy="updatedAt"]`).blur();
      cy.get(`[data-cy="updatedAt"]`).should('have.value', '2024-12-22T22:58');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        userInfo = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', userInfoPageUrlPattern);
    });
  });
});
