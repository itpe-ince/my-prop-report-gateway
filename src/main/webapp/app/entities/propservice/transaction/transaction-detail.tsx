import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './transaction.reducer';

export const TransactionDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const transactionEntity = useAppSelector(state => state.gateway.transaction.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="transactionDetailsHeading">
          <Translate contentKey="gatewayApp.propserviceTransaction.detail.title">Transaction</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="gatewayApp.propserviceTransaction.id">Id</Translate>
            </span>
          </dt>
          <dd>{transactionEntity.id}</dd>
          <dt>
            <span id="propertyId">
              <Translate contentKey="gatewayApp.propserviceTransaction.propertyId">Property Id</Translate>
            </span>
          </dt>
          <dd>{transactionEntity.propertyId}</dd>
          <dt>
            <span id="transactionType">
              <Translate contentKey="gatewayApp.propserviceTransaction.transactionType">Transaction Type</Translate>
            </span>
          </dt>
          <dd>{transactionEntity.transactionType}</dd>
          <dt>
            <span id="price">
              <Translate contentKey="gatewayApp.propserviceTransaction.price">Price</Translate>
            </span>
          </dt>
          <dd>{transactionEntity.price}</dd>
          <dt>
            <span id="transactionDate">
              <Translate contentKey="gatewayApp.propserviceTransaction.transactionDate">Transaction Date</Translate>
            </span>
          </dt>
          <dd>
            {transactionEntity.transactionDate ? (
              <TextFormat value={transactionEntity.transactionDate} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <span id="buyer">
              <Translate contentKey="gatewayApp.propserviceTransaction.buyer">Buyer</Translate>
            </span>
          </dt>
          <dd>{transactionEntity.buyer}</dd>
          <dt>
            <span id="seller">
              <Translate contentKey="gatewayApp.propserviceTransaction.seller">Seller</Translate>
            </span>
          </dt>
          <dd>{transactionEntity.seller}</dd>
          <dt>
            <span id="agent">
              <Translate contentKey="gatewayApp.propserviceTransaction.agent">Agent</Translate>
            </span>
          </dt>
          <dd>{transactionEntity.agent}</dd>
          <dt>
            <span id="createdAt">
              <Translate contentKey="gatewayApp.propserviceTransaction.createdAt">Created At</Translate>
            </span>
          </dt>
          <dd>
            {transactionEntity.createdAt ? <TextFormat value={transactionEntity.createdAt} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <span id="updatedAt">
              <Translate contentKey="gatewayApp.propserviceTransaction.updatedAt">Updated At</Translate>
            </span>
          </dt>
          <dd>
            {transactionEntity.updatedAt ? <TextFormat value={transactionEntity.updatedAt} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
        </dl>
        <Button tag={Link} to="/transaction" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/transaction/${transactionEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default TransactionDetail;
