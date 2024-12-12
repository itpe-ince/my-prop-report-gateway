import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './noti-send-target.reducer';

export const NotiSendTargetDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const notiSendTargetEntity = useAppSelector(state => state.gateway.notiSendTarget.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="notiSendTargetDetailsHeading">
          <Translate contentKey="gatewayApp.commonserviceNotiSendTarget.detail.title">NotiSendTarget</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="gatewayApp.commonserviceNotiSendTarget.id">Id</Translate>
            </span>
          </dt>
          <dd>{notiSendTargetEntity.id}</dd>
          <dt>
            <span id="notiId">
              <Translate contentKey="gatewayApp.commonserviceNotiSendTarget.notiId">Noti Id</Translate>
            </span>
          </dt>
          <dd>{notiSendTargetEntity.notiId}</dd>
          <dt>
            <span id="targetUserNo">
              <Translate contentKey="gatewayApp.commonserviceNotiSendTarget.targetUserNo">Target User No</Translate>
            </span>
          </dt>
          <dd>{notiSendTargetEntity.targetUserNo}</dd>
          <dt>
            <span id="targetAddress">
              <Translate contentKey="gatewayApp.commonserviceNotiSendTarget.targetAddress">Target Address</Translate>
            </span>
          </dt>
          <dd>{notiSendTargetEntity.targetAddress}</dd>
          <dt>
            <span id="sendMsg">
              <Translate contentKey="gatewayApp.commonserviceNotiSendTarget.sendMsg">Send Msg</Translate>
            </span>
          </dt>
          <dd>{notiSendTargetEntity.sendMsg}</dd>
          <dt>
            <span id="sendStatus">
              <Translate contentKey="gatewayApp.commonserviceNotiSendTarget.sendStatus">Send Status</Translate>
            </span>
          </dt>
          <dd>{notiSendTargetEntity.sendStatus}</dd>
          <dt>
            <span id="sendAt">
              <Translate contentKey="gatewayApp.commonserviceNotiSendTarget.sendAt">Send At</Translate>
            </span>
          </dt>
          <dd>
            {notiSendTargetEntity.sendAt ? <TextFormat value={notiSendTargetEntity.sendAt} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <Translate contentKey="gatewayApp.commonserviceNotiSendTarget.notiSend">Noti Send</Translate>
          </dt>
          <dd>{notiSendTargetEntity.notiSend ? notiSendTargetEntity.notiSend.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/noti-send-target" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/noti-send-target/${notiSendTargetEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default NotiSendTargetDetail;
