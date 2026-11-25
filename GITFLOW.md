# Git Workflow — regras para o Claude

> Projeto solo de portfólio. O histórico de commits é **prova pública de como eu trabalho**: deve ser pequeno, legível e honesto.
> Siga estas regras em toda tarefa que altere código.

---

## 1. Branches (GitHub Flow simplificado)

- `main` = sempre estável e deployável. **Nunca commitar direto na `main`.**
- Toda tarefa nasce de uma branch a partir da `main` atualizada:

| Prefixo | Uso | Exemplo |
|---|---|---|
| `feat/` | nova funcionalidade | `feat/syllabus-import` |
| `fix/` | correção de bug | `fix/timer-background-resume` |
| `refactor/` | mudança interna sem alterar comportamento | `refactor/extract-progress-hook` |
| `test/` | só testes | `test/recipe-service` |
| `docs/` | README, docs, comentários | `docs/deploy-instructions` |
| `chore/` | config, deps, build, CI | `chore/render-deploy-config` |
| `spike/` | prova técnica descartável | `spike/semana-1` |

- Nome: `prefixo/descricao-curta-em-ingles`, kebab-case, máx. ~4 palavras.
- 1 branch = 1 objetivo. Se surgir outra coisa no meio, anotar e fazer em outra branch.

---

## 2. Commits (Conventional Commits)

**Formato:**
```
<type>(<scope opcional>): <descrição>

<corpo opcional: o PORQUÊ, não o quê>
```

**Tipos:** `feat` · `fix` · `refactor` · `test` · `docs` · `style` (formatação) · `chore` · `perf` · `ci` · `build`

**Regras da mensagem:**
- Inglês, modo imperativo, minúsculo, sem ponto final: `add`, não `added`/`adds`
- Título ≤ 72 caracteres
- Scope = área do código: `feat(auth): ...`, `fix(timer): ...`
- Breaking change: `feat(api)!: ...` + `BREAKING CHANGE:` no corpo

✅ `feat(syllabus): parse pasted course syllabus into modules`
✅ `fix(notifications): schedule daily reminder in local timezone`
❌ `update files` · ❌ `fix bug` · ❌ `WIP` · ❌ `feat: add auth, recipes crud and tests`

---

## 3. Commits atômicos (regra mais importante)

- **1 commit = 1 mudança lógica** que faz sentido sozinha.
- Nunca misturar no mesmo commit: refactor + feature, formatação + lógica, várias features.
- Commitar a cada passo verde (compila / testes passam), não no fim da tarefa.
- Uma tarefa média deve gerar **3–8 commits**, nunca 1 commit gigante.
- Ordem natural: `chore` (setup) → `feat`/`fix` → `test` → `docs`.

---

## 4. Checklist antes de cada commit

- [ ] `git status` + `git diff --stat` revisados
- [ ] Adicionar arquivos **específicos** (`git add <arquivo>`), nunca `git add .` às cegas
- [ ] Nada de `.env`, segredos, `node_modules`, builds ou arquivos gerados
- [ ] Lint / typecheck / testes do projeto passando (se existirem)
- [ ] Mensagem segue a seção 2

---

## 5. Como o Claude deve agir

1. **Antes de começar:** confirmar em qual branch está; se for `main`, criar a branch da tarefa.
2. **Antes de cada commit:** mostrar a lista de arquivos + a mensagem proposta + **1–2 linhas explicando o que mudou e por quê** (preciso conseguir explicar isso numa entrevista).
3. **Commitar** só após o checklist da seção 4.
4. **Nunca, sem eu pedir explicitamente:** `push`, `push --force`, `rebase` em branch publicada, `reset --hard`, apagar branches, commitar na `main`, alterar histórico já publicado.
5. **Ao terminar a tarefa:** listar os commits feitos (`git log --oneline main..HEAD`) e sugerir título + descrição do PR.
6. Se a tarefa ficou grande demais para uma branch, **parar e propor** a divisão.

---

## 6. Pull Requests

- Mesmo sozinha: **toda branch entra na `main` via PR** (mostra processo profissional).
- Título do PR no formato de commit: `feat(syllabus): import course syllabus`
- Descrição:
  ```
  ## O quê
  ## Por quê
  ## Como testar
  ## Screenshots / GIF (se for UI)
  ```
- Merge: **"Rebase and merge"** ou **"Create a merge commit"**. **Não usar squash**: preserva os commits pequenos no histórico.

---

## 7. Versões e releases

- Marco concluído = tag semântica na `main`: `v0.1.0`, `v0.2.0`, `v1.0.0`
  - `MAJOR` quebra compatibilidade · `MINOR` nova funcionalidade · `PATCH` correção
- Criar **GitHub Release** com resumo do que entrou. Releases sinalizam projeto que *termina* coisas.

---

## 8. Coautoria com IA

- Manter o trailer `Co-Authored-By: Claude` quando o Claude escrever o código. Transparência sobre uso de IA é um ponto a favor.