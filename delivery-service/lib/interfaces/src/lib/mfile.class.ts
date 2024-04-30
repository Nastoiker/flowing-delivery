export class MFile {
  originalname: string;
  buffer: Buffer;
  // TODO: Express.Multer.File
  constructor(file: any | MFile) {
    this.originalname = file.originalname;
    this.buffer = file.buffer;
  }
}
