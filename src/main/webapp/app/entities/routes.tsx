import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import { ReducersMapObject, combineReducers } from '@reduxjs/toolkit';

import getStore from 'app/config/store';

import entitiesReducers from './reducers';

import Complex from './propservice/complex';
import Property from './propservice/property';
import Transaction from './propservice/transaction';
import UserInfo from './userservice/user-info';
import Report from './reportservice/report';
import Infrastructure from './reportservice/infrastructure';
import EnvFactor from './reportservice/env-factor';
import LivingRoom from './reportservice/living-room';
import Bedroom from './reportservice/bedroom';
import Kitchen from './reportservice/kitchen';
import Bathroom from './reportservice/bathroom';
import Entrance from './reportservice/entrance';
import Author from './reportservice/author';
import AttachFile from './commonservice/attach-file';
import NotiTemplate from './commonservice/noti-template';
import NotiTplVariable from './commonservice/noti-tpl-variable';
import NotiSend from './commonservice/noti-send';
import NotiSendTarget from './commonservice/noti-send-target';
import NotiSendJob from './commonservice/noti-send-job';
/* jhipster-needle-add-route-import - JHipster will add routes here */

export default () => {
  const store = getStore();
  store.injectReducer('gateway', combineReducers(entitiesReducers as ReducersMapObject));
  return (
    <div>
      <ErrorBoundaryRoutes>
        {/* prettier-ignore */}
        <Route path="complex/*" element={<Complex />} />
        <Route path="property/*" element={<Property />} />
        <Route path="transaction/*" element={<Transaction />} />
        <Route path="user-info/*" element={<UserInfo />} />
        <Route path="report/*" element={<Report />} />
        <Route path="infrastructure/*" element={<Infrastructure />} />
        <Route path="env-factor/*" element={<EnvFactor />} />
        <Route path="living-room/*" element={<LivingRoom />} />
        <Route path="bedroom/*" element={<Bedroom />} />
        <Route path="kitchen/*" element={<Kitchen />} />
        <Route path="bathroom/*" element={<Bathroom />} />
        <Route path="entrance/*" element={<Entrance />} />
        <Route path="author/*" element={<Author />} />
        <Route path="attach-file/*" element={<AttachFile />} />
        <Route path="noti-template/*" element={<NotiTemplate />} />
        <Route path="noti-tpl-variable/*" element={<NotiTplVariable />} />
        <Route path="noti-send/*" element={<NotiSend />} />
        <Route path="noti-send-target/*" element={<NotiSendTarget />} />
        <Route path="noti-send-job/*" element={<NotiSendJob />} />
        {/* jhipster-needle-add-route-path - JHipster will add routes here */}
      </ErrorBoundaryRoutes>
    </div>
  );
};
