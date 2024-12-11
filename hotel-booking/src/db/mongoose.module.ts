import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';

dotenv.config();

// так не подключается в докере
// @Module({
//   imports: [
//     ConfigModule.forRoot(),
//     MongooseModule.forRoot(
//       process.env.MONGODB_URI, // Получаем URI из конфигурации
//     ),
//   ],
// })
// export class MongooseDatabaseModule {}

// так подключается для докера
@Module({
  imports: [
    ConfigModule.forRoot(), // Импортируем модуль конфигурации
    MongooseModule.forRootAsync({
      imports: [ConfigModule], // Импортируем ConfigModule
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'), // Получаем URI из конфигурации
      }),
      inject: [ConfigService], // Инжектируем ConfigService
    }),
  ],
})
export class MongooseDatabaseModule {}
