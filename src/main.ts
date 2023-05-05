import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const start = async () => {
  try {
    const PORT = process.env.PORT || 5000;
    const app = NestFactory.create(AppModule);

    app.then((app) => {
      app.enableCors();
      app.listen(PORT, () => console.log('Server started on port ' + PORT));
    });
  } catch (err) {
    console.log(err);
  }
};

start();
