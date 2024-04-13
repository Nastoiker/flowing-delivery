export class MFile {
  originalname: string;
  buffer: Buffer;

  constructor(file: any | MFile) {
    this.originalname = file.originalname;
    this.buffer = file.buffer;
  }
}
