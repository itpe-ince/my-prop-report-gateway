import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import AttachFile from './attach-file';
import AttachFileDetail from './attach-file-detail';
import AttachFileUpdate from './attach-file-update';
import AttachFileDeleteDialog from './attach-file-delete-dialog';

const AttachFileRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<AttachFile />} />
    <Route path="new" element={<AttachFileUpdate />} />
    <Route path=":id">
      <Route index element={<AttachFileDetail />} />
      <Route path="edit" element={<AttachFileUpdate />} />
      <Route path="delete" element={<AttachFileDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default AttachFileRoutes;
