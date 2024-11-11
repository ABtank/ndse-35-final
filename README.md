### Шаг 1: Создание проекта NestJS

1. Установка Nest CLI, если он еще не установлен:

   ```
   npm i -g @nestjs/cli
   ```

2. Создать новый проект:

   ```
   nest new hotel-booking
   ```

3. Установка зависимостей:


## Генерация модулей
```bash
   nest generate module users
   nest generate service users
   nest generate controller users
   
   nest generate module hotels
   nest generate service hotels
   nest generate controller hotels
   
   nest generate module reservations
   nest generate service reservations
   nest generate controller reservations
   
   nest generate module support
   nest generate service support
   nest generate controller support
   ```
### Запуск в режиме разработки
```
npm run start:dev
```

### Запуск приложения в контейнере
```
docker-compose up --build
```


## Что не доделано
1) не реализован проверка доступа по ролям
