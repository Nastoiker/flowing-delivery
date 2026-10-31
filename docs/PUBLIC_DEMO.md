# Демо по внешней ссылке без карты

Windows: Docker Desktop, Git for Windows и Node.js должны быть установлены. Запустить Docker Desktop, затем из корня репозитория:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/Start-PublicDemo.ps1 -AllowedEmail your@email.com
```

Скрипт собирает и запускает отдельный Compose-стенд на `127.0.0.1:5180`, импортирует синтетические данные и проверяет frontend, API и Socket.IO. После этого запускает Cloudflare Quick Tunnel в фоне и печатает HTTPS-ссылку `/menu`. Без параметра email используется `git config user.email`.

Доступ защищён одноразовым кодом на указанный email. Это вход в туннель; после него можно зарегистрировать тестового пользователя в самом приложении. Аккаунт Cloudflare, домен и банковская карта не нужны. [Документация Quick Tunnels](https://developers.cloudflare.com/tunnel/get-started/quick-tunnels/).

Cloudflared 2026.10.7 скачивается из официального GitHub Release с проверкой SHA256. Бинарник хранится в `%LOCALAPPDATA%/flowing-delivery-tools`, адрес и PID — в `.demo-host/tunnel.json`, логи — в `.demo-host/cloudflared.log`. Каталог `.demo-host` исключён из Git. Работающий туннель используется повторно; для смены email его нужно сначала остановить.

Остановить внешний доступ, сохранив приложение и данные:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/Stop-PublicDemo.ps1
```

Локально приложение остаётся доступным по http://localhost:5180/menu. После остановки и нового запуска туннеля внешняя ссылка меняется. Компьютер, Docker и туннель должны оставаться включёнными; это временный демостенд, а не независимый сервер 24/7. Автозапуск при включении Windows не настраивается.
