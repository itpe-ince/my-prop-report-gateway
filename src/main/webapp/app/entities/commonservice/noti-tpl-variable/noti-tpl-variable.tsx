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

import { getEntities } from './noti-tpl-variable.reducer';

export const NotiTplVariable = () => {
  const dispatch = useAppDispatch();

  const pageLocation = useLocation();
  const navigate = useNavigate();

  const [paginationState, setPaginationState] = useState(
    overridePaginationStateWithQueryParams(getPaginationState(pageLocation, ITEMS_PER_PAGE, 'id'), pageLocation.search),
  );

  const notiTplVariableList = useAppSelector(state => state.gateway.notiTplVariable.entities);
  const loading = useAppSelector(state => state.gateway.notiTplVariable.loading);
  const totalItems = useAppSelector(state => state.gateway.notiTplVariable.totalItems);

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
      <h2 id="noti-tpl-variable-heading" data-cy="NotiTplVariableHeading">
        <Translate contentKey="gatewayApp.commonserviceNotiTplVariable.home.title">Noti Tpl Variables</Translate>
        <div className="d-flex justify-content-end">
          <Button className="me-2" color="info" onClick={handleSyncList} disabled={loading}>
            <FontAwesomeIcon icon="sync" spin={loading} />{' '}
            <Translate contentKey="gatewayApp.commonserviceNotiTplVariable.home.refreshListLabel">Refresh List</Translate>
          </Button>
          <Link to="/noti-tpl-variable/new" className="btn btn-primary jh-create-entity" id="jh-create-entity" data-cy="entityCreateButton">
            <FontAwesomeIcon icon="plus" />
            &nbsp;
            <Translate contentKey="gatewayApp.commonserviceNotiTplVariable.home.createLabel">Create new Noti Tpl Variable</Translate>
          </Link>
        </div>
      </h2>
      <div className="table-responsive">
        {notiTplVariableList && notiTplVariableList.length > 0 ? (
          <Table responsive>
            <thead>
              <tr>
                <th className="hand" onClick={sort('id')}>
                  <Translate contentKey="gatewayApp.commonserviceNotiTplVariable.id">Id</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('id')} />
                </th>
                <th className="hand" onClick={sort('notiTemplateId')}>
                  <Translate contentKey="gatewayApp.commonserviceNotiTplVariable.notiTemplateId">Noti Template Id</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('notiTemplateId')} />
                </th>
                <th className="hand" onClick={sort('variableName')}>
                  <Translate contentKey="gatewayApp.commonserviceNotiTplVariable.variableName">Variable Name</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('variableName')} />
                </th>
                <th className="hand" onClick={sort('defaultValue')}>
                  <Translate contentKey="gatewayApp.commonserviceNotiTplVariable.defaultValue">Default Value</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('defaultValue')} />
                </th>
                <th className="hand" onClick={sort('desciption')}>
                  <Translate contentKey="gatewayApp.commonserviceNotiTplVariable.desciption">Desciption</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('desciption')} />
                </th>
                <th className="hand" onClick={sort('createdAt')}>
                  <Translate contentKey="gatewayApp.commonserviceNotiTplVariable.createdAt">Created At</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('createdAt')} />
                </th>
                <th className="hand" onClick={sort('updatedAt')}>
                  <Translate contentKey="gatewayApp.commonserviceNotiTplVariable.updatedAt">Updated At</Translate>{' '}
                  <FontAwesomeIcon icon={getSortIconByFieldName('updatedAt')} />
                </th>
                <th>
                  <Translate contentKey="gatewayApp.commonserviceNotiTplVariable.notiTemplate">Noti Template</Translate>{' '}
                  <FontAwesomeIcon icon="sort" />
                </th>
                <th />
              </tr>
            </thead>
            <tbody>
              {notiTplVariableList.map((notiTplVariable, i) => (
                <tr key={`entity-${i}`} data-cy="entityTable">
                  <td>
                    <Button tag={Link} to={`/noti-tpl-variable/${notiTplVariable.id}`} color="link" size="sm">
                      {notiTplVariable.id}
                    </Button>
                  </td>
                  <td>{notiTplVariable.notiTemplateId}</td>
                  <td>{notiTplVariable.variableName}</td>
                  <td>{notiTplVariable.defaultValue}</td>
                  <td>{notiTplVariable.desciption}</td>
                  <td>
                    {notiTplVariable.createdAt ? (
                      <TextFormat type="date" value={notiTplVariable.createdAt} format={APP_DATE_FORMAT} />
                    ) : null}
                  </td>
                  <td>
                    {notiTplVariable.updatedAt ? (
                      <TextFormat type="date" value={notiTplVariable.updatedAt} format={APP_DATE_FORMAT} />
                    ) : null}
                  </td>
                  <td>
                    {notiTplVariable.notiTemplate ? (
                      <Link to={`/noti-template/${notiTplVariable.notiTemplate.id}`}>{notiTplVariable.notiTemplate.id}</Link>
                    ) : (
                      ''
                    )}
                  </td>
                  <td className="text-end">
                    <div className="btn-group flex-btn-group-container">
                      <Button
                        tag={Link}
                        to={`/noti-tpl-variable/${notiTplVariable.id}`}
                        color="info"
                        size="sm"
                        data-cy="entityDetailsButton"
                      >
                        <FontAwesomeIcon icon="eye" />{' '}
                        <span className="d-none d-md-inline">
                          <Translate contentKey="entity.action.view">View</Translate>
                        </span>
                      </Button>
                      <Button
                        tag={Link}
                        to={`/noti-tpl-variable/${notiTplVariable.id}/edit?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`}
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
                          (window.location.href = `/noti-tpl-variable/${notiTplVariable.id}/delete?page=${paginationState.activePage}&sort=${paginationState.sort},${paginationState.order}`)
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
              <Translate contentKey="gatewayApp.commonserviceNotiTplVariable.home.notFound">No Noti Tpl Variables found</Translate>
            </div>
          )
        )}
      </div>
      {totalItems ? (
        <div className={notiTplVariableList && notiTplVariableList.length > 0 ? '' : 'd-none'}>
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

export default NotiTplVariable;
