import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './property.reducer';

export const PropertyDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const propertyEntity = useAppSelector(state => state.gateway.property.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="propertyDetailsHeading">
          <Translate contentKey="gatewayApp.propserviceProperty.detail.title">Property</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="gatewayApp.propserviceProperty.id">Id</Translate>
            </span>
          </dt>
          <dd>{propertyEntity.id}</dd>
          <dt>
            <span id="address">
              <Translate contentKey="gatewayApp.propserviceProperty.address">Address</Translate>
            </span>
          </dt>
          <dd>{propertyEntity.address}</dd>
          <dt>
            <span id="regionCd">
              <Translate contentKey="gatewayApp.propserviceProperty.regionCd">Region Cd</Translate>
            </span>
          </dt>
          <dd>{propertyEntity.regionCd}</dd>
          <dt>
            <span id="localName">
              <Translate contentKey="gatewayApp.propserviceProperty.localName">Local Name</Translate>
            </span>
          </dt>
          <dd>{propertyEntity.localName}</dd>
          <dt>
            <span id="street">
              <Translate contentKey="gatewayApp.propserviceProperty.street">Street</Translate>
            </span>
          </dt>
          <dd>{propertyEntity.street}</dd>
          <dt>
            <span id="floor">
              <Translate contentKey="gatewayApp.propserviceProperty.floor">Floor</Translate>
            </span>
          </dt>
          <dd>{propertyEntity.floor}</dd>
          <dt>
            <span id="type">
              <Translate contentKey="gatewayApp.propserviceProperty.type">Type</Translate>
            </span>
          </dt>
          <dd>{propertyEntity.type}</dd>
          <dt>
            <span id="area">
              <Translate contentKey="gatewayApp.propserviceProperty.area">Area</Translate>
            </span>
          </dt>
          <dd>{propertyEntity.area}</dd>
          <dt>
            <span id="rooms">
              <Translate contentKey="gatewayApp.propserviceProperty.rooms">Rooms</Translate>
            </span>
          </dt>
          <dd>{propertyEntity.rooms}</dd>
          <dt>
            <span id="bathrooms">
              <Translate contentKey="gatewayApp.propserviceProperty.bathrooms">Bathrooms</Translate>
            </span>
          </dt>
          <dd>{propertyEntity.bathrooms}</dd>
          <dt>
            <span id="buildYear">
              <Translate contentKey="gatewayApp.propserviceProperty.buildYear">Build Year</Translate>
            </span>
          </dt>
          <dd>{propertyEntity.buildYear}</dd>
          <dt>
            <span id="parkingYn">
              <Translate contentKey="gatewayApp.propserviceProperty.parkingYn">Parking Yn</Translate>
            </span>
          </dt>
          <dd>{propertyEntity.parkingYn}</dd>
          <dt>
            <span id="description">
              <Translate contentKey="gatewayApp.propserviceProperty.description">Description</Translate>
            </span>
          </dt>
          <dd>{propertyEntity.description}</dd>
          <dt>
            <span id="createdAt">
              <Translate contentKey="gatewayApp.propserviceProperty.createdAt">Created At</Translate>
            </span>
          </dt>
          <dd>{propertyEntity.createdAt ? <TextFormat value={propertyEntity.createdAt} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="updatedAt">
              <Translate contentKey="gatewayApp.propserviceProperty.updatedAt">Updated At</Translate>
            </span>
          </dt>
          <dd>{propertyEntity.updatedAt ? <TextFormat value={propertyEntity.updatedAt} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <Translate contentKey="gatewayApp.propserviceProperty.complex">Complex</Translate>
          </dt>
          <dd>{propertyEntity.complex ? propertyEntity.complex.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/property" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/property/${propertyEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default PropertyDetail;
