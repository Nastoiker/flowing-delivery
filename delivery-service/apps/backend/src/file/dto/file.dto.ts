export class CreateFileDto {
    id?: number;
    nameWithOutExt: string;
    nameWithExt: string;
    extension: string;
    url: string;
    size: string;
    creatorId: number;
    documentTypeId: number;
  }