import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate, ValidatedField, ValidatedForm, isNumber, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { createEntity, getEntity, reset, updateEntity } from './attach-file.reducer';

export const AttachFileUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const attachFileEntity = useAppSelector(state => state.gateway.attachFile.entity);
  const loading = useAppSelector(state => state.gateway.attachFile.loading);
  const updating = useAppSelector(state => state.gateway.attachFile.updating);
  const updateSuccess = useAppSelector(state => state.gateway.attachFile.updateSuccess);

  const handleClose = () => {
    navigate(`/attach-file${location.search}`);
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
    if (values.fileSize !== undefined && typeof values.fileSize !== 'number') {
      values.fileSize = Number(values.fileSize);
    }
    if (values.relId !== undefined && typeof values.relId !== 'number') {
      values.relId = Number(values.relId);
    }
    if (values.relAttachSeq !== undefined && typeof values.relAttachSeq !== 'number') {
      values.relAttachSeq = Number(values.relAttachSeq);
    }
    values.createdAt = convertDateTimeToServer(values.createdAt);

    const entity = {
      ...attachFileEntity,
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
        }
      : {
          ...attachFileEntity,
          createdAt: convertDateTimeFromServer(attachFileEntity.createdAt),
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="gatewayApp.commonserviceAttachFile.home.createOrEditLabel" data-cy="AttachFileCreateUpdateHeading">
            <Translate contentKey="gatewayApp.commonserviceAttachFile.home.createOrEditLabel">Create or edit a AttachFile</Translate>
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
                  id="attach-file-id"
                  label={translate('gatewayApp.commonserviceAttachFile.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('gatewayApp.commonserviceAttachFile.fileName')}
                id="attach-file-fileName"
                name="fileName"
                data-cy="fileName"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                  maxLength: { value: 255, message: translate('entity.validation.maxlength', { max: 255 }) },
                }}
              />
              <ValidatedField
                label={translate('gatewayApp.commonserviceAttachFile.fileOrgName')}
                id="attach-file-fileOrgName"
                name="fileOrgName"
                data-cy="fileOrgName"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                  maxLength: { value: 255, message: translate('entity.validation.maxlength', { max: 255 }) },
                }}
              />
              <ValidatedField
                label={translate('gatewayApp.commonserviceAttachFile.filePath')}
                id="attach-file-filePath"
                name="filePath"
                data-cy="filePath"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                  maxLength: { value: 500, message: translate('entity.validation.maxlength', { max: 500 }) },
                }}
              />
              <ValidatedField
                label={translate('gatewayApp.commonserviceAttachFile.fileSize')}
                id="attach-file-fileSize"
                name="fileSize"
                data-cy="fileSize"
                type="text"
              />
              <ValidatedField
                label={translate('gatewayApp.commonserviceAttachFile.fileType')}
                id="attach-file-fileType"
                name="fileType"
                data-cy="fileType"
                type="text"
                validate={{
                  maxLength: { value: 50, message: translate('entity.validation.maxlength', { max: 50 }) },
                }}
              />
              <ValidatedField
                label={translate('gatewayApp.commonserviceAttachFile.linkUrl')}
                id="attach-file-linkUrl"
                name="linkUrl"
                data-cy="linkUrl"
                type="text"
                validate={{
                  maxLength: { value: 255, message: translate('entity.validation.maxlength', { max: 255 }) },
                }}
              />
              <ValidatedField
                label={translate('gatewayApp.commonserviceAttachFile.source')}
                id="attach-file-source"
                name="source"
                data-cy="source"
                type="text"
                validate={{
                  maxLength: { value: 255, message: translate('entity.validation.maxlength', { max: 255 }) },
                }}
              />
              <ValidatedField
                label={translate('gatewayApp.commonserviceAttachFile.relId')}
                id="attach-file-relId"
                name="relId"
                data-cy="relId"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                  validate: v => isNumber(v) || translate('entity.validation.number'),
                }}
              />
              <ValidatedField
                label={translate('gatewayApp.commonserviceAttachFile.relTitle')}
                id="attach-file-relTitle"
                name="relTitle"
                data-cy="relTitle"
                type="text"
                validate={{
                  maxLength: { value: 255, message: translate('entity.validation.maxlength', { max: 255 }) },
                }}
              />
              <ValidatedField
                label={translate('gatewayApp.commonserviceAttachFile.relAttachSeq')}
                id="attach-file-relAttachSeq"
                name="relAttachSeq"
                data-cy="relAttachSeq"
                type="text"
              />
              <ValidatedField
                label={translate('gatewayApp.commonserviceAttachFile.createdAt')}
                id="attach-file-createdAt"
                name="createdAt"
                data-cy="createdAt"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/attach-file" replace color="info">
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

export default AttachFileUpdate;
