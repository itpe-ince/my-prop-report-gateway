import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './infrastructure.reducer';

export const InfrastructureDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const infrastructureEntity = useAppSelector(state => state.gateway.infrastructure.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="infrastructureDetailsHeading">
          <Translate contentKey="gatewayApp.reportserviceInfrastructure.detail.title">Infrastructure</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="gatewayApp.reportserviceInfrastructure.id">Id</Translate>
            </span>
          </dt>
          <dd>{infrastructureEntity.id}</dd>
          <dt>
            <span id="reportId">
              <Translate contentKey="gatewayApp.reportserviceInfrastructure.reportId">Report Id</Translate>
            </span>
          </dt>
          <dd>{infrastructureEntity.reportId}</dd>
          <dt>
            <span id="infraType">
              <Translate contentKey="gatewayApp.reportserviceInfrastructure.infraType">Infra Type</Translate>
            </span>
          </dt>
          <dd>{infrastructureEntity.infraType}</dd>
          <dt>
            <span id="infraName">
              <Translate contentKey="gatewayApp.reportserviceInfrastructure.infraName">Infra Name</Translate>
            </span>
          </dt>
          <dd>{infrastructureEntity.infraName}</dd>
          <dt>
            <span id="conditionLevel">
              <Translate contentKey="gatewayApp.reportserviceInfrastructure.conditionLevel">Condition Level</Translate>
            </span>
          </dt>
          <dd>{infrastructureEntity.conditionLevel}</dd>
          <dt>
            <span id="infraDistance">
              <Translate contentKey="gatewayApp.reportserviceInfrastructure.infraDistance">Infra Distance</Translate>
            </span>
          </dt>
          <dd>{infrastructureEntity.infraDistance}</dd>
          <dt>
            <span id="infraDistanceUnit">
              <Translate contentKey="gatewayApp.reportserviceInfrastructure.infraDistanceUnit">Infra Distance Unit</Translate>
            </span>
          </dt>
          <dd>{infrastructureEntity.infraDistanceUnit}</dd>
          <dt>
            <span id="remarks">
              <Translate contentKey="gatewayApp.reportserviceInfrastructure.remarks">Remarks</Translate>
            </span>
          </dt>
          <dd>{infrastructureEntity.remarks}</dd>
          <dt>
            <Translate contentKey="gatewayApp.reportserviceInfrastructure.report">Report</Translate>
          </dt>
          <dd>{infrastructureEntity.report ? infrastructureEntity.report.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/infrastructure" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/infrastructure/${infrastructureEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default InfrastructureDetail;
