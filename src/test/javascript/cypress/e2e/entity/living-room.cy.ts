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

describe('LivingRoom e2e test', () => {
  const livingRoomPageUrl = '/living-room';
  const livingRoomPageUrlPattern = new RegExp('/living-room(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const livingRoomSample = { livingRoomName: 'how', conditionLevel: 'HIGH', wallState: 'MIDDLE' };

  let livingRoom;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/services/reportservice/api/living-rooms+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/services/reportservice/api/living-rooms').as('postEntityRequest');
    cy.intercept('DELETE', '/services/reportservice/api/living-rooms/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (livingRoom) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/reportservice/api/living-rooms/${livingRoom.id}`,
      }).then(() => {
        livingRoom = undefined;
      });
    }
  });

  it('LivingRooms menu should load LivingRooms page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('living-room');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('LivingRoom').should('exist');
    cy.url().should('match', livingRoomPageUrlPattern);
  });

  describe('LivingRoom page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(livingRoomPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create LivingRoom page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/living-room/new$'));
        cy.getEntityCreateUpdateHeading('LivingRoom');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', livingRoomPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/services/reportservice/api/living-rooms',
          body: livingRoomSample,
        }).then(({ body }) => {
          livingRoom = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/services/reportservice/api/living-rooms+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/services/reportservice/api/living-rooms?page=0&size=20>; rel="last",<http://localhost/services/reportservice/api/living-rooms?page=0&size=20>; rel="first"',
              },
              body: [livingRoom],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(livingRoomPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details LivingRoom page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('livingRoom');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', livingRoomPageUrlPattern);
      });

      it('edit button click should load edit LivingRoom page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('LivingRoom');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', livingRoomPageUrlPattern);
      });

      it('edit button click should load edit LivingRoom page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('LivingRoom');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', livingRoomPageUrlPattern);
      });

      it('last delete button click should delete instance of LivingRoom', () => {
        cy.intercept('GET', '/services/reportservice/api/living-rooms/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('livingRoom').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', livingRoomPageUrlPattern);

        livingRoom = undefined;
      });
    });
  });

  describe('new LivingRoom page', () => {
    beforeEach(() => {
      cy.visit(`${livingRoomPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('LivingRoom');
    });

    it('should create an instance of LivingRoom', () => {
      cy.get(`[data-cy="livingRoomName"]`).type('confiscate');
      cy.get(`[data-cy="livingRoomName"]`).should('have.value', 'confiscate');

      cy.get(`[data-cy="conditionLevel"]`).select('MIDDLE');

      cy.get(`[data-cy="roomSize"]`).type('27370.38');
      cy.get(`[data-cy="roomSize"]`).should('have.value', '27370.38');

      cy.get(`[data-cy="wallState"]`).select('MIDDLE');

      cy.get(`[data-cy="floorMaterial"]`).type('spectate');
      cy.get(`[data-cy="floorMaterial"]`).should('have.value', 'spectate');

      cy.get(`[data-cy="sunlight"]`).type('진지한 pish');
      cy.get(`[data-cy="sunlight"]`).should('have.value', '진지한 pish');

      cy.get(`[data-cy="remarks"]`).type('즐거운 blah zowie');
      cy.get(`[data-cy="remarks"]`).should('have.value', '즐거운 blah zowie');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        livingRoom = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', livingRoomPageUrlPattern);
    });
  });
});
