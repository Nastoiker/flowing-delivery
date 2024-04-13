import { Module } from '@nestjs/common';

import { ServeStaticModule } from '@nestjs/serve-static';
import { path } from 'app-root-path';
import { FilesService } from './file.service';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: `${path}/uploads`,
      serveRoot: '/uploads',
    }),
  ],
  providers: [FilesService],
})
export class FilesModule {}
