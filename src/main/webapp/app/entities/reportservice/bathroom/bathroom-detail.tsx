import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './bathroom.reducer';

export const BathroomDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const bathroomEntity = useAppSelector(state => state.gateway.bathroom.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="bathroomDetailsHeading">
          <Translate contentKey="gatewayApp.reportserviceBathroom.detail.title">Bathroom</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="gatewayApp.reportserviceBathroom.id">Id</Translate>
            </span>
          </dt>
          <dd>{bathroomEntity.id}</dd>
          <dt>
            <span id="reportId">
              <Translate contentKey="gatewayApp.reportserviceBathroom.reportId">Report Id</Translate>
            </span>
          </dt>
          <dd>{bathroomEntity.reportId}</dd>
          <dt>
            <span id="bathroomName">
              <Translate contentKey="gatewayApp.reportserviceBathroom.bathroomName">Bathroom Name</Translate>
            </span>
          </dt>
          <dd>{bathroomEntity.bathroomName}</dd>
          <dt>
            <span id="condtionLevel">
              <Translate contentKey="gatewayApp.reportserviceBathroom.condtionLevel">Condtion Level</Translate>
            </span>
          </dt>
          <dd>{bathroomEntity.condtionLevel}</dd>
          <dt>
            <span id="bathroomSize">
              <Translate contentKey="gatewayApp.reportserviceBathroom.bathroomSize">Bathroom Size</Translate>
            </span>
          </dt>
          <dd>{bathroomEntity.bathroomSize}</dd>
          <dt>
            <span id="waterPressure">
              <Translate contentKey="gatewayApp.reportserviceBathroom.waterPressure">Water Pressure</Translate>
            </span>
          </dt>
          <dd>{bathroomEntity.waterPressure}</dd>
          <dt>
            <span id="showerBoothPresence">
              <Translate contentKey="gatewayApp.reportserviceBathroom.showerBoothPresence">Shower Booth Presence</Translate>
            </span>
          </dt>
          <dd>{bathroomEntity.showerBoothPresence}</dd>
          <dt>
            <span id="bathtubPresence">
              <Translate contentKey="gatewayApp.reportserviceBathroom.bathtubPresence">Bathtub Presence</Translate>
            </span>
          </dt>
          <dd>{bathroomEntity.bathtubPresence}</dd>
          <dt>
            <span id="floorAndCeiling">
              <Translate contentKey="gatewayApp.reportserviceBathroom.floorAndCeiling">Floor And Ceiling</Translate>
            </span>
          </dt>
          <dd>{bathroomEntity.floorAndCeiling}</dd>
          <dt>
            <span id="remarks">
              <Translate contentKey="gatewayApp.reportserviceBathroom.remarks">Remarks</Translate>
            </span>
          </dt>
          <dd>{bathroomEntity.remarks}</dd>
          <dt>
            <Translate contentKey="gatewayApp.reportserviceBathroom.report">Report</Translate>
          </dt>
          <dd>{bathroomEntity.report ? bathroomEntity.report.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/bathroom" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/bathroom/${bathroomEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default BathroomDetail;
