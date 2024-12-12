import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './entrance.reducer';

export const EntranceDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const entranceEntity = useAppSelector(state => state.gateway.entrance.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="entranceDetailsHeading">
          <Translate contentKey="gatewayApp.reportserviceEntrance.detail.title">Entrance</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="gatewayApp.reportserviceEntrance.id">Id</Translate>
            </span>
          </dt>
          <dd>{entranceEntity.id}</dd>
          <dt>
            <span id="reportId">
              <Translate contentKey="gatewayApp.reportserviceEntrance.reportId">Report Id</Translate>
            </span>
          </dt>
          <dd>{entranceEntity.reportId}</dd>
          <dt>
            <span id="entranceName">
              <Translate contentKey="gatewayApp.reportserviceEntrance.entranceName">Entrance Name</Translate>
            </span>
          </dt>
          <dd>{entranceEntity.entranceName}</dd>
          <dt>
            <span id="condtionLevel">
              <Translate contentKey="gatewayApp.reportserviceEntrance.condtionLevel">Condtion Level</Translate>
            </span>
          </dt>
          <dd>{entranceEntity.condtionLevel}</dd>
          <dt>
            <span id="entranceSize">
              <Translate contentKey="gatewayApp.reportserviceEntrance.entranceSize">Entrance Size</Translate>
            </span>
          </dt>
          <dd>{entranceEntity.entranceSize}</dd>
          <dt>
            <span id="shoeRackSize">
              <Translate contentKey="gatewayApp.reportserviceEntrance.shoeRackSize">Shoe Rack Size</Translate>
            </span>
          </dt>
          <dd>{entranceEntity.shoeRackSize}</dd>
          <dt>
            <span id="pantryPresence">
              <Translate contentKey="gatewayApp.reportserviceEntrance.pantryPresence">Pantry Presence</Translate>
            </span>
          </dt>
          <dd>{entranceEntity.pantryPresence}</dd>
          <dt>
            <span id="remarks">
              <Translate contentKey="gatewayApp.reportserviceEntrance.remarks">Remarks</Translate>
            </span>
          </dt>
          <dd>{entranceEntity.remarks}</dd>
          <dt>
            <Translate contentKey="gatewayApp.reportserviceEntrance.report">Report</Translate>
          </dt>
          <dd>{entranceEntity.report ? entranceEntity.report.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/entrance" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/entrance/${entranceEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default EntranceDetail;
