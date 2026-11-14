# Pulsko frontend (React + Vite)

## Pokretanje

```
cd frontend
npm install
cp .env.example .env.local   # po potrebi promijeniti VITE_API_URL
npm run dev                  # http://localhost:5173
```

`VITE_API_URL` je adresa backenda (zadano `http://localhost:8000`). Na deployu se postavlja prije `npm run build`, jer Vite vrijednost ugradi u build.

Svi pozivi backendu idu kroz `src/api.js` (`credentials: "include"` zbog kolačića sesije, `X-CSRF-Token` na POST zahtjevima). Rute `/patient/*`, `/doctor/*` i `/admin` štiti `RequireRole` iz `src/auth.jsx`.

---

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
