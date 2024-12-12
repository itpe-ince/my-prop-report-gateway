import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { JhiItemCount, JhiPagination, Translate, getPaginationState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities } from './infrastructure.reducer';

export const Infrastructure = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getPaginationState(pageLocation, ITEMS_PER_PAGE, 'id'), pageLocation.search),
  );

  const infrastructureList = useAppSelector(state => state.gateway.infrastructure.entities);
  const loading = useAppSelector(state => state.gateway.infrastructure.loading);
  const totalItems = useAppSelector(state => state.gateway.infrastructure.totalItems);

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
      <h2 id="infrastructure-heading" data-cy="InfrastructureHeading">
        <Translate contentKey="gatewayApp.reportserviceInfrastructure.home.title">Infrastructures</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="gatewayApp.reportserviceInfrastructure.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/infrastructure/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="gatewayApp.reportserviceInfrastructure.home.createLabel">Create new Infrastructure</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {infrastructureList && infrastructureList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="gatewayApp.reportserviceInfrastructure.id">Id</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th className="hand" onClick={sort('reportId')}>
                  <Translate contentKey="gatewayApp.reportserviceInfrastructure.reportId">Report Id</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('reportId')} />
                </th>
                <th className="hand" onClick={sort('infraType')}>
                  <Translate contentKey="gatewayApp.reportserviceInfrastructure.infraType">Infra Type</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('infraType')} />
                </th>
                <th className="hand" onClick={sort('infraName')}>
                  <Translate contentKey="gatewayApp.reportserviceInfrastructure.infraName">Infra Name</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('infraName')} />
                </th>
                <th className="hand" onClick={sort('conditionLevel')}>
                  <Translate contentKey="gatewayApp.reportserviceInfrastructure.conditionLevel">Condition Level</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('conditionLevel')} />
                </th>
                <th className="hand" onClick={sort('infraDistance')}>
                  <Translate contentKey="gatewayApp.reportserviceInfrastructure.infraDistance">Infra Distance</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('infraDistance')} />
                </th>
                <th className="hand" onClick={sort('infraDistanceUnit')}>
                  <Translate contentKey="gatewayApp.reportserviceInfrastructure.infraDistanceUnit">Infra Distance Unit</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('infraDistanceUnit')} />
                </th>
                <th className="hand" onClick={sort('remarks')}>
                  <Translate contentKey="gatewayApp.reportserviceInfrastructure.remarks">Remarks</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('remarks')} />
                </th>
                <th>
                  <Translate contentKey="gatewayApp.reportserviceInfrastructure.report">Report</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {infrastructureList.map((infrastructure, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/infrastructure/${infrastructure.id}`} color="link" size="sm">
                      {infrastructure.id}
                    </Button>
                  </td>
                  <td>{infrastructure.reportId}</td>
                  <td>
                    <Translate contentKey={`gatewayApp.InfraType.${infrastructure.infraType}`} />
                  </td>
                  <td>{infrastructure.infraName}</td>
                  <td>
                    <Translate contentKey={`gatewayApp.QualityStateType.${infrastructure.conditionLevel}`} />
                  </td>
                  <td>{infrastructure.infraDistance}</td>
                  <td>
                    <Translate contentKey={`gatewayApp.QualityStateType.${infrastructure.infraDistanceUnit}`} />
                  </td>
                  <td>{infrastructure.remarks}</td>
                  <td>{infrastructure.report ? <Link to={`/report/${infrastructure.report.id}`}>{infrastructure.report.id}</Link> : ''}</td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/infrastructure/${infrastructure.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`/infrastructure/${infrastructure.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
                          (window.location.href = `/infrastructure/${infrastructure.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`)
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
              <Translate contentKey="gatewayApp.reportserviceInfrastructure.home.notFound">No Infrastructures found</Translate>
            </div>
          )
        )}
      </div>
      {totalItems ? (
        <div className={infrastructureList && infrastructureList.length > 0 ? '' : 'd-none'}>
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

export default Infrastructure;
