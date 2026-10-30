# Демо без карты в GitHub Codespaces

[Создать Codespace на feature-ветке](https://codespaces.new/Nastoiker/flowing-delivery?ref=feature%2Fddd-checkout&quickstart=1)

1. Войти в свой GitHub, выбрать машину **2 cores** и создать Codespace.
2. Дождаться `postStartCommand`: он собирает образы, запускает PostgreSQL, RabbitMQ и приложения, импортирует синтетический дамп. Первый запуск может занять несколько минут.
3. Открыть вкладку **Ports**, порт **5173**, нажать **Open in Browser**, перейти на `/menu`.
4. Зарегистрировать своего тестового пользователя. Категория «Демо-меню» уже содержит 5 товаров. Технический пользователь дампа не предназначен для входа.

Приложение, API, файлы и Socket.IO доступны через один адрес. Порт остаётся private: доступен владельцу после авторизации GitHub. Это не круглосуточный публичный хостинг. Текущие ограничения авторизации приложения описаны в [ревью](SENIOR_REVIEW.md).

GitHub Free для личного аккаунта включает 120 ядро-часов в месяц (около 60 часов машины с 2 CPU) и 15 GB-month хранения. Без платёжного метода после исчерпания любой квоты запуск блокируется. Docker-образы и данные тоже расходуют место: следить за Usage, а ненужный Codespace удалять. [Квоты GitHub](https://docs.github.com/en/billing/concepts/product-billing/github-codespaces).

**После демонстрации:** открыть [список Codespaces](https://github.com/codespaces) → меню `…` → **Stop codespace**, чтобы не расходовать вычислительные часы. Хранение продолжает учитываться у остановленного окружения. Удаление Codespace уничтожает его локальные данные.

## Повторный запуск и диагностика

Скрипт запускается при старте окружения. Для ручного повтора:

```bash
bash scripts/start-demo.sh
docker compose --env-file .demo.local.env -f docker-compose.demo.yml ps
docker compose --env-file .demo.local.env -f docker-compose.demo.yml logs --tail=100 api account
```

Пароли генерируются локально в игнорируемый `.demo.local.env`. Не удалять его при сохранённых Docker volumes: это нарушит соответствие паролей БД и приложения. Повторный запуск не сбрасывает демоданные. Для остановки приложений без удаления данных использовать `docker compose --env-file .demo.local.env -f docker-compose.demo.yml stop`.

В Codespaces используется Docker Compose, чтобы оставить ресурсы приложениям. Серверный Kubernetes-деплой и GitHub Actions сохранены отдельно. Workflow **Codespaces demo smoke** проверяет сборку, повторный запуск и доступ через Nginx; он не создаёт Codespace и не является хостингом.

Локально тот же скрипт работает в Bash с Node.js 22 и Docker Compose. По умолчанию приложение слушает `127.0.0.1:5173`; для другого порта задать одновременно `DEMO_PORT` и `DEMO_URL`, например `DEMO_PORT=5180 DEMO_URL=http://127.0.0.1:5180 bash scripts/start-demo.sh`.
