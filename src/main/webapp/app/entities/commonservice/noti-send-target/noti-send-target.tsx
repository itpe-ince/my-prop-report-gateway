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

import { getEntities } from './noti-send-target.reducer';

export const NotiSendTarget = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getPaginationState(pageLocation, ITEMS_PER_PAGE, 'id'), pageLocation.search),
  );

  const notiSendTargetList = useAppSelector(state => state.gateway.notiSendTarget.entities);
  const loading = useAppSelector(state => state.gateway.notiSendTarget.loading);
  const totalItems = useAppSelector(state => state.gateway.notiSendTarget.totalItems);

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
      <h2 id="noti-send-target-heading" data-cy="NotiSendTargetHeading">
        <Translate contentKey="gatewayApp.commonserviceNotiSendTarget.home.title">Noti Send Targets</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="gatewayApp.commonserviceNotiSendTarget.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/noti-send-target/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="gatewayApp.commonserviceNotiSendTarget.home.createLabel">Create new Noti Send Target</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {notiSendTargetList && notiSendTargetList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="gatewayApp.commonserviceNotiSendTarget.id">Id</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th className="hand" onClick={sort('notiId')}>
                  <Translate contentKey="gatewayApp.commonserviceNotiSendTarget.notiId">Noti Id</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('notiId')} />
                </th>
                <th className="hand" onClick={sort('targetUserNo')}>
                  <Translate contentKey="gatewayApp.commonserviceNotiSendTarget.targetUserNo">Target User No</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('targetUserNo')} />
                </th>
                <th className="hand" onClick={sort('targetAddress')}>
                  <Translate contentKey="gatewayApp.commonserviceNotiSendTarget.targetAddress">Target Address</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('targetAddress')} />
                </th>
                <th className="hand" onClick={sort('sendMsg')}>
                  <Translate contentKey="gatewayApp.commonserviceNotiSendTarget.sendMsg">Send Msg</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('sendMsg')} />
                </th>
                <th className="hand" onClick={sort('sendStatus')}>
                  <Translate contentKey="gatewayApp.commonserviceNotiSendTarget.sendStatus">Send Status</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('sendStatus')} />
                </th>
                <th className="hand" onClick={sort('sendAt')}>
                  <Translate contentKey="gatewayApp.commonserviceNotiSendTarget.sendAt">Send At</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('sendAt')} />
                </th>
                <th>
                  <Translate contentKey="gatewayApp.commonserviceNotiSendTarget.notiSend">Noti Send</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {notiSendTargetList.map((notiSendTarget, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/noti-send-target/${notiSendTarget.id}`} color="link" size="sm">
                      {notiSendTarget.id}
                    </Button>
                  </td>
                  <td>{notiSendTarget.notiId}</td>
                  <td>{notiSendTarget.targetUserNo}</td>
                  <td>{notiSendTarget.targetAddress}</td>
                  <td>{notiSendTarget.sendMsg}</td>
                  <td>
                    <Translate contentKey={`gatewayApp.SendStatusType.${notiSendTarget.sendStatus}`} />
                  </td>
                  <td>
                    {notiSendTarget.sendAt ? <TextFormat type="date" value={notiSendTarget.sendAt} format={APP_DATE_FORMAT} /> : null}
                  </td>
                  <td>
                    {notiSendTarget.notiSend ? (
                      <Link to={`/noti-send/${notiSendTarget.notiSend.id}`}>{notiSendTarget.notiSend.id}</Link>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/noti-send-target/${notiSendTarget.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`/noti-send-target/${notiSendTarget.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
                          (window.location.href = `/noti-send-target/${notiSendTarget.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`)
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
              <Translate contentKey="gatewayApp.commonserviceNotiSendTarget.home.notFound">No Noti Send Targets found</Translate>
            </div>
          )
        )}
      </div>
      {totalItems ? (
        <div className={notiSendTargetList && notiSendTargetList.length > 0 ? '' : 'd-none'}>
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

export default NotiSendTarget;
