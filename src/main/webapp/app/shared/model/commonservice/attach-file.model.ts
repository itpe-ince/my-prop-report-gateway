import dayjs from 'dayjs';

export interface IAttachFile {
  id?: number;
  fileName?: string;
  fileOrgName?: string;
  filePath?: string;
  fileSize?: number | null;
  fileType?: string | null;
  linkUrl?: string | null;
  source?: string | null;
  relId?: number;
  relTitle?: string | null;
  relAttachSeq?: number | null;
  createdAt?: dayjs.Dayjs | null;
}

export const defaultValue: Readonly<IAttachFile> = {};
