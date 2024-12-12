import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import NotiSendJob from './noti-send-job';
import NotiSendJobDetail from './noti-send-job-detail';
import NotiSendJobUpdate from './noti-send-job-update';
import NotiSendJobDeleteDialog from './noti-send-job-delete-dialog';

const NotiSendJobRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<NotiSendJob />} />
    <Route path="new" element={<NotiSendJobUpdate />} />
    <Route path=":id">
      <Route index element={<NotiSendJobDetail />} />
      <Route path="edit" element={<NotiSendJobUpdate />} />
      <Route path="delete" element={<NotiSendJobDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default NotiSendJobRoutes;
