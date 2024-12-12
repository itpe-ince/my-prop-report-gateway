import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate, ValidatedField, ValidatedForm, isNumber, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities as getNotiSends } from 'app/entities/commonservice/noti-send/noti-send.reducer';
import { SendStatusType } from 'app/shared/model/enumerations/send-status-type.model';
import { createEntity, getEntity, reset, updateEntity } from './noti-send-target.reducer';

export const NotiSendTargetUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const notiSends = useAppSelector(state => state.gateway.notiSend.entities);
  const notiSendTargetEntity = useAppSelector(state => state.gateway.notiSendTarget.entity);
  const loading = useAppSelector(state => state.gateway.notiSendTarget.loading);
  const updating = useAppSelector(state => state.gateway.notiSendTarget.updating);
  const updateSuccess = useAppSelector(state => state.gateway.notiSendTarget.updateSuccess);
  const sendStatusTypeValues = Object.keys(SendStatusType);

  const handleClose = () => {
    navigate(`/noti-send-target${location.search}`);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getNotiSends({}));
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
    if (values.notiId !== undefined && typeof values.notiId !== 'number') {
      values.notiId = Number(values.notiId);
    }
    if (values.targetUserNo !== undefined && typeof values.targetUserNo !== 'number') {
      values.targetUserNo = Number(values.targetUserNo);
    }
    values.sendAt = convertDateTimeToServer(values.sendAt);

    const entity = {
      ...notiSendTargetEntity,
      ...values,
      notiSend: notiSends.find(it => it.id.toString() === values.notiSend?.toString()),
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {
          sendAt: displayDefaultDateTime(),
        }
      : {
          sendStatus: 'PENDING',
          ...notiSendTargetEntity,
          sendAt: convertDateTimeFromServer(notiSendTargetEntity.sendAt),
          notiSend: notiSendTargetEntity?.notiSend?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="gatewayApp.commonserviceNotiSendTarget.home.createOrEditLabel" data-cy="NotiSendTargetCreateUpdateHeading">
            <Translate contentKey="gatewayApp.commonserviceNotiSendTarget.home.createOrEditLabel">
              Create or edit a NotiSendTarget
            </Translate>
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
                  id="noti-send-target-id"
                  label={translate('gatewayApp.commonserviceNotiSendTarget.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('gatewayApp.commonserviceNotiSendTarget.notiId')}
                id="noti-send-target-notiId"
                name="notiId"
                data-cy="notiId"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                  validate: v => isNumber(v) || translate('entity.validation.number'),
                }}
              />
              <ValidatedField
                label={translate('gatewayApp.commonserviceNotiSendTarget.targetUserNo')}
                id="noti-send-target-targetUserNo"
                name="targetUserNo"
                data-cy="targetUserNo"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                  validate: v => isNumber(v) || translate('entity.validation.number'),
                }}
              />
              <ValidatedField
                label={translate('gatewayApp.commonserviceNotiSendTarget.targetAddress')}
                id="noti-send-target-targetAddress"
                name="targetAddress"
                data-cy="targetAddress"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                  maxLength: { value: 255, message: translate('entity.validation.maxlength', { max: 255 }) },
                }}
              />
              <ValidatedField
                label={translate('gatewayApp.commonserviceNotiSendTarget.sendMsg')}
                id="noti-send-target-sendMsg"
                name="sendMsg"
                data-cy="sendMsg"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                  maxLength: { value: 2000, message: translate('entity.validation.maxlength', { max: 2000 }) },
                }}
              />
              <ValidatedField
                label={translate('gatewayApp.commonserviceNotiSendTarget.sendStatus')}
                id="noti-send-target-sendStatus"
                name="sendStatus"
                data-cy="sendStatus"
                type="select"
              >
                {sendStatusTypeValues.map(sendStatusType => (
                  <option value={sendStatusType} key={sendStatusType}>
                    {translate(`gatewayApp.SendStatusType.${sendStatusType}`)}
                  </option>
                ))}
              </ValidatedField>
              <ValidatedField
                label={translate('gatewayApp.commonserviceNotiSendTarget.sendAt')}
                id="noti-send-target-sendAt"
                name="sendAt"
                data-cy="sendAt"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                id="noti-send-target-notiSend"
                name="notiSend"
                data-cy="notiSend"
                label={translate('gatewayApp.commonserviceNotiSendTarget.notiSend')}
                type="select"
              >
                <option value="" key="0" />
                {notiSends
                  ? notiSends.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/noti-send-target" replace color="info">
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

export default NotiSendTargetUpdate;
