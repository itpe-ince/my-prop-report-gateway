import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './noti-template.reducer';

export const NotiTemplateDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const notiTemplateEntity = useAppSelector(state => state.gateway.notiTemplate.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="notiTemplateDetailsHeading">
          <Translate contentKey="gatewayApp.commonserviceNotiTemplate.detail.title">NotiTemplate</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="gatewayApp.commonserviceNotiTemplate.id">Id</Translate>
            </span>
          </dt>
          <dd>{notiTemplateEntity.id}</dd>
          <dt>
            <span id="templateTitle">
              <Translate contentKey="gatewayApp.commonserviceNotiTemplate.templateTitle">Template Title</Translate>
            </span>
          </dt>
          <dd>{notiTemplateEntity.templateTitle}</dd>
          <dt>
            <span id="templateBody">
              <Translate contentKey="gatewayApp.commonserviceNotiTemplate.templateBody">Template Body</Translate>
            </span>
          </dt>
          <dd>{notiTemplateEntity.templateBody}</dd>
          <dt>
            <span id="templateFormat">
              <Translate contentKey="gatewayApp.commonserviceNotiTemplate.templateFormat">Template Format</Translate>
            </span>
          </dt>
          <dd>{notiTemplateEntity.templateFormat}</dd>
          <dt>
            <span id="createdAt">
              <Translate contentKey="gatewayApp.commonserviceNotiTemplate.createdAt">Created At</Translate>
            </span>
          </dt>
          <dd>
            {notiTemplateEntity.createdAt ? <TextFormat value={notiTemplateEntity.createdAt} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <span id="updatedAt">
              <Translate contentKey="gatewayApp.commonserviceNotiTemplate.updatedAt">Updated At</Translate>
            </span>
          </dt>
          <dd>
            {notiTemplateEntity.updatedAt ? <TextFormat value={notiTemplateEntity.updatedAt} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
        </dl>
        <Button tag={Link} to="/noti-template" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/noti-template/${notiTemplateEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default NotiTemplateDetail;
