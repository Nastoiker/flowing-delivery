# GitHub Actions → бесплатная VM → k3s

Подготовлены workflow [Deploy demo](../.github/workflows/deploy-demo.yml), серверный скрипт и синтетический SQL-дамп. Реальный сервер и облачный аккаунт создаются отдельно. До настройки `DEPLOY_ENABLED=true` workflow ничего не публикует и не разворачивает.

## Хостинг

Вариант для всего стека: Oracle Cloud Always Free, Ubuntu, Ampere A1 ARM64. На 30 октября 2026 официальная документация указывает **2 OCPU / 12 ГБ RAM** суммарно и **200 ГБ диска**, включая boot volumes, в home region. Создавать только ресурсы с отметкой Always Free eligible и не превышать лимиты. Доступность свободных VM и успешная регистрация не гарантированы; неактивные VM могут быть отозваны. Это бесплатный демостенд, а не SLA.

Источник: [Oracle Always Free](https://docs.oracle.com/en-us/iaas/Content/FreeTier/freetier_topic-Always_Free_Resources.htm). Render/Koyeb free не подходят для размещения всего текущего стека с RabbitMQ, постоянным диском и несколькими процессами: [Render](https://render.com/docs/free), [Koyeb volumes](https://www.koyeb.com/docs/reference/volumes).

## 1. Подготовить VM

Создать VM с Ubuntu, 2 OCPU, 12 ГБ RAM и boot volume около 50 ГБ. Добавить свой SSH public key. Для этого сценария нужен только SSH, порт 22; PostgreSQL, RabbitMQ и Kubernetes API наружу не публикуются. Доступ GitHub-hosted runner к SSH должен быть разрешён сетевыми правилами VM. Отдельный домен не нужен.

На VM под пользователем `ubuntu` установить k3s по [официальной инструкции](https://docs.k3s.io/quick-start):

```bash
curl -fsSL https://get.k3s.io -o /tmp/install-k3s.sh
sudo sh /tmp/install-k3s.sh --disable traefik --disable servicelb
mkdir -p ~/.kube
sudo cat /etc/rancher/k3s/k3s.yaml > ~/.kube/config
chmod 600 ~/.kube/config
kubectl get nodes
kubectl get storageclass
kubectl create namespace flowing-delivery-lab
kubectl -n flowing-delivery-lab create secret generic delivery-secrets \
  --from-literal=DB_PASSWORD="$(openssl rand -hex 32)" \
  --from-literal=AMQP_PASSWORD="$(openssl rand -hex 32)" \
  --from-literal=JWT_SECRET="$(openssl rand -hex 32)"
```

Это выделенная demo-VM: kubeconfig даёт этому SSH-пользователю права управления кластером. Секреты создаются один раз, повторно не заменять — пароль существующей БД не изменяется вместе с Secret.

## 2. Доступ к образам GHCR

Workflow публикует образы через встроенный `GITHUB_TOKEN`. Для скачивания приватных образов после завершения workflow VM нужен отдельный GitHub classic PAT с `read:packages` и доступом к пакетам репозитория. Ввести его на VM, не сохранять в Git:

```bash
read -rp 'GitHub username: ' GHCR_USER
read -rsp 'GitHub token (read:packages): ' GHCR_TOKEN; echo
kubectl -n flowing-delivery-lab create secret docker-registry ghcr-pull \
  --docker-server=ghcr.io --docker-username="$GHCR_USER" --docker-password="$GHCR_TOKEN"
unset GHCR_TOKEN
```

Созданный workflow связывает пакеты с репозиторием через OCI label. Если пакеты уже существовали, проверить их Settings → Manage Actions access. [Документация GHCR](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry).

## 3. Настроить GitHub

Создать отдельный SSH-ключ для деплоя. Public key добавить в `~/.ssh/authorized_keys` пользователя VM. Private key сохранить **только** в GitHub Secret.

Settings → Environments → создать `demo`, добавить secrets:

| Secret | Значение |
| --- | --- |
| `DEPLOY_HOST` | IP или hostname VM, SSH порт 22 |
| `DEPLOY_USER` | Например, `ubuntu` |
| `DEPLOY_SSH_KEY` | Private key деплоя без passphrase |
| `DEPLOY_KNOWN_HOSTS` | Проверенная строка known_hosts для VM |

Получить known_hosts можно командой `ssh-keyscan -H SERVER_IP`, но сначала сверить fingerprint с `ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub` через доверенную консоль VM. Workflow не отключает проверку host key.

Settings → Secrets and variables → Actions → **Variables**:

| Variable | Значение |
| --- | --- |
| `DEPLOY_ENABLED` | `true` после настройки сервера и secrets |
| `DEPLOY_PLATFORM` | `linux/arm64` для Oracle A1; `linux/amd64` для x86 VPS |

Отправить feature-ветку, затем влить её в `main`. Push в `main` запускает CI и деплой. После появления workflow в default branch доступен Actions → Deploy demo → Run workflow, где можно выбрать feature-ветку. Если default branch называется иначе, изменить фильтр `branches` в workflow.

Порядок: сборки и тесты → образы GHCR с полным SHA коммита → SSH → rollout → миграция снимков заказа → демодамп → HTTP smoke checks. Ошибка любого этапа делает запуск красным. Деплои выполняются последовательно; новые push не прерывают текущий. Архитектура образа должна совпадать с VM. GitHub Actions и GHCR имеют собственные тарифы/квоты аккаунта; бесплатность VM не покрывает их превышение.

## 4. Открыть демо

На VM в двух терминалах:

```bash
kubectl -n flowing-delivery-lab port-forward svc/api 3444:3444
```

```bash
kubectl -n flowing-delivery-lab port-forward svc/frontend 5173:5173
```

На своём компьютере:

```bash
ssh -N -L 3444:127.0.0.1:3444 -L 5173:127.0.0.1:5173 ubuntu@SERVER_IP
```

Открыть **http://localhost:5173/menu**, зарегистрировать своего тестового пользователя. Используются существующие localhost URL и CORS; это доступ через SSH-туннель, не публичная ссылка. Для публичного сайта нужны отдельная настройка домена/TLS и устранение описанных в [ревью](SENIOR_REVIEW.md) проблем авторизации.

## Дамп и повторные деплои

[demo.sql](../deploy/server/demo.sql) добавляет категорию «Демо-меню», 5 товаров, технического покупателя без возможности входа и 5 заказов со снимками цен. Для интерактивной проверки зарегистрировать нового пользователя. Старый `dbs/postgresql/dump.sql` не переносится. Картинки не добавляются, используются пустые значения.

Импорт атомарный, защищён advisory lock и отметкой `catalog-orders-v1`; повторный запуск не сбрасывает заказы и остатки. Изменённый дамп с той же версией повторно не применяется. Перед обновлением существующего стенда сделать backup PostgreSQL и PVC; workflow не выполняет автоматический откат БД. После сбоя проверить логи Actions и `kubectl -n flowing-delivery-lab get pods,pvc`. Серверные логи и bundle остаются в `/tmp/flowing-delivery.*` для диагностики.
