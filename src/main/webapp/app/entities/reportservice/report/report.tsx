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

import { getEntities } from './report.reducer';

export const Report = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getPaginationState(pageLocation, ITEMS_PER_PAGE, 'id'), pageLocation.search),
  );

  const reportList = useAppSelector(state => state.gateway.report.entities);
  const loading = useAppSelector(state => state.gateway.report.loading);
  const totalItems = useAppSelector(state => state.gateway.report.totalItems);

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
      <h2 id="report-heading" data-cy="ReportHeading">
        <Translate contentKey="gatewayApp.reportserviceReport.home.title">Reports</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="gatewayApp.reportserviceReport.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/report/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="gatewayApp.reportserviceReport.home.createLabel">Create new Report</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {reportList && reportList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="gatewayApp.reportserviceReport.id">Id</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th className="hand" onClick={sort('reportTitle')}>
                  <Translate contentKey="gatewayApp.reportserviceReport.reportTitle">Report Title</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('reportTitle')} />
                </th>
                <th className="hand" onClick={sort('reportDate')}>
                  <Translate contentKey="gatewayApp.reportserviceReport.reportDate">Report Date</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('reportDate')} />
                </th>
                <th className="hand" onClick={sort('summary')}>
                  <Translate contentKey="gatewayApp.reportserviceReport.summary">Summary</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('summary')} />
                </th>
                <th className="hand" onClick={sort('exteriorState')}>
                  <Translate contentKey="gatewayApp.reportserviceReport.exteriorState">Exterior State</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('exteriorState')} />
                </th>
                <th className="hand" onClick={sort('constructionYear')}>
                  <Translate contentKey="gatewayApp.reportserviceReport.constructionYear">Construction Year</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('constructionYear')} />
                </th>
                <th className="hand" onClick={sort('maintenanceState')}>
                  <Translate contentKey="gatewayApp.reportserviceReport.maintenanceState">Maintenance State</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('maintenanceState')} />
                </th>
                <th className="hand" onClick={sort('parkingFacility')}>
                  <Translate contentKey="gatewayApp.reportserviceReport.parkingFacility">Parking Facility</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('parkingFacility')} />
                </th>
                <th className="hand" onClick={sort('parkingCount')}>
                  <Translate contentKey="gatewayApp.reportserviceReport.parkingCount">Parking Count</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('parkingCount')} />
                </th>
                <th className="hand" onClick={sort('elevatorState')}>
                  <Translate contentKey="gatewayApp.reportserviceReport.elevatorState">Elevator State</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('elevatorState')} />
                </th>
                <th className="hand" onClick={sort('noiseState')}>
                  <Translate contentKey="gatewayApp.reportserviceReport.noiseState">Noise State</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('noiseState')} />
                </th>
                <th className="hand" onClick={sort('homepadState')}>
                  <Translate contentKey="gatewayApp.reportserviceReport.homepadState">Homepad State</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('homepadState')} />
                </th>
                <th className="hand" onClick={sort('cctvYn')}>
                  <Translate contentKey="gatewayApp.reportserviceReport.cctvYn">Cctv Yn</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('cctvYn')} />
                </th>
                <th className="hand" onClick={sort('fireSafetyState')}>
                  <Translate contentKey="gatewayApp.reportserviceReport.fireSafetyState">Fire Safety State</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('fireSafetyState')} />
                </th>
                <th className="hand" onClick={sort('doorSecurityState')}>
                  <Translate contentKey="gatewayApp.reportserviceReport.doorSecurityState">Door Security State</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('doorSecurityState')} />
                </th>
                <th className="hand" onClick={sort('maintenanceFee')}>
                  <Translate contentKey="gatewayApp.reportserviceReport.maintenanceFee">Maintenance Fee</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('maintenanceFee')} />
                </th>
                <th className="hand" onClick={sort('redevelopmentYn')}>
                  <Translate contentKey="gatewayApp.reportserviceReport.redevelopmentYn">Redevelopment Yn</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('redevelopmentYn')} />
                </th>
                <th className="hand" onClick={sort('rentalDemand')}>
                  <Translate contentKey="gatewayApp.reportserviceReport.rentalDemand">Rental Demand</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('rentalDemand')} />
                </th>
                <th className="hand" onClick={sort('communityRules')}>
                  <Translate contentKey="gatewayApp.reportserviceReport.communityRules">Community Rules</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('communityRules')} />
                </th>
                <th className="hand" onClick={sort('complexId')}>
                  <Translate contentKey="gatewayApp.reportserviceReport.complexId">Complex Id</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('complexId')} />
                </th>
                <th className="hand" onClick={sort('complexName')}>
                  <Translate contentKey="gatewayApp.reportserviceReport.complexName">Complex Name</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('complexName')} />
                </th>
                <th className="hand" onClick={sort('propertyId')}>
                  <Translate contentKey="gatewayApp.reportserviceReport.propertyId">Property Id</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('propertyId')} />
                </th>
                <th className="hand" onClick={sort('propertyName')}>
                  <Translate contentKey="gatewayApp.reportserviceReport.propertyName">Property Name</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('propertyName')} />
                </th>
                <th className="hand" onClick={sort('createdAt')}>
                  <Translate contentKey="gatewayApp.reportserviceReport.createdAt">Created At</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('createdAt')} />
                </th>
                <th className="hand" onClick={sort('updatedAt')}>
                  <Translate contentKey="gatewayApp.reportserviceReport.updatedAt">Updated At</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('updatedAt')} />
                </th>
                <th>
                  <Translate contentKey="gatewayApp.reportserviceReport.author">Author</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {reportList.map((report, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/report/${report.id}`} color="link" size="sm">
                      {report.id}
                    </Button>
                  </td>
                  <td>{report.reportTitle}</td>
                  <td>{report.reportDate ? <TextFormat type="date" value={report.reportDate} format={APP_DATE_FORMAT} /> : null}</td>
                  <td>{report.summary}</td>
                  <td>
                    <Translate contentKey={`gatewayApp.QualityStateType.${report.exteriorState}`} />
                  </td>
                  <td>{report.constructionYear}</td>
                  <td>
                    <Translate contentKey={`gatewayApp.QualityStateType.${report.maintenanceState}`} />
                  </td>
                  <td>{report.parkingFacility}</td>
                  <td>{report.parkingCount}</td>
                  <td>
                    <Translate contentKey={`gatewayApp.QualityStateType.${report.elevatorState}`} />
                  </td>
                  <td>
                    <Translate contentKey={`gatewayApp.QualityStateType.${report.noiseState}`} />
                  </td>
                  <td>
                    <Translate contentKey={`gatewayApp.QualityStateType.${report.homepadState}`} />
                  </td>
                  <td>{report.cctvYn}</td>
                  <td>
                    <Translate contentKey={`gatewayApp.QualityStateType.${report.fireSafetyState}`} />
                  </td>
                  <td>
                    <Translate contentKey={`gatewayApp.QualityStateType.${report.doorSecurityState}`} />
                  </td>
                  <td>{report.maintenanceFee}</td>
                  <td>{report.redevelopmentYn}</td>
                  <td>{report.rentalDemand}</td>
                  <td>{report.communityRules}</td>
                  <td>{report.complexId}</td>
                  <td>{report.complexName}</td>
                  <td>{report.propertyId}</td>
                  <td>{report.propertyName}</td>
                  <td>{report.createdAt ? <TextFormat type="date" value={report.createdAt} format={APP_DATE_FORMAT} /> : null}</td>
                  <td>{report.updatedAt ? <TextFormat type="date" value={report.updatedAt} format={APP_DATE_FORMAT} /> : null}</td>
                  <td>{report.author ? <Link to={`/author/${report.author.id}`}>{report.author.id}</Link> : ''}</td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/report/${report.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`/report/${report.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
                          (window.location.href = `/report/${report.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`)
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
              <Translate contentKey="gatewayApp.reportserviceReport.home.notFound">No Reports found</Translate>
            </div>
          )
        )}
      </div>
      {totalItems ? (
        <div className={reportList && reportList.length > 0 ? '' : 'd-none'}>
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

export default Report;
