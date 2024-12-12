import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { JhiItemCount, JhiPagination, TextFormat, Translate, getPaginationState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { APP_DATE_FORMAT } from 'app/config/constants';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities } from './attach-file.reducer';

export const AttachFile = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getPaginationState(pageLocation, ITEMS_PER_PAGE, 'id'), pageLocation.search),
  );

  const attachFileList = useAppSelector(state => state.gateway.attachFile.entities);
  const loading = useAppSelector(state => state.gateway.attachFile.loading);
  const totalItems = useAppSelector(state => state.gateway.attachFile.totalItems);

  const getAllEntities = () => {
    dispatch(
      getEntities({
        page: paginationState.activePage - 1,
        size: paginationState.itemsPerPage,
        sort: `${paginationState.sort},${paginationState.order}`,
      }),
    );
  };

  const sortEntities = () => {
    getAllEntities();
    const endURL = `?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`;
    if (pageLocation.search !== endURL) {
      navigate(`${pageLocation.pathname}${endURL}`);
    }
  };

  useEffect(() => {
    sortEntities();
  }, [paginationState.activePage, paginationState.order, paginationState.sort]);

  useEffect(() => {
    const params = new URLSearchParams(pageLocation.search);
    const page = params.get('page');
    const sort = params.get(SORT);
    if (page && sort) {
      const sortSplit = sort.split(',');
      setPaginationState({
        ...paginationState,
        activePage: +page,
        sort: sortSplit[0],
        order: sortSplit[1],
      });
    }
  }, [pageLocation.search]);

  const sort = p => () => {
    setPaginationState({
      ...paginationState,
      order: paginationState.order === ASC ? DESC : ASC,
      sort: p,
    });
  };

  const handlePagination = currentPage =>
    setPaginationState({
      ...paginationState,
      activePage: currentPage,
    });

  const handleSyncList = () => {
    sortEntities();
  };

  const getSortIconByFieldName = (fieldName: string) => {
    const sortFieldName = paginationState.sort;
    const order = paginationState.order;
    if (sortFieldName !== fieldName) {
      return faSort;
    }
    return order === ASC ? faSortUp : faSortDown;
  };

  return (
    <div>
      <h2 id="attach-file-heading" data-cy="AttachFileHeading">
        <Translate contentKey="gatewayApp.commonserviceAttachFile.home.title">Attach Files</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="gatewayApp.commonserviceAttachFile.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/attach-file/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="gatewayApp.commonserviceAttachFile.home.createLabel">Create new Attach File</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {attachFileList && attachFileList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="gatewayApp.commonserviceAttachFile.id">Id</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th className="hand" onClick={sort('fileName')}>
                  <Translate contentKey="gatewayApp.commonserviceAttachFile.fileName">File Name</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('fileName')} />
                </th>
                <th className="hand" onClick={sort('fileOrgName')}>
                  <Translate contentKey="gatewayApp.commonserviceAttachFile.fileOrgName">File Org Name</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('fileOrgName')} />
                </th>
                <th className="hand" onClick={sort('filePath')}>
                  <Translate contentKey="gatewayApp.commonserviceAttachFile.filePath">File Path</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('filePath')} />
                </th>
                <th className="hand" onClick={sort('fileSize')}>
                  <Translate contentKey="gatewayApp.commonserviceAttachFile.fileSize">File Size</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('fileSize')} />
                </th>
                <th className="hand" onClick={sort('fileType')}>
                  <Translate contentKey="gatewayApp.commonserviceAttachFile.fileType">File Type</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('fileType')} />
                </th>
                <th className="hand" onClick={sort('linkUrl')}>
                  <Translate contentKey="gatewayApp.commonserviceAttachFile.linkUrl">Link Url</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('linkUrl')} />
                </th>
                <th className="hand" onClick={sort('source')}>
                  <Translate contentKey="gatewayApp.commonserviceAttachFile.source">Source</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('source')} />
                </th>
                <th className="hand" onClick={sort('relId')}>
                  <Translate contentKey="gatewayApp.commonserviceAttachFile.relId">Rel Id</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('relId')} />
                </th>
                <th className="hand" onClick={sort('relTitle')}>
                  <Translate contentKey="gatewayApp.commonserviceAttachFile.relTitle">Rel Title</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('relTitle')} />
                </th>
                <th className="hand" onClick={sort('relAttachSeq')}>
                  <Translate contentKey="gatewayApp.commonserviceAttachFile.relAttachSeq">Rel Attach Seq</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('relAttachSeq')} />
                </th>
                <th className="hand" onClick={sort('createdAt')}>
                  <Translate contentKey="gatewayApp.commonserviceAttachFile.createdAt">Created At</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('createdAt')} />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {attachFileList.map((attachFile, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/attach-file/${attachFile.id}`} color="link" size="sm">
                      {attachFile.id}
                    </Button>
                  </td>
                  <td>{attachFile.fileName}</td>
                  <td>{attachFile.fileOrgName}</td>
                  <td>{attachFile.filePath}</td>
                  <td>{attachFile.fileSize}</td>
                  <td>{attachFile.fileType}</td>
                  <td>{attachFile.linkUrl}</td>
                  <td>{attachFile.source}</td>
                  <td>{attachFile.relId}</td>
                  <td>{attachFile.relTitle}</td>
                  <td>{attachFile.relAttachSeq}</td>
                  <td>{attachFile.createdAt ? <TextFormat type="date" value={attachFile.createdAt} format={APP_DATE_FORMAT} /> : null}</td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/attach-file/${attachFile.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`/attach-file/${attachFile.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
                        color="primary"
                        size="sm"
                        data-cy="entityEditButton"
                      >
                        <FontAwesomeIcon icon="pencil-alt" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.edit">Edit</Translate>
                        </span>
                      </Button>
                      <Button
                        onClick={() =>
                          (window.location.href = `/attach-file/${attachFile.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`)
                        }
                        color="danger"
                        size="sm"
                        data-cy="entityDeleteButton"
                      >
                        <FontAwesomeIcon icon="trash" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.delete">Delete</Translate>
                        </span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          !loading && (
            <div className="alert alert-warning">
              <Translate contentKey="gatewayApp.commonserviceAttachFile.home.notFound">No Attach Files found</Translate>
            </div>
          )
        )}
      </div>
      {totalItems ? (
        <div className={attachFileList && attachFileList.length > 0 ? '' : 'd-none'}>
          <div className="justify-content-center d-flex">
            <JhiItemCount page={paginationState.activePage} total={totalItems} itemsPerPage={paginationState.itemsPerPage} i18nEnabled />
          </div>
          <div className="justify-content-center d-flex">
            <JhiPagination
              activePage={paginationState.activePage}
              onSelect={handlePagination}
              maxButtons={5}
              itemsPerPage={paginationState.itemsPerPage}
              totalItems={totalItems}
            />
          </div>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default AttachFile;
