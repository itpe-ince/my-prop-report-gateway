import dayjs from 'dayjs';
import { INotiSend } from 'app/shared/model/commonservice/noti-send.model';
import { SendStatusType } from 'app/shared/model/enumerations/send-status-type.model';

export interface INotiSendTarget {
  id?: number;
  notiId?: number;
  targetUserNo?: number;
  targetAddress?: string;
  sendMsg?: string;
  sendStatus?: keyof typeof SendStatusType;
  sendAt?: dayjs.Dayjs;
  notiSend?: INotiSend | null;
}

export const defaultValue: Readonly<INotiSendTarget> = {};
