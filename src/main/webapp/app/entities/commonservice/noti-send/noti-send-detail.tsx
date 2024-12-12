import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './noti-send.reducer';

export const NotiSendDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const notiSendEntity = useAppSelector(state => state.gateway.notiSend.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="notiSendDetailsHeading">
          <Translate contentKey="gatewayApp.commonserviceNotiSend.detail.title">NotiSend</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="gatewayApp.commonserviceNotiSend.id">Id</Translate>
            </span>
          </dt>
          <dd>{notiSendEntity.id}</dd>
          <dt>
            <span id="notiName">
              <Translate contentKey="gatewayApp.commonserviceNotiSend.notiName">Noti Name</Translate>
            </span>
          </dt>
          <dd>{notiSendEntity.notiName}</dd>
          <dt>
            <span id="notiType">
              <Translate contentKey="gatewayApp.commonserviceNotiSend.notiType">Noti Type</Translate>
            </span>
          </dt>
          <dd>{notiSendEntity.notiType}</dd>
          <dt>
            <span id="notiTemplateId">
              <Translate contentKey="gatewayApp.commonserviceNotiSend.notiTemplateId">Noti Template Id</Translate>
            </span>
          </dt>
          <dd>{notiSendEntity.notiTemplateId}</dd>
          <dt>
            <span id="notiMsg">
              <Translate contentKey="gatewayApp.commonserviceNotiSend.notiMsg">Noti Msg</Translate>
            </span>
          </dt>
          <dd>{notiSendEntity.notiMsg}</dd>
          <dt>
            <span id="createdAt">
              <Translate contentKey="gatewayApp.commonserviceNotiSend.createdAt">Created At</Translate>
            </span>
          </dt>
          <dd>{notiSendEntity.createdAt ? <TextFormat value={notiSendEntity.createdAt} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="updatedAt">
              <Translate contentKey="gatewayApp.commonserviceNotiSend.updatedAt">Updated At</Translate>
            </span>
          </dt>
          <dd>{notiSendEntity.updatedAt ? <TextFormat value={notiSendEntity.updatedAt} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <Translate contentKey="gatewayApp.commonserviceNotiSend.notiTemplate">Noti Template</Translate>
          </dt>
          <dd>{notiSendEntity.notiTemplate ? notiSendEntity.notiTemplate.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/noti-send" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/noti-send/${notiSendEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default NotiSendDetail;
