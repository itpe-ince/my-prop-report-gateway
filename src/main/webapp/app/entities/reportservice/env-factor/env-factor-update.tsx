import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate, ValidatedField, ValidatedForm, isNumber, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities as getReports } from 'app/entities/reportservice/report/report.reducer';
import { createEntity, getEntity, reset, updateEntity } from './env-factor.reducer';

export const EnvFactorUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const reports = useAppSelector(state => state.gateway.report.entities);
  const envFactorEntity = useAppSelector(state => state.gateway.envFactor.entity);
  const loading = useAppSelector(state => state.gateway.envFactor.loading);
  const updating = useAppSelector(state => state.gateway.envFactor.updating);
  const updateSuccess = useAppSelector(state => state.gateway.envFactor.updateSuccess);

  const handleClose = () => {
    navigate(`/env-factor${location.search}`);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getReports({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    if (values.id !== undefined && typeof values.id !== 'number') {
      values.id = Number(values.id);
    }
    if (values.reportId !== undefined && typeof values.reportId !== 'number') {
      values.reportId = Number(values.reportId);
    }
    if (values.envFactorDistance !== undefined && typeof values.envFactorDistance !== 'number') {
      values.envFactorDistance = Number(values.envFactorDistance);
    }

    const entity = {
      ...envFactorEntity,
      ...values,
      report: reports.find(it => it.id.toString() === values.report?.toString()),
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {}
      : {
          ...envFactorEntity,
          report: envFactorEntity?.report?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="gatewayApp.reportserviceEnvFactor.home.createOrEditLabel" data-cy="EnvFactorCreateUpdateHeading">
            <Translate contentKey="gatewayApp.reportserviceEnvFactor.home.createOrEditLabel">Create or edit a EnvFactor</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew ? (
                <ValidatedField
                  name="id"
                  required
                  readOnly
                  id="env-factor-id"
                  label={translate('gatewayApp.reportserviceEnvFactor.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('gatewayApp.reportserviceEnvFactor.reportId')}
                id="env-factor-reportId"
                name="reportId"
                data-cy="reportId"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                  validate: v => isNumber(v) || translate('entity.validation.number'),
                }}
              />
              <ValidatedField
                label={translate('gatewayApp.reportserviceEnvFactor.envFactorName')}
                id="env-factor-envFactorName"
                name="envFactorName"
                data-cy="envFactorName"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                  maxLength: { value: 100, message: translate('entity.validation.maxlength', { max: 100 }) },
                }}
              />
              <ValidatedField
                label={translate('gatewayApp.reportserviceEnvFactor.envFactorDistance')}
                id="env-factor-envFactorDistance"
                name="envFactorDistance"
                data-cy="envFactorDistance"
                type="text"
              />
              <ValidatedField
                label={translate('gatewayApp.reportserviceEnvFactor.remarks')}
                id="env-factor-remarks"
                name="remarks"
                data-cy="remarks"
                type="text"
              />
              <ValidatedField
                id="env-factor-report"
                name="report"
                data-cy="report"
                label={translate('gatewayApp.reportserviceEnvFactor.report')}
                type="select"
              >
                <option value="" key="0" />
                {reports
                  ? reports.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/env-factor" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </ValidatedForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default EnvFactorUpdate;
