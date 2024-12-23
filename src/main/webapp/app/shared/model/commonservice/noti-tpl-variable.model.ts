import dayjs from 'dayjs';
import { INotiTemplate } from 'app/shared/model/commonservice/noti-template.model';

export interface INotiTplVariable {
  id?: number;
  variableName?: string;
  defaultValue?: number;
  desciption?: string;
  createdAt?: dayjs.Dayjs;
  updatedAt?: dayjs.Dayjs | null;
  notiTemplate?: INotiTemplate | null;
}

export const defaultValue: Readonly<INotiTplVariable> = {};
