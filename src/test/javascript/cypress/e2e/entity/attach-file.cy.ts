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

describe('AttachFile e2e test', () => {
  const attachFilePageUrl = '/attach-file';
  const attachFilePageUrlPattern = new RegExp('/attach-file(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const attachFileSample = { fileName: 'demonstrate aside', fileOrgName: 'catch hence', filePath: 'mmm 저주받은 boohoo', relId: 30680 };

  let attachFile;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/services/commonservice/api/attach-files+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/services/commonservice/api/attach-files').as('postEntityRequest');
    cy.intercept('DELETE', '/services/commonservice/api/attach-files/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (attachFile) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/services/commonservice/api/attach-files/${attachFile.id}`,
      }).then(() => {
        attachFile = undefined;
      });
    }
  });

  it('AttachFiles menu should load AttachFiles page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('attach-file');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response?.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('AttachFile').should('exist');
    cy.url().should('match', attachFilePageUrlPattern);
  });

  describe('AttachFile page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(attachFilePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create AttachFile page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/attach-file/new$'));
        cy.getEntityCreateUpdateHeading('AttachFile');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', attachFilePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/services/commonservice/api/attach-files',
          body: attachFileSample,
        }).then(({ body }) => {
          attachFile = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/services/commonservice/api/attach-files+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/services/commonservice/api/attach-files?page=0&size=20>; rel="last",<http://localhost/services/commonservice/api/attach-files?page=0&size=20>; rel="first"',
              },
              body: [attachFile],
            },
          ).as('entitiesRequestInternal');
        });

        cy.visit(attachFilePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details AttachFile page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('attachFile');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', attachFilePageUrlPattern);
      });

      it('edit button click should load edit AttachFile page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('AttachFile');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', attachFilePageUrlPattern);
      });

      it('edit button click should load edit AttachFile page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('AttachFile');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', attachFilePageUrlPattern);
      });

      it('last delete button click should delete instance of AttachFile', () => {
        cy.intercept('GET', '/services/commonservice/api/attach-files/*').as('dialogDeleteRequest');
        cy.get(entityDeleteButtonSelector).last().click();
        cy.wait('@dialogDeleteRequest');
        cy.getEntityDeleteDialogHeading('attachFile').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response?.statusCode).to.equal(200);
        });
        cy.url().should('match', attachFilePageUrlPattern);

        attachFile = undefined;
      });
    });
  });

  describe('new AttachFile page', () => {
    beforeEach(() => {
      cy.visit(`${attachFilePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('AttachFile');
    });

    it('should create an instance of AttachFile', () => {
      cy.get(`[data-cy="fileName"]`).type('whup scarper drat');
      cy.get(`[data-cy="fileName"]`).should('have.value', 'whup scarper drat');

      cy.get(`[data-cy="fileOrgName"]`).type('provided 대행사 following');
      cy.get(`[data-cy="fileOrgName"]`).should('have.value', 'provided 대행사 following');

      cy.get(`[data-cy="filePath"]`).type('적극적인');
      cy.get(`[data-cy="filePath"]`).should('have.value', '적극적인');

      cy.get(`[data-cy="fileSize"]`).type('31535');
      cy.get(`[data-cy="fileSize"]`).should('have.value', '31535');

      cy.get(`[data-cy="fileType"]`).type('gosh 다소');
      cy.get(`[data-cy="fileType"]`).should('have.value', 'gosh 다소');

      cy.get(`[data-cy="linkUrl"]`).type('so nor');
      cy.get(`[data-cy="linkUrl"]`).should('have.value', 'so nor');

      cy.get(`[data-cy="source"]`).type('나중에 which');
      cy.get(`[data-cy="source"]`).should('have.value', '나중에 which');

      cy.get(`[data-cy="relId"]`).type('32296');
      cy.get(`[data-cy="relId"]`).should('have.value', '32296');

      cy.get(`[data-cy="relTitle"]`).type('phew 경솔한');
      cy.get(`[data-cy="relTitle"]`).should('have.value', 'phew 경솔한');

      cy.get(`[data-cy="relAttachSeq"]`).type('841');
      cy.get(`[data-cy="relAttachSeq"]`).should('have.value', '841');

      cy.get(`[data-cy="createdAt"]`).type('2024-12-22T22:32');
      cy.get(`[data-cy="createdAt"]`).blur();
      cy.get(`[data-cy="createdAt"]`).should('have.value', '2024-12-22T22:32');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(201);
        attachFile = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response?.statusCode).to.equal(200);
      });
      cy.url().should('match', attachFilePageUrlPattern);
    });
  });
});
