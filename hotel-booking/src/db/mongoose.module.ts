import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import * as dotenv from 'dotenv';

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      process.env.MONGO_URL ||
        'mongodb://mongo:27017/hotel-booking?authSource=admin', // Получаем URI из конфигурации
    ),
  ],
})
export class MongooseDatabaseModule {}
