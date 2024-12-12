import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import NotiSendTarget from './noti-send-target';
import NotiSendTargetDetail from './noti-send-target-detail';
import NotiSendTargetUpdate from './noti-send-target-update';
import NotiSendTargetDeleteDialog from './noti-send-target-delete-dialog';

const NotiSendTargetRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<NotiSendTarget />} />
    <Route path="new" element={<NotiSendTargetUpdate />} />
    <Route path=":id">
      <Route index element={<NotiSendTargetDetail />} />
      <Route path="edit" element={<NotiSendTargetUpdate />} />
      <Route path="delete" element={<NotiSendTargetDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default NotiSendTargetRoutes;
