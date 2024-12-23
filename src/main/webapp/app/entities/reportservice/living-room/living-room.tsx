import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Table } from 'reactstrap';
import { JhiItemCount, JhiPagination, Translate, getPaginationState } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { ASC, DESC, ITEMS_PER_PAGE, SORT } from 'app/shared/util/pagination.constants';
import { overridePaginationStateWithQueryParams } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities } from './living-room.reducer';

export const LivingRoom = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getPaginationState(pageLocation, ITEMS_PER_PAGE, 'id'), pageLocation.search),
  );

  const livingRoomList = useAppSelector(state => state.gateway.livingRoom.entities);
  const loading = useAppSelector(state => state.gateway.livingRoom.loading);
  const totalItems = useAppSelector(state => state.gateway.livingRoom.totalItems);

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
      <h2 id="living-room-heading" data-cy="LivingRoomHeading">
        <Translate contentKey="gatewayApp.reportserviceLivingRoom.home.title">Living Rooms</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="gatewayApp.reportserviceLivingRoom.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/living-room/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="gatewayApp.reportserviceLivingRoom.home.createLabel">Create new Living Room</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {livingRoomList && livingRoomList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="gatewayApp.reportserviceLivingRoom.id">Id</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th className="hand" onClick={sort('livingRoomName')}>
                  <Translate contentKey="gatewayApp.reportserviceLivingRoom.livingRoomName">Living Room Name</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('livingRoomName')} />
                </th>
                <th className="hand" onClick={sort('conditionLevel')}>
                  <Translate contentKey="gatewayApp.reportserviceLivingRoom.conditionLevel">Condition Level</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('conditionLevel')} />
                </th>
                <th className="hand" onClick={sort('roomSize')}>
                  <Translate contentKey="gatewayApp.reportserviceLivingRoom.roomSize">Room Size</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('roomSize')} />
                </th>
                <th className="hand" onClick={sort('wallState')}>
                  <Translate contentKey="gatewayApp.reportserviceLivingRoom.wallState">Wall State</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('wallState')} />
                </th>
                <th className="hand" onClick={sort('floorMaterial')}>
                  <Translate contentKey="gatewayApp.reportserviceLivingRoom.floorMaterial">Floor Material</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('floorMaterial')} />
                </th>
                <th className="hand" onClick={sort('sunlight')}>
                  <Translate contentKey="gatewayApp.reportserviceLivingRoom.sunlight">Sunlight</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('sunlight')} />
                </th>
                <th className="hand" onClick={sort('remarks')}>
                  <Translate contentKey="gatewayApp.reportserviceLivingRoom.remarks">Remarks</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('remarks')} />
                </th>
                <th>
                  <Translate contentKey="gatewayApp.reportserviceLivingRoom.report">Report</Translate> <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {livingRoomList.map((livingRoom, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/living-room/${livingRoom.id}`} color="link" size="sm">
                      {livingRoom.id}
                    </Button>
                  </td>
                  <td>{livingRoom.livingRoomName}</td>
                  <td>
                    <Translate contentKey={`gatewayApp.QualityStateType.${livingRoom.conditionLevel}`} />
                  </td>
                  <td>{livingRoom.roomSize}</td>
                  <td>
                    <Translate contentKey={`gatewayApp.QualityStateType.${livingRoom.wallState}`} />
                  </td>
                  <td>{livingRoom.floorMaterial}</td>
                  <td>{livingRoom.sunlight}</td>
                  <td>{livingRoom.remarks}</td>
                  <td>{livingRoom.report ? <Link to={`/report/${livingRoom.report.id}`}>{livingRoom.report.id}</Link> : ''}</td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button tag={Link} to={`/living-room/${livingRoom.id}`} color="info" size="sm" data-cy="entityDetailsButton">
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`/living-room/${livingRoom.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
                          (window.location.href = `/living-room/${livingRoom.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`)
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
              <Translate contentKey="gatewayApp.reportserviceLivingRoom.home.notFound">No Living Rooms found</Translate>
            </div>
          )
        )}
      </div>
      {totalItems ? (
        <div className={livingRoomList && livingRoomList.length > 0 ? '' : 'd-none'}>
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

export default LivingRoom;
