import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import NotiTplVariable from './noti-tpl-variable';
import NotiTplVariableDetail from './noti-tpl-variable-detail';
import NotiTplVariableUpdate from './noti-tpl-variable-update';
import NotiTplVariableDeleteDialog from './noti-tpl-variable-delete-dialog';

const NotiTplVariableRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<NotiTplVariable />} />
    <Route path="new" element={<NotiTplVariableUpdate />} />
    <Route path=":id">
      <Route index element={<NotiTplVariableDetail />} />
      <Route path="edit" element={<NotiTplVariableUpdate />} />
      <Route path="delete" element={<NotiTplVariableDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default NotiTplVariableRoutes;
