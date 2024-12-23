import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './noti-send-job.reducer';

export const NotiSendJobDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const notiSendJobEntity = useAppSelector(state => state.gateway.notiSendJob.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="notiSendJobDetailsHeading">
          <Translate contentKey="gatewayApp.commonserviceNotiSendJob.detail.title">NotiSendJob</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="gatewayApp.commonserviceNotiSendJob.id">Id</Translate>
            </span>
          </dt>
          <dd>{notiSendJobEntity.id}</dd>
          <dt>
            <span id="jobName">
              <Translate contentKey="gatewayApp.commonserviceNotiSendJob.jobName">Job Name</Translate>
            </span>
          </dt>
          <dd>{notiSendJobEntity.jobName}</dd>
          <dt>
            <span id="jobTime">
              <Translate contentKey="gatewayApp.commonserviceNotiSendJob.jobTime">Job Time</Translate>
            </span>
          </dt>
          <dd>{notiSendJobEntity.jobTime}</dd>
          <dt>
            <span id="jobType">
              <Translate contentKey="gatewayApp.commonserviceNotiSendJob.jobType">Job Type</Translate>
            </span>
          </dt>
          <dd>{notiSendJobEntity.jobType}</dd>
          <dt>
            <span id="jobStartAt">
              <Translate contentKey="gatewayApp.commonserviceNotiSendJob.jobStartAt">Job Start At</Translate>
            </span>
          </dt>
          <dd>{notiSendJobEntity.jobStartAt}</dd>
          <dt>
            <span id="jobEndAt">
              <Translate contentKey="gatewayApp.commonserviceNotiSendJob.jobEndAt">Job End At</Translate>
            </span>
          </dt>
          <dd>{notiSendJobEntity.jobEndAt}</dd>
          <dt>
            <span id="jobStatus">
              <Translate contentKey="gatewayApp.commonserviceNotiSendJob.jobStatus">Job Status</Translate>
            </span>
          </dt>
          <dd>{notiSendJobEntity.jobStatus}</dd>
          <dt>
            <span id="createdAt">
              <Translate contentKey="gatewayApp.commonserviceNotiSendJob.createdAt">Created At</Translate>
            </span>
          </dt>
          <dd>
            {notiSendJobEntity.createdAt ? <TextFormat value={notiSendJobEntity.createdAt} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <span id="updatedAt">
              <Translate contentKey="gatewayApp.commonserviceNotiSendJob.updatedAt">Updated At</Translate>
            </span>
          </dt>
          <dd>
            {notiSendJobEntity.updatedAt ? <TextFormat value={notiSendJobEntity.updatedAt} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <Translate contentKey="gatewayApp.commonserviceNotiSendJob.notiSend">Noti Send</Translate>
          </dt>
          <dd>{notiSendJobEntity.notiSend ? notiSendJobEntity.notiSend.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/noti-send-job" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/noti-send-job/${notiSendJobEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default NotiSendJobDetail;
