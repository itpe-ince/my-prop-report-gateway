import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import NotiSend from './noti-send';
import NotiSendDetail from './noti-send-detail';
import NotiSendUpdate from './noti-send-update';
import NotiSendDeleteDialog from './noti-send-delete-dialog';

const NotiSendRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<NotiSend />} />
    <Route path="new" element={<NotiSendUpdate />} />
    <Route path=":id">
      <Route index element={<NotiSendDetail />} />
      <Route path="edit" element={<NotiSendUpdate />} />
      <Route path="delete" element={<NotiSendDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default NotiSendRoutes;
