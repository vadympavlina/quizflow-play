# QuizFlow Play (жива гра для учнів)

Піддомен: **play.quizflow.space**. Учнівська частина гри наживо: вхід за кодом (`index.html`), гра (`live/play-student`) і результат (`live/student-result`). Входу тут немає: усе, що вимагає викладача, живе в `quizflow-app` (`live/setup`, `lobby`, `play-teacher`, `podium`).

Статичний сайт (без збірки) на GitHub Pages. Правила роботи з кодом — у [CLAUDE.md](CLAUDE.md), тести — у [tests/README.md](tests/README.md).

## Як підключити домен
1. DNS: `CNAME` запис `play` → `vadympavlina.github.io`.
2. GitHub: Settings → Pages → Source: **GitHub Actions**; Custom domain: `play.quizflow.space`; увімкнути Enforce HTTPS.
3. Firebase Console → Authentication → Settings → Authorized domains: додати `play.quizflow.space`.
