import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './noti-tpl-variable.reducer';

export const NotiTplVariableDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const notiTplVariableEntity = useAppSelector(state => state.gateway.notiTplVariable.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="notiTplVariableDetailsHeading">
          <Translate contentKey="gatewayApp.commonserviceNotiTplVariable.detail.title">NotiTplVariable</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="gatewayApp.commonserviceNotiTplVariable.id">Id</Translate>
            </span>
          </dt>
          <dd>{notiTplVariableEntity.id}</dd>
          <dt>
            <span id="notiTemplateId">
              <Translate contentKey="gatewayApp.commonserviceNotiTplVariable.notiTemplateId">Noti Template Id</Translate>
            </span>
          </dt>
          <dd>{notiTplVariableEntity.notiTemplateId}</dd>
          <dt>
            <span id="variableName">
              <Translate contentKey="gatewayApp.commonserviceNotiTplVariable.variableName">Variable Name</Translate>
            </span>
          </dt>
          <dd>{notiTplVariableEntity.variableName}</dd>
          <dt>
            <span id="defaultValue">
              <Translate contentKey="gatewayApp.commonserviceNotiTplVariable.defaultValue">Default Value</Translate>
            </span>
          </dt>
          <dd>{notiTplVariableEntity.defaultValue}</dd>
          <dt>
            <span id="desciption">
              <Translate contentKey="gatewayApp.commonserviceNotiTplVariable.desciption">Desciption</Translate>
            </span>
          </dt>
          <dd>{notiTplVariableEntity.desciption}</dd>
          <dt>
            <span id="createdAt">
              <Translate contentKey="gatewayApp.commonserviceNotiTplVariable.createdAt">Created At</Translate>
            </span>
          </dt>
          <dd>
            {notiTplVariableEntity.createdAt ? (
              <TextFormat value={notiTplVariableEntity.createdAt} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="updatedAt">
              <Translate contentKey="gatewayApp.commonserviceNotiTplVariable.updatedAt">Updated At</Translate>
            </span>
          </dt>
          <dd>
            {notiTplVariableEntity.updatedAt ? (
              <TextFormat value={notiTplVariableEntity.updatedAt} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <Translate contentKey="gatewayApp.commonserviceNotiTplVariable.notiTemplate">Noti Template</Translate>
          </dt>
          <dd>{notiTplVariableEntity.notiTemplate ? notiTplVariableEntity.notiTemplate.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/noti-tpl-variable" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/noti-tpl-variable/${notiTplVariableEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default NotiTplVariableDetail;
