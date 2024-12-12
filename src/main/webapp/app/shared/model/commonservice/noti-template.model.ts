import dayjs from 'dayjs';
import { TemplateFormatType } from 'app/shared/model/enumerations/template-format-type.model';

export interface INotiTemplate {
  id?: number;
  templateTitle?: string;
  templateBody?: string;
  templateFormat?: keyof typeof TemplateFormatType;
  createdAt?: dayjs.Dayjs;
  updatedAt?: dayjs.Dayjs | null;
}

export const defaultValue: Readonly<INotiTemplate> = {};
