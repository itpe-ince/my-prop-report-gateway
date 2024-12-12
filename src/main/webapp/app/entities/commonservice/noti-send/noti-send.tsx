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

import { getEntities } from './noti-send.reducer';

export const NotiSend = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getPaginationState(pageLocation, ITEMS_PER_PAGE, 'id'), pageLocation.search),
  );

  const notiSendList = useAppSelector(state => state.gateway.notiSend.entities);
  const loading = useAppSelector(state => state.gateway.notiSend.loading);
  const totalItems = useAppSelector(state => state.gateway.notiSend.totalItems);

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
      <h2 id="noti-send-heading" data-cy="NotiSendHeading">
        <Translate contentKey="gatewayApp.commonserviceNotiSend.home.title">Noti Sends</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="gatewayApp.commonserviceNotiSend.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/noti-send/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="gatewayApp.commonserviceNotiSend.home.createLabel">Create new Noti Send</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {notiSendList && notiSendList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="gatewayApp.commonserviceNotiSend.id">Id</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th className="hand" onClick={sort('notiName')}>
                  <Translate contentKey="gatewayApp.commonserviceNotiSend.notiName">Noti Name</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('notiName')} />
                </th>
                <th className="hand" onClick={sort('notiType')}>
                  <Translate contentKey="gatewayApp.commonserviceNotiSend.notiType">Noti Type</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('notiType')} />
                </th>
                <th className="hand" onClick={sort('notiTemplateId')}>
                  <Translate contentKey="gatewayApp.commonserviceNotiSend.notiTemplateId">Noti Template Id</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('notiTemplateId')} />
                </th>
                <th className="hand" onClick={sort('notiMsg')}>
                  <Translate contentKey="gatewayApp.commonserviceNotiSend.notiMsg">Noti Msg</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('notiMsg')} />
                </th>
                <th className="hand" onClick={sort('createdAt')}>
                  <Translate contentKey="gatewayApp.commonserviceNotiSend.createdAt">Created At</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('createdAt')} />
                </th>
                <th className="hand" onClick={sort('updatedAt')}>
                  <Translate contentKey="gatewayApp.commonserviceNotiSend.updatedAt">Updated At</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('updatedAt')} />
                </th>
                <th>
                  <Translate contentKey="gatewayApp.commonserviceNotiSend.notiTemplate">Noti Template</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {notiSendList.map((notiSend, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/noti-send/${notiSend.id}`} color="link" size="sm">
                      {notiSend.id}
                    </Button>
                  </td>
                  <td>{notiSend.notiName}</td>
                  <td>
                    <Translate contentKey={`gatewayApp.NotiType.${notiSend.notiType}`} />
                  </td>
                  <td>{notiSend.notiTemplateId}</td>
                  <td>{notiSend.notiMsg}</td>
                  <td>{notiSend.createdAt ? <TextFormat type="date" value={notiSend.createdAt} format={APP_DATE_FORMAT} /> : null}</td>
                  <td>{notiSend.updatedAt ? <TextFormat type="date" value={notiSend.updatedAt} format={APP_DATE_FORMAT} /> : null}</td>
                  <td>
                    {notiSend.notiTemplate ? <Link to={`/noti-template/${notiSend.notiTemplate.id}`}>{notiSend.notiTemplate.id}</Link> : ''}
                  </td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/noti-send/${notiSend.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`/noti-send/${notiSend.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
                          (window.location.href = `/noti-send/${notiSend.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`)
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
              <Translate contentKey="gatewayApp.commonserviceNotiSend.home.notFound">No Noti Sends found</Translate>
            </div>
          )
        )}
      </div>
      {totalItems ? (
        <div className={notiSendList && notiSendList.length > 0 ? '' : 'd-none'}>
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

export default NotiSend;
