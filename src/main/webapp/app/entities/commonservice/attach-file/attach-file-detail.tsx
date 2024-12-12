import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './attach-file.reducer';

export const AttachFileDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const attachFileEntity = useAppSelector(state => state.gateway.attachFile.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="attachFileDetailsHeading">
          <Translate contentKey="gatewayApp.commonserviceAttachFile.detail.title">AttachFile</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="gatewayApp.commonserviceAttachFile.id">Id</Translate>
            </span>
          </dt>
          <dd>{attachFileEntity.id}</dd>
          <dt>
            <span id="fileName">
              <Translate contentKey="gatewayApp.commonserviceAttachFile.fileName">File Name</Translate>
            </span>
          </dt>
          <dd>{attachFileEntity.fileName}</dd>
          <dt>
            <span id="fileOrgName">
              <Translate contentKey="gatewayApp.commonserviceAttachFile.fileOrgName">File Org Name</Translate>
            </span>
          </dt>
          <dd>{attachFileEntity.fileOrgName}</dd>
          <dt>
            <span id="filePath">
              <Translate contentKey="gatewayApp.commonserviceAttachFile.filePath">File Path</Translate>
            </span>
          </dt>
          <dd>{attachFileEntity.filePath}</dd>
          <dt>
            <span id="fileSize">
              <Translate contentKey="gatewayApp.commonserviceAttachFile.fileSize">File Size</Translate>
            </span>
          </dt>
          <dd>{attachFileEntity.fileSize}</dd>
          <dt>
            <span id="fileType">
              <Translate contentKey="gatewayApp.commonserviceAttachFile.fileType">File Type</Translate>
            </span>
          </dt>
          <dd>{attachFileEntity.fileType}</dd>
          <dt>
            <span id="linkUrl">
              <Translate contentKey="gatewayApp.commonserviceAttachFile.linkUrl">Link Url</Translate>
            </span>
          </dt>
          <dd>{attachFileEntity.linkUrl}</dd>
          <dt>
            <span id="source">
              <Translate contentKey="gatewayApp.commonserviceAttachFile.source">Source</Translate>
            </span>
          </dt>
          <dd>{attachFileEntity.source}</dd>
          <dt>
            <span id="relId">
              <Translate contentKey="gatewayApp.commonserviceAttachFile.relId">Rel Id</Translate>
            </span>
          </dt>
          <dd>{attachFileEntity.relId}</dd>
          <dt>
            <span id="relTitle">
              <Translate contentKey="gatewayApp.commonserviceAttachFile.relTitle">Rel Title</Translate>
            </span>
          </dt>
          <dd>{attachFileEntity.relTitle}</dd>
          <dt>
            <span id="relAttachSeq">
              <Translate contentKey="gatewayApp.commonserviceAttachFile.relAttachSeq">Rel Attach Seq</Translate>
            </span>
          </dt>
          <dd>{attachFileEntity.relAttachSeq}</dd>
          <dt>
            <span id="createdAt">
              <Translate contentKey="gatewayApp.commonserviceAttachFile.createdAt">Created At</Translate>
            </span>
          </dt>
          <dd>
            {attachFileEntity.createdAt ? <TextFormat value={attachFileEntity.createdAt} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
        </dl>
        <Button tag={Link} to="/attach-file" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/attach-file/${attachFileEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default AttachFileDetail;
