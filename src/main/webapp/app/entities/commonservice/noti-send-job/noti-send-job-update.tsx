import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate, ValidatedField, ValidatedForm, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities as getNotiSends } from 'app/entities/commonservice/noti-send/noti-send.reducer';
import { JobType } from 'app/shared/model/enumerations/job-type.model';
import { JobStatusType } from 'app/shared/model/enumerations/job-status-type.model';
import { createEntity, getEntity, reset, updateEntity } from './noti-send-job.reducer';

export const NotiSendJobUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const notiSends = useAppSelector(state => state.gateway.notiSend.entities);
  const notiSendJobEntity = useAppSelector(state => state.gateway.notiSendJob.entity);
  const loading = useAppSelector(state => state.gateway.notiSendJob.loading);
  const updating = useAppSelector(state => state.gateway.notiSendJob.updating);
  const updateSuccess = useAppSelector(state => state.gateway.notiSendJob.updateSuccess);
  const jobTypeValues = Object.keys(JobType);
  const jobStatusTypeValues = Object.keys(JobStatusType);

  const handleClose = () => {
    navigate(`/noti-send-job${location.search}`);
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
    values.createdAt = convertDateTimeToServer(values.createdAt);
    values.updatedAt = convertDateTimeToServer(values.updatedAt);

    const entity = {
      ...notiSendJobEntity,
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
          createdAt: displayDefaultDateTime(),
          updatedAt: displayDefaultDateTime(),
        }
      : {
          jobType: 'RESERVE',
          jobStatus: 'ACTIVE',
          ...notiSendJobEntity,
          createdAt: convertDateTimeFromServer(notiSendJobEntity.createdAt),
          updatedAt: convertDateTimeFromServer(notiSendJobEntity.updatedAt),
          notiSend: notiSendJobEntity?.notiSend?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="gatewayApp.commonserviceNotiSendJob.home.createOrEditLabel" data-cy="NotiSendJobCreateUpdateHeading">
            <Translate contentKey="gatewayApp.commonserviceNotiSendJob.home.createOrEditLabel">Create or edit a NotiSendJob</Translate>
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
                  id="noti-send-job-id"
                  label={translate('gatewayApp.commonserviceNotiSendJob.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('gatewayApp.commonserviceNotiSendJob.jobName')}
                id="noti-send-job-jobName"
                name="jobName"
                data-cy="jobName"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                  maxLength: { value: 255, message: translate('entity.validation.maxlength', { max: 255 }) },
                }}
              />
              <ValidatedField
                label={translate('gatewayApp.commonserviceNotiSendJob.jobTime')}
                id="noti-send-job-jobTime"
                name="jobTime"
                data-cy="jobTime"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                  maxLength: { value: 20, message: translate('entity.validation.maxlength', { max: 20 }) },
                }}
              />
              <ValidatedField
                label={translate('gatewayApp.commonserviceNotiSendJob.jobType')}
                id="noti-send-job-jobType"
                name="jobType"
                data-cy="jobType"
                type="select"
              >
                {jobTypeValues.map(jobType => (
                  <option value={jobType} key={jobType}>
                    {translate(`gatewayApp.JobType.${jobType}`)}
                  </option>
                ))}
              </ValidatedField>
              <ValidatedField
                label={translate('gatewayApp.commonserviceNotiSendJob.jobStartAt')}
                id="noti-send-job-jobStartAt"
                name="jobStartAt"
                data-cy="jobStartAt"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                  maxLength: { value: 500, message: translate('entity.validation.maxlength', { max: 500 }) },
                }}
              />
              <ValidatedField
                label={translate('gatewayApp.commonserviceNotiSendJob.jobEndAt')}
                id="noti-send-job-jobEndAt"
                name="jobEndAt"
                data-cy="jobEndAt"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                  maxLength: { value: 500, message: translate('entity.validation.maxlength', { max: 500 }) },
                }}
              />
              <ValidatedField
                label={translate('gatewayApp.commonserviceNotiSendJob.jobStatus')}
                id="noti-send-job-jobStatus"
                name="jobStatus"
                data-cy="jobStatus"
                type="select"
              >
                {jobStatusTypeValues.map(jobStatusType => (
                  <option value={jobStatusType} key={jobStatusType}>
                    {translate(`gatewayApp.JobStatusType.${jobStatusType}`)}
                  </option>
                ))}
              </ValidatedField>
              <ValidatedField
                label={translate('gatewayApp.commonserviceNotiSendJob.createdAt')}
                id="noti-send-job-createdAt"
                name="createdAt"
                data-cy="createdAt"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                label={translate('gatewayApp.commonserviceNotiSendJob.updatedAt')}
                id="noti-send-job-updatedAt"
                name="updatedAt"
                data-cy="updatedAt"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              <ValidatedField
                id="noti-send-job-notiSend"
                name="notiSend"
                data-cy="notiSend"
                label={translate('gatewayApp.commonserviceNotiSendJob.notiSend')}
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
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/noti-send-job" replace color="info">
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

export default NotiSendJobUpdate;
