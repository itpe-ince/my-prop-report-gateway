import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './living-room.reducer';

export const LivingRoomDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const livingRoomEntity = useAppSelector(state => state.gateway.livingRoom.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="livingRoomDetailsHeading">
          <Translate contentKey="gatewayApp.reportserviceLivingRoom.detail.title">LivingRoom</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="gatewayApp.reportserviceLivingRoom.id">Id</Translate>
            </span>
          </dt>
          <dd>{livingRoomEntity.id}</dd>
          <dt>
            <span id="reportId">
              <Translate contentKey="gatewayApp.reportserviceLivingRoom.reportId">Report Id</Translate>
            </span>
          </dt>
          <dd>{livingRoomEntity.reportId}</dd>
          <dt>
            <span id="livingRoomName">
              <Translate contentKey="gatewayApp.reportserviceLivingRoom.livingRoomName">Living Room Name</Translate>
            </span>
          </dt>
          <dd>{livingRoomEntity.livingRoomName}</dd>
          <dt>
            <span id="conditionLevel">
              <Translate contentKey="gatewayApp.reportserviceLivingRoom.conditionLevel">Condition Level</Translate>
            </span>
          </dt>
          <dd>{livingRoomEntity.conditionLevel}</dd>
          <dt>
            <span id="roomSize">
              <Translate contentKey="gatewayApp.reportserviceLivingRoom.roomSize">Room Size</Translate>
            </span>
          </dt>
          <dd>{livingRoomEntity.roomSize}</dd>
          <dt>
            <span id="wallState">
              <Translate contentKey="gatewayApp.reportserviceLivingRoom.wallState">Wall State</Translate>
            </span>
          </dt>
          <dd>{livingRoomEntity.wallState}</dd>
          <dt>
            <span id="floorMaterial">
              <Translate contentKey="gatewayApp.reportserviceLivingRoom.floorMaterial">Floor Material</Translate>
            </span>
          </dt>
          <dd>{livingRoomEntity.floorMaterial}</dd>
          <dt>
            <span id="sunlight">
              <Translate contentKey="gatewayApp.reportserviceLivingRoom.sunlight">Sunlight</Translate>
            </span>
          </dt>
          <dd>{livingRoomEntity.sunlight}</dd>
          <dt>
            <span id="remarks">
              <Translate contentKey="gatewayApp.reportserviceLivingRoom.remarks">Remarks</Translate>
            </span>
          </dt>
          <dd>{livingRoomEntity.remarks}</dd>
          <dt>
            <Translate contentKey="gatewayApp.reportserviceLivingRoom.report">Report</Translate>
          </dt>
          <dd>{livingRoomEntity.report ? livingRoomEntity.report.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/living-room" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/living-room/${livingRoomEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default LivingRoomDetail;
