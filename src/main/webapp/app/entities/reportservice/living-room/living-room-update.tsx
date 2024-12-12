import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate, ValidatedField, ValidatedForm, isNumber, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities as getReports } from 'app/entities/reportservice/report/report.reducer';
import { QualityStateType } from 'app/shared/model/enumerations/quality-state-type.model';
import { createEntity, getEntity, reset, updateEntity } from './living-room.reducer';

export const LivingRoomUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const reports = useAppSelector(state => state.gateway.report.entities);
  const livingRoomEntity = useAppSelector(state => state.gateway.livingRoom.entity);
  const loading = useAppSelector(state => state.gateway.livingRoom.loading);
  const updating = useAppSelector(state => state.gateway.livingRoom.updating);
  const updateSuccess = useAppSelector(state => state.gateway.livingRoom.updateSuccess);
  const qualityStateTypeValues = Object.keys(QualityStateType);

  const handleClose = () => {
    navigate(`/living-room${location.search}`);
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
    if (values.roomSize !== undefined && typeof values.roomSize !== 'number') {
      values.roomSize = Number(values.roomSize);
    }

    const entity = {
      ...livingRoomEntity,
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
          conditionLevel: 'HIGH',
          wallState: 'HIGH',
          ...livingRoomEntity,
          report: livingRoomEntity?.report?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="gatewayApp.reportserviceLivingRoom.home.createOrEditLabel" data-cy="LivingRoomCreateUpdateHeading">
            <Translate contentKey="gatewayApp.reportserviceLivingRoom.home.createOrEditLabel">Create or edit a LivingRoom</Translate>
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
                  id="living-room-id"
                  label={translate('gatewayApp.reportserviceLivingRoom.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('gatewayApp.reportserviceLivingRoom.reportId')}
                id="living-room-reportId"
                name="reportId"
                data-cy="reportId"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                  validate: v => isNumber(v) || translate('entity.validation.number'),
                }}
              />
              <ValidatedField
                label={translate('gatewayApp.reportserviceLivingRoom.livingRoomName')}
                id="living-room-livingRoomName"
                name="livingRoomName"
                data-cy="livingRoomName"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                  maxLength: { value: 100, message: translate('entity.validation.maxlength', { max: 100 }) },
                }}
              />
              <ValidatedField
                label={translate('gatewayApp.reportserviceLivingRoom.conditionLevel')}
                id="living-room-conditionLevel"
                name="conditionLevel"
                data-cy="conditionLevel"
                type="select"
              >
                {qualityStateTypeValues.map(qualityStateType => (
                  <option value={qualityStateType} key={qualityStateType}>
                    {translate(`gatewayApp.QualityStateType.${qualityStateType}`)}
                  </option>
                ))}
              </ValidatedField>
              <ValidatedField
                label={translate('gatewayApp.reportserviceLivingRoom.roomSize')}
                id="living-room-roomSize"
                name="roomSize"
                data-cy="roomSize"
                type="text"
              />
              <ValidatedField
                label={translate('gatewayApp.reportserviceLivingRoom.wallState')}
                id="living-room-wallState"
                name="wallState"
                data-cy="wallState"
                type="select"
              >
                {qualityStateTypeValues.map(qualityStateType => (
                  <option value={qualityStateType} key={qualityStateType}>
                    {translate(`gatewayApp.QualityStateType.${qualityStateType}`)}
                  </option>
                ))}
              </ValidatedField>
              <ValidatedField
                label={translate('gatewayApp.reportserviceLivingRoom.floorMaterial')}
                id="living-room-floorMaterial"
                name="floorMaterial"
                data-cy="floorMaterial"
                type="text"
                validate={{
                  maxLength: { value: 100, message: translate('entity.validation.maxlength', { max: 100 }) },
                }}
              />
              <ValidatedField
                label={translate('gatewayApp.reportserviceLivingRoom.sunlight')}
                id="living-room-sunlight"
                name="sunlight"
                data-cy="sunlight"
                type="text"
                validate={{
                  maxLength: { value: 100, message: translate('entity.validation.maxlength', { max: 100 }) },
                }}
              />
              <ValidatedField
                label={translate('gatewayApp.reportserviceLivingRoom.remarks')}
                id="living-room-remarks"
                name="remarks"
                data-cy="remarks"
                type="text"
              />
              <ValidatedField
                id="living-room-report"
                name="report"
                data-cy="report"
                label={translate('gatewayApp.reportserviceLivingRoom.report')}
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
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/living-room" replace color="info">
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

export default LivingRoomUpdate;
