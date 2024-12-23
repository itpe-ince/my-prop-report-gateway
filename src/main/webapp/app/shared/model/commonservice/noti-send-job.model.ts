import dayjs from 'dayjs';
import { INotiSend } from 'app/shared/model/commonservice/noti-send.model';
import { JobType } from 'app/shared/model/enumerations/job-type.model';
import { JobStatusType } from 'app/shared/model/enumerations/job-status-type.model';

export interface INotiSendJob {
  id?: number;
  jobName?: string;
  jobTime?: string;
  jobType?: keyof typeof JobType;
  jobStartAt?: string;
  jobEndAt?: string;
  jobStatus?: keyof typeof JobStatusType;
  createdAt?: dayjs.Dayjs;
  updatedAt?: dayjs.Dayjs | null;
  notiSend?: INotiSend | null;
}

export const defaultValue: Readonly<INotiSendJob> = {};
