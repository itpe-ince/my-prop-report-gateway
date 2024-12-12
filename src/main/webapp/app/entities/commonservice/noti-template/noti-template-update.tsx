import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate, ValidatedField, ValidatedForm, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { TemplateFormatType } from 'app/shared/model/enumerations/template-format-type.model';
import { createEntity, getEntity, reset, updateEntity } from './noti-template.reducer';

export const NotiTemplateUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const notiTemplateEntity = useAppSelector(state => state.gateway.notiTemplate.entity);
  const loading = useAppSelector(state => state.gateway.notiTemplate.loading);
  const updating = useAppSelector(state => state.gateway.notiTemplate.updating);
  const updateSuccess = useAppSelector(state => state.gateway.notiTemplate.updateSuccess);
  const templateFormatTypeValues = Object.keys(TemplateFormatType);

  const handleClose = () => {
    navigate(`/noti-template${location.search}`);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }
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
    values.createdAt = convertDateTimeToServer(values.createdAt);
    values.updatedAt = convertDateTimeToServer(values.updatedAt);

    const entity = {
      ...notiTemplateEntity,
      ...values,
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
          templateFormat: 'HTML',
          ...notiTemplateEntity,
          createdAt: convertDateTimeFromServer(notiTemplateEntity.createdAt),
          updatedAt: convertDateTimeFromServer(notiTemplateEntity.updatedAt),
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="gatewayApp.commonserviceNotiTemplate.home.createOrEditLabel" data-cy="NotiTemplateCreateUpdateHeading">
            <Translate contentKey="gatewayApp.commonserviceNotiTemplate.home.createOrEditLabel">Create or edit a NotiTemplate</Translate>
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
                  id="noti-template-id"
                  label={translate('gatewayApp.commonserviceNotiTemplate.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('gatewayApp.commonserviceNotiTemplate.templateTitle')}
                id="noti-template-templateTitle"
                name="templateTitle"
                data-cy="templateTitle"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                  maxLength: { value: 255, message: translate('entity.validation.maxlength', { max: 255 }) },
                }}
              />
              <ValidatedField
                label={translate('gatewayApp.commonserviceNotiTemplate.templateBody')}
                id="noti-template-templateBody"
                name="templateBody"
                data-cy="templateBody"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                  maxLength: { value: 1000, message: translate('entity.validation.maxlength', { max: 1000 }) },
                }}
              />
              <ValidatedField
                label={translate('gatewayApp.commonserviceNotiTemplate.templateFormat')}
                id="noti-template-templateFormat"
                name="templateFormat"
                data-cy="templateFormat"
                type="select"
              >
                {templateFormatTypeValues.map(templateFormatType => (
                  <option value={templateFormatType} key={templateFormatType}>
                    {translate(`gatewayApp.TemplateFormatType.${templateFormatType}`)}
                  </option>
                ))}
              </ValidatedField>
              <ValidatedField
                label={translate('gatewayApp.commonserviceNotiTemplate.createdAt')}
                id="noti-template-createdAt"
                name="createdAt"
                data-cy="createdAt"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                label={translate('gatewayApp.commonserviceNotiTemplate.updatedAt')}
                id="noti-template-updatedAt"
                name="updatedAt"
                data-cy="updatedAt"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/noti-template" replace color="info">
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

export default NotiTemplateUpdate;
