import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { JhiItemCount, JhiPagination, Translate, getPaginationState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities } from './entrance.reducer';

export const Entrance = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getPaginationState(pageLocation, ITEMS_PER_PAGE, 'id'), pageLocation.search),
  );

  const entranceList = useAppSelector(state => state.gateway.entrance.entities);
  const loading = useAppSelector(state => state.gateway.entrance.loading);
  const totalItems = useAppSelector(state => state.gateway.entrance.totalItems);

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
      <h2 id="entrance-heading" data-cy="EntranceHeading">
        <Translate contentKey="gatewayApp.reportserviceEntrance.home.title">Entrances</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="gatewayApp.reportserviceEntrance.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/entrance/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="gatewayApp.reportserviceEntrance.home.createLabel">Create new Entrance</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {entranceList && entranceList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="gatewayApp.reportserviceEntrance.id">Id</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th className="hand" onClick={sort('reportId')}>
                  <Translate contentKey="gatewayApp.reportserviceEntrance.reportId">Report Id</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('reportId')} />
                </th>
                <th className="hand" onClick={sort('entranceName')}>
                  <Translate contentKey="gatewayApp.reportserviceEntrance.entranceName">Entrance Name</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('entranceName')} />
                </th>
                <th className="hand" onClick={sort('condtionLevel')}>
                  <Translate contentKey="gatewayApp.reportserviceEntrance.condtionLevel">Condtion Level</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('condtionLevel')} />
                </th>
                <th className="hand" onClick={sort('entranceSize')}>
                  <Translate contentKey="gatewayApp.reportserviceEntrance.entranceSize">Entrance Size</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('entranceSize')} />
                </th>
                <th className="hand" onClick={sort('shoeRackSize')}>
                  <Translate contentKey="gatewayApp.reportserviceEntrance.shoeRackSize">Shoe Rack Size</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('shoeRackSize')} />
                </th>
                <th className="hand" onClick={sort('pantryPresence')}>
                  <Translate contentKey="gatewayApp.reportserviceEntrance.pantryPresence">Pantry Presence</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('pantryPresence')} />
                </th>
                <th className="hand" onClick={sort('remarks')}>
                  <Translate contentKey="gatewayApp.reportserviceEntrance.remarks">Remarks</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('remarks')} />
                </th>
                <th>
                  <Translate contentKey="gatewayApp.reportserviceEntrance.report">Report</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {entranceList.map((entrance, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/entrance/${entrance.id}`} color="link" size="sm">
                      {entrance.id}
                    </Button>
                  </td>
                  <td>{entrance.reportId}</td>
                  <td>{entrance.entranceName}</td>
                  <td>
                    <Translate contentKey={`gatewayApp.QualityStateType.${entrance.condtionLevel}`} />
                  </td>
                  <td>{entrance.entranceSize}</td>
                  <td>{entrance.shoeRackSize}</td>
                  <td>{entrance.pantryPresence}</td>
                  <td>{entrance.remarks}</td>
                  <td>{entrance.report ? <Link to={`/report/${entrance.report.id}`}>{entrance.report.id}</Link> : ''}</td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/entrance/${entrance.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`/entrance/${entrance.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
                          (window.location.href = `/entrance/${entrance.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`)
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
              <Translate contentKey="gatewayApp.reportserviceEntrance.home.notFound">No Entrances found</Translate>
            </div>
          )
        )}
      </div>
      {totalItems ? (
        <div className={entranceList && entranceList.length > 0 ? '' : 'd-none'}>
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

export default Entrance;
