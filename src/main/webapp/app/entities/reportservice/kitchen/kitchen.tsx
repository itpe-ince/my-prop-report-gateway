import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { JhiItemCount, JhiPagination, Translate, getPaginationState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities } from './kitchen.reducer';

export const Kitchen = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getPaginationState(pageLocation, ITEMS_PER_PAGE, 'id'), pageLocation.search),
  );

  const kitchenList = useAppSelector(state => state.gateway.kitchen.entities);
  const loading = useAppSelector(state => state.gateway.kitchen.loading);
  const totalItems = useAppSelector(state => state.gateway.kitchen.totalItems);

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
      <h2 id="kitchen-heading" data-cy="KitchenHeading">
        <Translate contentKey="gatewayApp.reportserviceKitchen.home.title">Kitchens</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="gatewayApp.reportserviceKitchen.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/kitchen/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="gatewayApp.reportserviceKitchen.home.createLabel">Create new Kitchen</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {kitchenList && kitchenList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="gatewayApp.reportserviceKitchen.id">Id</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th className="hand" onClick={sort('reportId')}>
                  <Translate contentKey="gatewayApp.reportserviceKitchen.reportId">Report Id</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('reportId')} />
                </th>
                <th className="hand" onClick={sort('kitchenName')}>
                  <Translate contentKey="gatewayApp.reportserviceKitchen.kitchenName">Kitchen Name</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('kitchenName')} />
                </th>
                <th className="hand" onClick={sort('conditionLevel')}>
                  <Translate contentKey="gatewayApp.reportserviceKitchen.conditionLevel">Condition Level</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('conditionLevel')} />
                </th>
                <th className="hand" onClick={sort('builtInCabinet')}>
                  <Translate contentKey="gatewayApp.reportserviceKitchen.builtInCabinet">Built In Cabinet</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('builtInCabinet')} />
                </th>
                <th className="hand" onClick={sort('sinkCondition')}>
                  <Translate contentKey="gatewayApp.reportserviceKitchen.sinkCondition">Sink Condition</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('sinkCondition')} />
                </th>
                <th className="hand" onClick={sort('ventilationSystem')}>
                  <Translate contentKey="gatewayApp.reportserviceKitchen.ventilationSystem">Ventilation System</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('ventilationSystem')} />
                </th>
                <th className="hand" onClick={sort('applianceProvision')}>
                  <Translate contentKey="gatewayApp.reportserviceKitchen.applianceProvision">Appliance Provision</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('applianceProvision')} />
                </th>
                <th className="hand" onClick={sort('remarks')}>
                  <Translate contentKey="gatewayApp.reportserviceKitchen.remarks">Remarks</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('remarks')} />
                </th>
                <th>
                  <Translate contentKey="gatewayApp.reportserviceKitchen.report">Report</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {kitchenList.map((kitchen, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/kitchen/${kitchen.id}`} color="link" size="sm">
                      {kitchen.id}
                    </Button>
                  </td>
                  <td>{kitchen.reportId}</td>
                  <td>{kitchen.kitchenName}</td>
                  <td>
                    <Translate contentKey={`gatewayApp.QualityStateType.${kitchen.conditionLevel}`} />
                  </td>
                  <td>{kitchen.builtInCabinet}</td>
                  <td>
                    <Translate contentKey={`gatewayApp.QualityStateType.${kitchen.sinkCondition}`} />
                  </td>
                  <td>{kitchen.ventilationSystem}</td>
                  <td>{kitchen.applianceProvision}</td>
                  <td>{kitchen.remarks}</td>
                  <td>{kitchen.report ? <Link to={`/report/${kitchen.report.id}`}>{kitchen.report.id}</Link> : ''}</td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/kitchen/${kitchen.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`/kitchen/${kitchen.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
                          (window.location.href = `/kitchen/${kitchen.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`)
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
              <Translate contentKey="gatewayApp.reportserviceKitchen.home.notFound">No Kitchens found</Translate>
            </div>
          )
        )}
      </div>
      {totalItems ? (
        <div className={kitchenList && kitchenList.length > 0 ? '' : 'd-none'}>
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

export default Kitchen;
