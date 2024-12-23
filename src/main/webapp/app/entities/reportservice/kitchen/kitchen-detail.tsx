import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './kitchen.reducer';

export const KitchenDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const kitchenEntity = useAppSelector(state => state.gateway.kitchen.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="kitchenDetailsHeading">
          <Translate contentKey="gatewayApp.reportserviceKitchen.detail.title">Kitchen</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="gatewayApp.reportserviceKitchen.id">Id</Translate>
            </span>
          </dt>
          <dd>{kitchenEntity.id}</dd>
          <dt>
            <span id="kitchenName">
              <Translate contentKey="gatewayApp.reportserviceKitchen.kitchenName">Kitchen Name</Translate>
            </span>
          </dt>
          <dd>{kitchenEntity.kitchenName}</dd>
          <dt>
            <span id="conditionLevel">
              <Translate contentKey="gatewayApp.reportserviceKitchen.conditionLevel">Condition Level</Translate>
            </span>
          </dt>
          <dd>{kitchenEntity.conditionLevel}</dd>
          <dt>
            <span id="builtInCabinet">
              <Translate contentKey="gatewayApp.reportserviceKitchen.builtInCabinet">Built In Cabinet</Translate>
            </span>
          </dt>
          <dd>{kitchenEntity.builtInCabinet}</dd>
          <dt>
            <span id="sinkCondition">
              <Translate contentKey="gatewayApp.reportserviceKitchen.sinkCondition">Sink Condition</Translate>
            </span>
          </dt>
          <dd>{kitchenEntity.sinkCondition}</dd>
          <dt>
            <span id="ventilationSystem">
              <Translate contentKey="gatewayApp.reportserviceKitchen.ventilationSystem">Ventilation System</Translate>
            </span>
          </dt>
          <dd>{kitchenEntity.ventilationSystem}</dd>
          <dt>
            <span id="applianceProvision">
              <Translate contentKey="gatewayApp.reportserviceKitchen.applianceProvision">Appliance Provision</Translate>
            </span>
          </dt>
          <dd>{kitchenEntity.applianceProvision}</dd>
          <dt>
            <span id="remarks">
              <Translate contentKey="gatewayApp.reportserviceKitchen.remarks">Remarks</Translate>
            </span>
          </dt>
          <dd>{kitchenEntity.remarks}</dd>
          <dt>
            <Translate contentKey="gatewayApp.reportserviceKitchen.report">Report</Translate>
          </dt>
          <dd>{kitchenEntity.report ? kitchenEntity.report.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/kitchen" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/kitchen/${kitchenEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default KitchenDetail;
