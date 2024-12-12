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

import { getEntities } from './noti-send-job.reducer';

export const NotiSendJob = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getPaginationState(pageLocation, ITEMS_PER_PAGE, 'id'), pageLocation.search),
  );

  const notiSendJobList = useAppSelector(state => state.gateway.notiSendJob.entities);
  const loading = useAppSelector(state => state.gateway.notiSendJob.loading);
  const totalItems = useAppSelector(state => state.gateway.notiSendJob.totalItems);

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
      <h2 id="noti-send-job-heading" data-cy="NotiSendJobHeading">
        <Translate contentKey="gatewayApp.commonserviceNotiSendJob.home.title">Noti Send Jobs</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="gatewayApp.commonserviceNotiSendJob.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/noti-send-job/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="gatewayApp.commonserviceNotiSendJob.home.createLabel">Create new Noti Send Job</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {notiSendJobList && notiSendJobList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="gatewayApp.commonserviceNotiSendJob.id">Id</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th className="hand" onClick={sort('notiId')}>
                  <Translate contentKey="gatewayApp.commonserviceNotiSendJob.notiId">Noti Id</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('notiId')} />
                </th>
                <th className="hand" onClick={sort('jobName')}>
                  <Translate contentKey="gatewayApp.commonserviceNotiSendJob.jobName">Job Name</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('jobName')} />
                </th>
                <th className="hand" onClick={sort('jobTime')}>
                  <Translate contentKey="gatewayApp.commonserviceNotiSendJob.jobTime">Job Time</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('jobTime')} />
                </th>
                <th className="hand" onClick={sort('jobType')}>
                  <Translate contentKey="gatewayApp.commonserviceNotiSendJob.jobType">Job Type</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('jobType')} />
                </th>
                <th className="hand" onClick={sort('jobStartAt')}>
                  <Translate contentKey="gatewayApp.commonserviceNotiSendJob.jobStartAt">Job Start At</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('jobStartAt')} />
                </th>
                <th className="hand" onClick={sort('jobEndAt')}>
                  <Translate contentKey="gatewayApp.commonserviceNotiSendJob.jobEndAt">Job End At</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('jobEndAt')} />
                </th>
                <th className="hand" onClick={sort('jobStatus')}>
                  <Translate contentKey="gatewayApp.commonserviceNotiSendJob.jobStatus">Job Status</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('jobStatus')} />
                </th>
                <th className="hand" onClick={sort('createdAt')}>
                  <Translate contentKey="gatewayApp.commonserviceNotiSendJob.createdAt">Created At</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('createdAt')} />
                </th>
                <th className="hand" onClick={sort('updatedAt')}>
                  <Translate contentKey="gatewayApp.commonserviceNotiSendJob.updatedAt">Updated At</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('updatedAt')} />
                </th>
                <th>
                  <Translate contentKey="gatewayApp.commonserviceNotiSendJob.notiSend">Noti Send</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {notiSendJobList.map((notiSendJob, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/noti-send-job/${notiSendJob.id}`} color="link" size="sm">
                      {notiSendJob.id}
                    </Button>
                  </td>
                  <td>{notiSendJob.notiId}</td>
                  <td>{notiSendJob.jobName}</td>
                  <td>{notiSendJob.jobTime}</td>
                  <td>
                    <Translate contentKey={`gatewayApp.JobType.${notiSendJob.jobType}`} />
                  </td>
                  <td>{notiSendJob.jobStartAt}</td>
                  <td>{notiSendJob.jobEndAt}</td>
                  <td>
                    <Translate contentKey={`gatewayApp.JobStatusType.${notiSendJob.jobStatus}`} />
                  </td>
                  <td>
                    {notiSendJob.createdAt ? <TextFormat type="date" value={notiSendJob.createdAt} format={APP_DATE_FORMAT} /> : null}
                  </td>
                  <td>
                    {notiSendJob.updatedAt ? <TextFormat type="date" value={notiSendJob.updatedAt} format={APP_DATE_FORMAT} /> : null}
                  </td>
                  <td>{notiSendJob.notiSend ? <Link to={`/noti-send/${notiSendJob.notiSend.id}`}>{notiSendJob.notiSend.id}</Link> : ''}</td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/noti-send-job/${notiSendJob.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`/noti-send-job/${notiSendJob.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
                          (window.location.href = `/noti-send-job/${notiSendJob.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`)
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
              <Translate contentKey="gatewayApp.commonserviceNotiSendJob.home.notFound">No Noti Send Jobs found</Translate>
            </div>
          )
        )}
      </div>
      {totalItems ? (
        <div className={notiSendJobList && notiSendJobList.length > 0 ? '' : 'd-none'}>
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

export default NotiSendJob;
