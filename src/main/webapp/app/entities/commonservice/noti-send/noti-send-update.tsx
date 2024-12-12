import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate, ValidatedField, ValidatedForm, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities as getNotiTemplates } from 'app/entities/commonservice/noti-template/noti-template.reducer';
import { NotiType } from 'app/shared/model/enumerations/noti-type.model';
import { createEntity, getEntity, reset, updateEntity } from './noti-send.reducer';

export const NotiSendUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const notiTemplates = useAppSelector(state => state.gateway.notiTemplate.entities);
  const notiSendEntity = useAppSelector(state => state.gateway.notiSend.entity);
  const loading = useAppSelector(state => state.gateway.notiSend.loading);
  const updating = useAppSelector(state => state.gateway.notiSend.updating);
  const updateSuccess = useAppSelector(state => state.gateway.notiSend.updateSuccess);
  const notiTypeValues = Object.keys(NotiType);

  const handleClose = () => {
    navigate(`/noti-send${location.search}`);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getNotiTemplates({}));
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
    if (values.notiTemplateId !== undefined && typeof values.notiTemplateId !== 'number') {
      values.notiTemplateId = Number(values.notiTemplateId);
    }
    values.createdAt = convertDateTimeToServer(values.createdAt);
    values.updatedAt = convertDateTimeToServer(values.updatedAt);

    const entity = {
      ...notiSendEntity,
      ...values,
      notiTemplate: notiTemplates.find(it => it.id.toString() === values.notiTemplate?.toString()),
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
          createdAt: displayDefaultDateTime(),
          updatedAt: displayDefaultDateTime(),
        }
      : {
          notiType: 'WEB',
          ...notiSendEntity,
          createdAt: convertDateTimeFromServer(notiSendEntity.createdAt),
          updatedAt: convertDateTimeFromServer(notiSendEntity.updatedAt),
          notiTemplate: notiSendEntity?.notiTemplate?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="gatewayApp.commonserviceNotiSend.home.createOrEditLabel" data-cy="NotiSendCreateUpdateHeading">
            <Translate contentKey="gatewayApp.commonserviceNotiSend.home.createOrEditLabel">Create or edit a NotiSend</Translate>
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
                  id="noti-send-id"
                  label={translate('gatewayApp.commonserviceNotiSend.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('gatewayApp.commonserviceNotiSend.notiName')}
                id="noti-send-notiName"
                name="notiName"
                data-cy="notiName"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                  maxLength: { value: 255, message: translate('entity.validation.maxlength', { max: 255 }) },
                }}
              />
              <ValidatedField
                label={translate('gatewayApp.commonserviceNotiSend.notiType')}
                id="noti-send-notiType"
                name="notiType"
                data-cy="notiType"
                type="select"
              >
                {notiTypeValues.map(notiType => (
                  <option value={notiType} key={notiType}>
                    {translate(`gatewayApp.NotiType.${notiType}`)}
                  </option>
                ))}
              </ValidatedField>
              <ValidatedField
                label={translate('gatewayApp.commonserviceNotiSend.notiTemplateId')}
                id="noti-send-notiTemplateId"
                name="notiTemplateId"
                data-cy="notiTemplateId"
                type="text"
              />
              <ValidatedField
                label={translate('gatewayApp.commonserviceNotiSend.notiMsg')}
                id="noti-send-notiMsg"
                name="notiMsg"
                data-cy="notiMsg"
                type="text"
                validate={{
                  maxLength: { value: 2000, message: translate('entity.validation.maxlength', { max: 2000 }) },
                }}
              />
              <ValidatedField
                label={translate('gatewayApp.commonserviceNotiSend.createdAt')}
                id="noti-send-createdAt"
                name="createdAt"
                data-cy="createdAt"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              <ValidatedField
                label={translate('gatewayApp.commonserviceNotiSend.updatedAt')}
                id="noti-send-updatedAt"
                name="updatedAt"
                data-cy="updatedAt"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              <ValidatedField
                id="noti-send-notiTemplate"
                name="notiTemplate"
                data-cy="notiTemplate"
                label={translate('gatewayApp.commonserviceNotiSend.notiTemplate')}
                type="select"
              >
                <option value="" key="0" />
                {notiTemplates
                  ? notiTemplates.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/noti-send" replace color="info">
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

export default NotiSendUpdate;
