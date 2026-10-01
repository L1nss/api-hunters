# Arquivo Interdimensional — API Hunters

Catálogo interativo de personagens de Rick and Morty, feito com React, Tailwind CSS e Axios.

## Executar

```bash
npm install
npm run dev
```

Para gerar a versão de produção: `npm run build`.

## O que demonstrar

- `src/App.jsx` usa `axios.get()` com `async/await` para consultar a API e renderizar os resultados.
- `loading` e `error` dão retorno visual durante a consulta e quando a API não encontra resultados ou falha.
- Busca por nome, filtros de status e espécie e paginação fazem novas consultas com os parâmetros selecionados.
- A API é a [Rick and Morty API](https://rickandmortyapi.com/documentation).
