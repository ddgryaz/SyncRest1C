# SyncRest1C

## Микросервис для получения данных из 1С

### Схема работы микросервиса:
![СХЕМА](./helpers/sheme.png)

### Документация: 
Swagger - документация по статус кодам доступна по - `/api-docs` (Так же можно использовать в качестве веб-морды, для ручной загрузки данных)

1. `npm install` - Для установки зависимостей.
2. `npm run idx` - Для создания коллекций.
3. `npm run add 213.123.123.123` - Для добавления IP в список разрешенных.
4. `npm run start` - Для запуска сервиса.

Для удаления из списка разрешенных IP - `npm run delete 213.123.123.123`.

Для запуска сервиса с монгой в режиме репликации:
1. Закомментировать в файле settings.js - 9 и 10 строку.
2. Расскоментировать 12, 13, 14, 15 строки.

### .env:

1. Перед запуском переименовать файл .env.example в .env и заполнить необходимыми параметрами.

`CLEAN_STORAGE_DAY` - Параметр для очистки данных в JSON/data, если установлен 10, то файлы которые созданы 10 дней назад удалятся. (По умолчанию - 14)

`TIMELOCK` - Время в секундах, для блокировки последующих запросов. (По умолчанию - 3600). Устанавливается один раз, во время запуска - `npm run idx`

### Docker:

Докер контейнер по умолчанию поднимается на 5000 порту (см. Dockerfile).

Для удобства использования, написан Makefile - все основные команды управления контейнером.

### Создание кастомных ролей в MongoDB:

Для доступа в базу Auth из сервиса SyncRest1C:

```javascript
use admin
db.createRole({
  role: "SyncRestAppRole",
  privileges: [
    {
      resource: { db: "Auth", collection: "users" },
      actions: [ "insert", "find" ]
    }
  ],
  roles: [
    { role: "readWrite", db: "SyncRest1C" },
    { role: "dbAdmin", db: "SyncRest1C" }
  ]
})
```

Роль хранится в БД Admin

### Изменение роли у пользователя в MongoDB:

Пользователь хранится в БД SyncRest1C
```javascript

use SyncRest1C
db.updateUser("ans1",{
    roles:[{role:'SyncRestAppRole',db:'Auth'}]
})
```

### Более подробно об кастомных ролях:

1. Предоставляет дополнительные привилегии определяемой пользователем роли. [docs.mongodb.com](https://docs.mongodb.com/manual/reference/method/db.revokePrivilegesFromRole/).

2. Удаляет указанные привилегии из определяемой пользователем роли в базе данных, в которой выполняется метод. [docs.mongodb.com](https://docs.mongodb.com/manual/reference/method/db.grantPrivilegesToRole/).