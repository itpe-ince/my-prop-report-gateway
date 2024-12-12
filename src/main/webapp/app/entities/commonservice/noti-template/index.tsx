import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import NotiTemplate from './noti-template';
import NotiTemplateDetail from './noti-template-detail';
import NotiTemplateUpdate from './noti-template-update';
import NotiTemplateDeleteDialog from './noti-template-delete-dialog';

const NotiTemplateRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<NotiTemplate />} />
    <Route path="new" element={<NotiTemplateUpdate />} />
    <Route path=":id">
      <Route index element={<NotiTemplateDetail />} />
      <Route path="edit" element={<NotiTemplateUpdate />} />
      <Route path="delete" element={<NotiTemplateDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default NotiTemplateRoutes;
