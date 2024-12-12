import complex from 'app/entities/propservice/complex/complex.reducer';
import property from 'app/entities/propservice/property/property.reducer';
import transaction from 'app/entities/propservice/transaction/transaction.reducer';
import userInfo from 'app/entities/userservice/user-info/user-info.reducer';
import report from 'app/entities/reportservice/report/report.reducer';
import infrastructure from 'app/entities/reportservice/infrastructure/infrastructure.reducer';
import envFactor from 'app/entities/reportservice/env-factor/env-factor.reducer';
import livingRoom from 'app/entities/reportservice/living-room/living-room.reducer';
import bedroom from 'app/entities/reportservice/bedroom/bedroom.reducer';
import kitchen from 'app/entities/reportservice/kitchen/kitchen.reducer';
import bathroom from 'app/entities/reportservice/bathroom/bathroom.reducer';
import entrance from 'app/entities/reportservice/entrance/entrance.reducer';
import author from 'app/entities/reportservice/author/author.reducer';
import attachFile from 'app/entities/commonservice/attach-file/attach-file.reducer';
import notiTemplate from 'app/entities/commonservice/noti-template/noti-template.reducer';
import notiTplVariable from 'app/entities/commonservice/noti-tpl-variable/noti-tpl-variable.reducer';
import notiSend from 'app/entities/commonservice/noti-send/noti-send.reducer';
import notiSendTarget from 'app/entities/commonservice/noti-send-target/noti-send-target.reducer';
import notiSendJob from 'app/entities/commonservice/noti-send-job/noti-send-job.reducer';
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

const entitiesReducers = {
  complex,
  property,
  transaction,
  userInfo,
  report,
  infrastructure,
  envFactor,
  livingRoom,
  bedroom,
  kitchen,
  bathroom,
  entrance,
  author,
  attachFile,
  notiTemplate,
  notiTplVariable,
  notiSend,
  notiSendTarget,
  notiSendJob,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
};

export default entitiesReducers;
