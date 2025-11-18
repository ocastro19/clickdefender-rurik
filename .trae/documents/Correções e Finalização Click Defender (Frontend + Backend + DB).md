## Diagnóstico resumido
- Inconsistência de contrato entre frontend e backend: hooks esperam `data.data`, backend retorna JSON simples (ex.: `src/hooks/useCheckoutPostbacks.tsx:79-81` vs `api/src/controllers/checkoutPostbackController.ts:6-9`).
- CORS desalineado em dev: Vite em `http://localhost:8080` (`vite.config.ts:8-11`) e backend permite `http://localhost:5173` (`api/src/config/env.ts:15`).
- Tratamento de erros disperso e repetitivo (múltiplos `console.error`), sem camada central.
- Tipagem frouxa (muitos `any`; `tsconfig.json` permissivo).
- Supabase sem ORM; chaves e variáveis precisam validação consistente.

## Objetivos
1. Padronizar respostas de API e consumo no frontend.
2. Alinhar CORS e porta de dev para fluxo estável.
3. Centralizar e melhorar tratamento de erros e autenticação.
4. Elevar confiabilidade de tipos no TS (sem quebrar build).
5. Fortalecer integração com Supabase (envs, segurança, testes).

## Fase 1: Contratos API e Hooks
- Padronizar backend para `{ success, data, message }` em controladores principais (postbacks, checkoutPostbacks, platforms) com wrappers homogêneos.
- Atualizar hooks (`usePostbacks`, `useCheckoutPostbacks`, `usePlatforms`) para consumir o novo formato e remover suposições de `data.data`.
- Adicionar util `apiClient` com base `'/api'`, headers e parsing de erro padrão.

## Fase 2: CORS e Dev Server
- Unificar porta: escolher `8080` para front e configurar `CORS_ORIGIN=http://localhost:8080` no backend.
- Alternativa: mudar Vite para `5173` e ajustar proxy; documentar escolha no README.

## Fase 3: Erros, Autenticação e Feedback
- Criar `errorHandler` global no front (toast + logger) e substituir `console.error` nos hooks e páginas.
- Validar token `Authorization` no backend com middleware padrão; retornar `401` com mensagem consistente.
- Adicionar indicadores de carregamento/erro nas páginas Admin (`AdminCheckoutPostbacks.tsx`, `AdminPostbacks.tsx`, `AdminPlatforms.tsx`).

## Fase 4: Tipagem Progressiva
- Introduzir tipos para entidades: `Platform`, `Postback`, `CheckoutPostback` compartilhados.
- Ajustar hooks e componentes críticos para usar esses tipos; habilitar `noImplicitAny` em modo incremental.

## Fase 5: Supabase e Segurança
- Verificar `.env` obrigatórios: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (backend), `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (frontend).
- Criar verificação de envs no startup (`api/src/config/env.ts`) e falhar com mensagem clara se ausente.
- Revisar políticas de tabela e índices nas migrations; adicionar testes de falha de Supabase nos modelos.

## Fase 6: Testes e Qualidade
- Expandir Jest no backend para cobrir controladores com o novo formato.
- Introduzir Vitest no frontend para testar hooks (mock `fetch`) e util `apiClient`.
- Configurar lint/format (ESLint + Prettier) e script de CI local.

## Fase 7: Script Host e Deploy
- Ajustar host do endpoint do script para usar `req.protocol` + `req.get('host')` com fallback de env, evitando domínio fixo.
- Especificar variáveis de produção e guia de deploy (README).

## Entregáveis
- Contratos API unificados e hooks atualizados.
- CORS funcionando em dev sem erros.
- Camada de erros e feedback de UI consistente.
- Tipos principais definidos e aplicados.
- Env check robusto e testes cobrindo casos de erro.
- Documentação de configuração e execução.

## Validação
- Rodar backend tests e criar smoke tests nos hooks.
- Verificar fluxos admin: listar/criar/editar/deletar e teste de postback/checkout postback.
- Checar chamadas externas (câmbio) e tokens.

Confirma seguir com a implementação por fases acima?