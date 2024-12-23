import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate, ValidatedField, ValidatedForm, isNumber, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities as getNotiTemplates } from 'app/entities/commonservice/noti-template/noti-template.reducer';
import { createEntity, getEntity, reset, updateEntity } from './noti-tpl-variable.reducer';

export const NotiTplVariableUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const notiTemplates = useAppSelector(state => state.gateway.notiTemplate.entities);
  const notiTplVariableEntity = useAppSelector(state => state.gateway.notiTplVariable.entity);
  const loading = useAppSelector(state => state.gateway.notiTplVariable.loading);
  const updating = useAppSelector(state => state.gateway.notiTplVariable.updating);
  const updateSuccess = useAppSelector(state => state.gateway.notiTplVariable.updateSuccess);

  const handleClose = () => {
    navigate(`/noti-tpl-variable${location.search}`);
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
    if (values.defaultValue !== undefined && typeof values.defaultValue !== 'number') {
      values.defaultValue = Number(values.defaultValue);
    }
    values.createdAt = convertDateTimeToServer(values.createdAt);
    values.updatedAt = convertDateTimeToServer(values.updatedAt);

    const entity = {
      ...notiTplVariableEntity,
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
          ...notiTplVariableEntity,
          createdAt: convertDateTimeFromServer(notiTplVariableEntity.createdAt),
          updatedAt: convertDateTimeFromServer(notiTplVariableEntity.updatedAt),
          notiTemplate: notiTplVariableEntity?.notiTemplate?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="gatewayApp.commonserviceNotiTplVariable.home.createOrEditLabel" data-cy="NotiTplVariableCreateUpdateHeading">
            <Translate contentKey="gatewayApp.commonserviceNotiTplVariable.home.createOrEditLabel">
              Create or edit a NotiTplVariable
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
                  id="noti-tpl-variable-id"
                  label={translate('gatewayApp.commonserviceNotiTplVariable.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('gatewayApp.commonserviceNotiTplVariable.variableName')}
                id="noti-tpl-variable-variableName"
                name="variableName"
                data-cy="variableName"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                  maxLength: { value: 255, message: translate('entity.validation.maxlength', { max: 255 }) },
                }}
              />
              <ValidatedField
                label={translate('gatewayApp.commonserviceNotiTplVariable.defaultValue')}
                id="noti-tpl-variable-defaultValue"
                name="defaultValue"
                data-cy="defaultValue"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                  validate: v => isNumber(v) || translate('entity.validation.number'),
                }}
              />
              <ValidatedField
                label={translate('gatewayApp.commonserviceNotiTplVariable.desciption')}
                id="noti-tpl-variable-desciption"
                name="desciption"
                data-cy="desciption"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                  maxLength: { value: 1000, message: translate('entity.validation.maxlength', { max: 1000 }) },
                }}
              />
              <ValidatedField
                label={translate('gatewayApp.commonserviceNotiTplVariable.createdAt')}
                id="noti-tpl-variable-createdAt"
                name="createdAt"
                data-cy="createdAt"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                label={translate('gatewayApp.commonserviceNotiTplVariable.updatedAt')}
                id="noti-tpl-variable-updatedAt"
                name="updatedAt"
                data-cy="updatedAt"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              <ValidatedField
                id="noti-tpl-variable-notiTemplate"
                name="notiTemplate"
                data-cy="notiTemplate"
                label={translate('gatewayApp.commonserviceNotiTplVariable.notiTemplate')}
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
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/noti-tpl-variable" replace color="info">
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

export default NotiTplVariableUpdate;
