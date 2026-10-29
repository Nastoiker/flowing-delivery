# S3-совместимое хранилище изображений

`FilesService` обслуживает загрузки изображений каталога, категорий, баннеров и
`POST /api/files/upload`. `STORAGE_DRIVER=local` сохраняет файл в `/app/uploads`;
`STORAGE_DRIVER=s3` отправляет его в bucket через AWS SDK v3.
Старый RMQ CRUD метаданных `/api/files` этим изменением не переносится в S3.

Формат ответа сохранён: `{url, name}`. Локальные URL начинаются с `/uploads/`,
S3 URL — с `/api/media/s3/`. Frontend уже добавляет к ним адрес API.
Bucket закрыт: API читает объект серверными credentials и передаёт поток браузеру.
Это публичные изображения каталога, а не механизм выдачи приватных документов.
В БД не сохраняются временные подписанные ссылки или внутренний адрес MinIO.

## Конфигурация API

| Переменная | Значение |
|---|---|
| `STORAGE_DRIVER` | `local` (по умолчанию) или `s3` |
| `S3_BUCKET` | Имя существующего bucket; обязательно для `s3` |
| `AWS_REGION` | Регион bucket; по умолчанию `us-east-1` |
| `S3_ENDPOINT` | Для совместимого сервиса, например `http://minio:9000`; для AWS оставить незаданным |
| `S3_FORCE_PATH_STYLE` | `true` для MinIO, `false` по умолчанию |
| `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` | Стандартные credentials SDK, если не используется IAM role |
| `AWS_SESSION_TOKEN` | Для временных credentials, если требуется |

SDK использует стандартную цепочку credentials. Для внешнего сервиса передай
конфигурацию в API Deployment, credentials — через Secret или workload identity.
`envs/.api.env` подходит только для локального процесса; в Docker-образ env-файлы не копируются.
Не добавляй ключи доступа в Git. Для AWS role-based доступа потребуется отдельно
настроить ServiceAccount/workload identity: текущая лаборатория не монтирует token.

Для заранее созданного bucket достаточно разрешить `s3:PutObject` и `s3:GetObject`
на `arn:aws:s3:::YOUR_BUCKET/media/*`. API не создаёт bucket, не задаёт публичные
ACL и не требует `s3:ListBucket`. Внешнее подключение использует HTTPS.

Пример настройки уже созданного Secret из локального, не отслеживаемого Git файла
с AWS-переменными (не выводит содержимое ключей):

```powershell
kubectl --context kind-flowing-delivery -n flowing-delivery-lab create secret generic external-s3-credentials --from-env-file=./s3.local.env
kubectl --context kind-flowing-delivery -n flowing-delivery-lab set env deployment/api --from=secret/external-s3-credentials
kubectl --context kind-flowing-delivery -n flowing-delivery-lab set env deployment/api STORAGE_DRIVER=s3 S3_BUCKET=YOUR_BUCKET AWS_REGION=YOUR_REGION S3_FORCE_PATH_STYLE=false S3_ENDPOINT-
```

Для постоянного окружения сохрани несекретные настройки и `secretKeyRef` в своём
Kustomize overlay: `kubectl set env` меняет живой кластер, следующий `apply` может
перезаписать эти ручные изменения. Для S3-совместимого сервиса задай его endpoint
и нужный `S3_FORCE_PATH_STYLE`. Подключение к реальному AWS в этом изменении не тестировалось.

## Локальный стенд MinIO в Kubernetes

Из корня репозитория, при уже работающей базовой лаборатории:

```powershell
docker build -f delivery-service/Dockerfile.k8s -t flowing-delivery-backend:senior delivery-service
docker build -f deploy/s3-lab/Dockerfile.minio -t flowing-delivery-minio:lab deploy/s3-lab
kind load docker-image --name flowing-delivery flowing-delivery-backend:senior flowing-delivery-minio:lab
powershell -NoProfile -ExecutionPolicy Bypass -File k8s/Enable-S3Lab.ps1
```

Если `kind` не в PATH, установленный в этой сессии бинарник находится в
`$env:TEMP\flowing-kind-v0.33.0.exe`; запускай его через `&` вместо `kind`.
MinIO собирается из закреплённого upstream tag `RELEASE.2025-10-15T17-29-55Z`;
готовые образы в registry не используются. Первая сборка скачивает Go-зависимости.

Скрипт сохраняет существующий Secret или генерирует новый, применяет overlay,
ждёт MinIO, Job создания закрытого bucket `delivery-media` и API.
Данные MinIO лежат в отдельном PVC `data-minio-0`. В лаборатории API и Job используют
учётную запись MinIO root; для внешнего окружения нужен отдельный пользователь с
правами только на bucket/prefix. Service MinIO доступен только внутри кластера.

Job создания bucket остаётся Completed. Если вручную удалить bucket, повторный
`apply` не перезапустит выполненный Job: сначала удали только Job
`s3-lab-create-bucket`, затем повтори Enable-S3Lab.

После смены API Pod заново запусти port-forward. В отдельном терминале:

```powershell
kubectl --context kind-flowing-delivery -n flowing-delivery-lab port-forward service/api 3444:3444 --address 127.0.0.1
```

Проверка реальной записи/чтения:

```powershell
node scripts/smoke-storage.cjs write "$env:TEMP/delivery-s3-proof.json" s3
kubectl --context kind-flowing-delivery -n flowing-delivery-lab rollout restart deployment/api statefulset/minio
kubectl --context kind-flowing-delivery -n flowing-delivery-lab rollout status statefulset/minio --timeout=180s
kubectl --context kind-flowing-delivery -n flowing-delivery-lab rollout status deployment/api --timeout=180s
# Перезапусти port-forward в другом терминале, затем:
node scripts/smoke-storage.cjs read "$env:TEMP/delivery-s3-proof.json"
```

Проверяется SHA-256 фактически скачанных байтов. Тест оставляет одно маленькое
изображение в лаборатории. CI выполняет этот сценарий и проверяет, что старая
локальная картинка тоже доступна после переключения на S3.

## Гарантии и ограничения

- Имена объектов: `media/YYYY-MM-DD/UUID.ext`; имя клиента не используется как путь.
- PNG/JPEG/WebP/GIF определяются по содержимому; SVG и неизвестные форматы отклоняются.
- Лимит запроса — 10 МБ на один файл; лимит изображения — 40 млн пикселей.
- Upload возвращает успех только после сохранения; при ошибке S3 — 503 без fallback на диск.
- SDK ограничивает попытки и время операций. Повтор HTTP upload создаёт новый UUID;
  идемпотентность пользовательских загрузок и очистка осиротевших объектов не реализованы.
- Старые `/uploads` остаются на PVC. Автоматического переноса локальных файлов нет.
- Для возврата новых загрузок на диск задай `STORAGE_DRIVER=local`, сохранив S3-настройки
  и доступ к bucket: тогда старые `/api/media/s3` продолжат работать.
- S3 убирает зависимость новых файлов от диска API, но API всё ещё нельзя свободно
  масштабировать: WebSocket-состояние хранится в локальном Map.

Документация: [AWS SDK S3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3/),
[PutObject](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/s3/command/PutObjectCommand/).
