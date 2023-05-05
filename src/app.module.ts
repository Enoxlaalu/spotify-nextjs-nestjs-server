import { Module } from '@nestjs/common';
import { TrackModule } from './track/track.module';
import { MongooseModule } from '@nestjs/mongoose';
import FileModule from './file/file.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, 'static'),
    }),
    MongooseModule.forRoot(
      'mongodb+srv://admin:admin>@cluster0.hb3rq8o.mongodb.net/spotify',
      {
        user: 'admin',
        pass: 'admin',
      },
    ),
    TrackModule,
    FileModule,
  ],
})
export class AppModule {}
