# GREEN-API WhatsApp Chat

Веб-интерфейс для отправки и получения текстовых сообщений в WhatsApp через [GREEN-API](https://green-api.com).

## Возможности

- Авторизация по `idInstance` и `apiTokenInstance` (данные хранятся в `localStorage`)
- Создание чата по номеру телефона получателя
- Отправка текстовых сообщений (метод `SendMessage`)
- Получение входящих сообщений через long polling (`ReceiveNotification` + `DeleteNotification`)
- Адаптивная вёрстка

## Стек

React, TypeScript, Vite, styled-components, axios

## Требования

1. Аккаунт на [green-api.com](https://green-api.com)
2. Созданный инстанс с авторизованным WhatsApp
3. Значения `idInstance` и `apiTokenInstance` из личного кабинета
4. Node.js 20.19 или новее

## Локальный запуск

```bash
git clone https://github.com/Trebooshet/green-api-chat.git
cd green-api-chat
npm install
npm run dev
```

Откройте адрес из терминала (обычно http://localhost:5173), введите `idInstance` и `apiTokenInstance`, затем номер получателя в формате `79991234567` и нажмите «Создать чат».
После этого появится возможность отправки и получения сообщений в созданном чате.

## Особенности

- Приложение работает с одним чатом: входящие сообщения от других номеров не отображаются.
- История сообщений не сохраняется после перезагрузки страницы.