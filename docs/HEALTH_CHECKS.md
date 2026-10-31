# Health checks

| URL | Успех | Что проверяет |
| --- | --- | --- |
| `/api/health/live` | 200, `status: ok` | HTTP-процесс API отвечает, внешние зависимости не вызываются |
| `/api/health/ready` | 200, `checks.checkout: up` | API отправляет RPC через RabbitMQ, account читает каталог из PostgreSQL и возвращает корректный ответ |

Readiness возвращает **503** при недоступности основной цепочки или некорректном ответе. RPC имеет таймаут 1,5 секунды, HTTP-проверка — предел ожидания 2 секунды, включая инициализацию RMQ. Одновременные проверки используют один незавершённый запрос. Ответы не кешируются и не содержат внутренних ошибок/паролей.

Это проверка основной цепочки заказа, не гарантия здоровья всех функций. В ней не проверяются S3, платёжный провайдер, banner/event/payment и доставка уведомления до браузера. Каталог может быть пустым — это не считается отказом.

Docker Compose использует readiness для healthcheck API и ждёт её перед запуском frontend. Kubernetes использует `/live` для startup/liveness и `/ready` для readiness: отказ RabbitMQ убирает API из готовых endpoints, но не запускает бесконечные рестарты живого процесса. [Как работают probes](https://kubernetes.io/docs/tasks/configure-pod-container/configure-liveness-readiness-startup-probes/).

После запуска демо:

```bash
curl -i http://localhost:5173/api/health/live
curl -i http://localhost:5173/api/health/ready
```

На Windows-стенде с публичным туннелем локальный порт — **5180**. Внешний URL защищён входом Cloudflare: автоматические проверки выполняются внутри стенда, до этой страницы авторизации.

`node scripts/test-health.cjs` проверяет реальный отказ: временно останавливает account, ожидает readiness 503 и liveness 200, запускает account в `finally` и ждёт восстановления readiness. Выполнять на тестовом стенде, поскольку на несколько секунд перестают работать регистрация, каталог и заказы. Для другого адреса задать `DEMO_URL`.
