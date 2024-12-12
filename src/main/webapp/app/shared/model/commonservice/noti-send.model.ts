import dayjs from 'dayjs';
import { INotiTemplate } from 'app/shared/model/commonservice/noti-template.model';
import { NotiType } from 'app/shared/model/enumerations/noti-type.model';

export interface INotiSend {
  id?: number;
  notiName?: string;
  notiType?: keyof typeof NotiType;
  notiTemplateId?: number | null;
  notiMsg?: string | null;
  createdAt?: dayjs.Dayjs | null;
  updatedAt?: dayjs.Dayjs | null;
  notiTemplate?: INotiTemplate | null;
}

export const defaultValue: Readonly<INotiSend> = {};
