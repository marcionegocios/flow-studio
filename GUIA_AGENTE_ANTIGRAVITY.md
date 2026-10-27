# 🎬 Guia Oficial de Instrução para Antigravity: Flow Studio & Flow MCP

> **Como usar este documento:**  
> Copie e cole a seção **"Prompt Mestre de Inicialização"** abaixo diretamente no chat do seu **Antigravity**.  
> O agente absorverá todo o conhecimento operacional do Flow Studio, sabendo exatamente como criar roteiros, operar o sistema, economizar créditos e produzir vídeos de alta qualidade sem que você precise ensiná-lo do zero.

---

## 🚀 Prompt Mestre de Inicialização (Copie e Cole no Antigravity)

```markdown
Você agora é o Diretor Técnico e Criativo de Produção Audiovisual do ecossistema Flow Studio (flow-mcp).
Sua missão é criar, roterizar, orquestrar e produzir vídeos e clipes de alta qualidade usando o Google Flow (flow.google.com) através do Flow Studio e das ferramentas MCP instaladas na máquina.

Siga rigorosamente as diretrizes operacionais abaixo:

1. ARQUITETURA E AMBIENTE:
- O Flow Studio roda localmente na máquina através de um servidor Node.js/TypeScript (porta 8787).
- A automação conecta-se ao Google Flow via Chrome dedicado rodando em porta CDP 9333 com perfil próprio em `~/.flow-mcp/chrome-profile`.
- Você tem acesso às ferramentas de automação `flow_*` (MCP) e aos scripts `.cmd` da pasta raiz do projeto.
- O painel visual do Studio fica acessível em: http://127.0.0.1:8787.

2. FLUXO DE PRODUÇÃO OBRIGATÓRIO (ECONOMIA DE CRÉDITOS):
- PASSO 1 (Sessão): Sempre verifique se o Flow está conectado chamando `flow_status`. Se não estiver, oriente o usuário a executar `1_Conectar_Google_Flow.cmd`.
- PASSO 2 (Personagens): Para manter consistência visual, crie ou selecione personagens no `Cast` (`flow_character`) antes de gerar cenas.
- PASSO 3 (Stills/Frames Gratuitos): NUNCA gere vídeos diretamente sem validar a cena antes. Crie primeiro imagens estáticas (`Frames` ou `flow_agent_images`). Imagens custam ZERO créditos! Valide o enquadramento, iluminação e estilo visual primeiro.
- PASSO 4 (Takes em Vídeo): Após aprovar os frames, gere os takes de vídeo (`Shots` ou `flow_generate`). Priorize takes de 5s a 10s com `chain_previous` ou `flow_continue` para continuidade de movimento e personagens.
- PASSO 5 (Montagem e Sincronismo): Monte o vídeo final (`Cut` ou `flow_assemble`), calculando com precisão o tempo de transição (ex: crossfade de 1s consome 1s de sobreposição entre takes).

3. SINCRONISMO CIRÚRGICO DE ÁUDIO E VÍDEO:
- Em clipes musicais e vídeos com narração, mapeie cada take com a barra de tempo da letra/fala.
- Quando a letra cantar um simbolismo forte (ex: "foi na cruz...", "...a luz me alcançou"), a imagem correspondente DEVE estar em tela exatamente nesse segundo.
- Se houver transições suaves, compense o tempo no roteiro (ex: use takes de 10s para garantir margem de corte sem perder a sincronia do verso).

4. TRATAMENTO DEFENSIVO DE ERROS:
- Se encontrar erro de "Not connected" ou "Chrome closed", peça ao usuário para abrir `1_Conectar_Google_Flow.cmd` e deixar a janela do Chrome aberta em um projeto.
- Se uma mídia foi gerada no Flow mas não baixou, use `flow_download` em vez de gastar créditos gerando de novo.
- Responda sempre em português brasileiro de forma técnica, concisa e orientada a resultados.
```

---

## 🛠️ Arquitetura e Como o Flow Studio Funciona

```
┌────────────────────────┐      stdio (JSON-RPC)      ┌────────────────────────┐
│      Antigravity       │ ◄────────────────────────► │        flow-mcp        │
│   (Agente Autônomo)    │                            │    (Servidor Local)    │
└────────────────────────┘                            └───────────┬────────────┘
                                                                  │
                                                Chrome DevTools   │ HTTP :8787
                                                Protocol (:9333)  │ (Web Studio)
                                                                  ▼
                                                      ┌────────────────────────┐
                                                      │  Google Chrome Profile │
                                                      │   (flow.google.com)    │
                                                      └────────────────────────┘
```

1. **`1_Conectar_Google_Flow.cmd`**: Abre o Chrome dedicado na porta CDP 9333 com o perfil `~/.flow-mcp/chrome-profile`. O usuário faz login uma única vez e abre um projeto no Flow.
2. **`2_Abrir_Flow_Studio.cmd`** ou **`Flow Studio.cmd`**: Inicia o servidor Web local (`http://127.0.0.1:8787`), permitindo usar a interface visual ou controlar tudo via Antigravity.
3. **`flow-mcp` (Servidor MCP)**: Executa no processo de fundo e traduz comandos do Antigravity em ações reais no Google Flow, sem consumir APIs pagas de vídeo (utiliza os créditos diários gratuitos do Flow).

---

## ⚙️ Como Configurar o Antigravity para Usar o Flow MCP

Para que o Antigravity reconheça nativamente todas as ferramentas `flow_*`, adicione o servidor ao seu arquivo `mcp_config.json`:

1. No Antigravity, acesse as configurações de MCP (`Manage MCP Servers` ou abra o arquivo `mcp_config.json` em `%USERPROFILE%\.gemini\antigravity\mcp_config.json`).
2. Adicione a seguinte entrada dentro de `"mcpServers"`:

```json
{
  "mcpServers": {
    "flow": {
      "command": "node",
      "args": [
        "D:\\Projetos\\flow-mcp\\dist\\index.js"
      ]
    }
  }
}
```
*(Substitua o caminho pelo local onde o Flow Studio está instalado no seu computador).*

---

## 📚 Dicionário de Ferramentas (Tool Reference)

O Antigravity pode chamar diretamente as seguintes ferramentas:

| Ferramenta | O que faz | Custo em Créditos |
|---|---|---|
| `flow_status` | Verifica se o Chrome está aberto, se há um projeto ativo e quantos créditos restam. | **0 créditos** (Grátis) |
| `flow_agent_images` | Gera lotes de até 50 imagens em paralelo usando o modo Agent do Flow. Ideal para concept art e storyboards rápidos. | **0 créditos** (Grátis) |
| `flow_character` | Cria um personagem reutilizável a partir de uma descrição ou imagem de referência. Garante consistência de rosto/corpo. | **0 créditos** (Grátis) |
| `flow_character_edit` | Edita o visual ou figurino de um personagem já existente mantendo sua identidade. | **0 créditos** (Grátis) |
| `flow_characters` | Lista todos os personagens criados no projeto atual. | **0 créditos** (Grátis) |
| `flow_generate` | Adiciona à fila de geração: imagens ou vídeos, definindo resolução, duração (5s a 10s), proporção (16:9, 9:16) e técnica de câmera. | Imagem: **0** / Vídeo: **~10-25** |
| `flow_continue` | Continua um clipe a partir do último frame do clipe anterior **mantendo o personagem anexado**. | **~15-25 créditos** |
| `flow_download` | Baixa novamente qualquer vídeo ou imagem já existente no projeto do Flow sem precisar regerar. | **0 créditos** (Grátis) |
| `flow_techniques` | Lista as 39 técnicas de câmera e transição pré-configuradas (ex: Drone Shot, Orbit, Whip Pan, Dolly Zoom). | **0 créditos** (Grátis) |
| `flow_narrate` | Gera locução/narração em áudio usando vozes do Gemini ou vozes locais do computador. | **0 créditos** (Grátis) |
| `flow_assemble` | Junta múltiplos clipes gerados em um vídeo final (MP4) usando FFmpeg, aplicando transições, trilha sonora e narração. | **0 créditos** (Grátis) |

---

## 🎬 Guia de Roteiro e Sincronismo para Clipes Musicais

Ao criar clipes ou vídeos musicais, o Antigravity deve agir como um **Roteirista e Diretor Musical**:

1. **Humanização e Emoção:**
   * Evite prompts genéricos ou robóticos.
   * Destaque expressões faciais: "olhar reflexivo com sorriso sutil e caloroso", "olhar de gratidão serena".
   * Estabeleça iluminação cinematográfica quente e paleta de cores coerente com o sentimento da canção.

2. **Cálculo de Transições:**
   * Se um verso da música tem **8 segundos** e haverá uma transição de **1 segundo de crossfade** para a próxima cena:
     * O take precisa ter pelo menos **9 a 10 segundos**.
     * O clímax visual do verso deve ocorrer entre o 3º e o 6º segundo, para nunca ser engolido pela transição.

3. **Alternância entre Concreto e Poético:**
   * **Cenas Concretas:** Mostram ações reais do cotidiano e interação humana (ex: arrumar a mochila, oração em família, abraço afetuoso).
   * **Cenas Poéticas/Abstratas:** Simbolismos espirituais, majestade e poder (ex: fachos de luz dourada rompendo nuvens densas, raios solares sobre águas cristalinas, montanhas imponentes).

---

## 🔧 Solução de Problemas Comuns (Troubleshooting)

* **Status "Not connected" ou "Chrome closed":**
  * Solução: Feche janelas fantasmas do Chrome e execute `1_Conectar_Google_Flow.cmd`. Certifique-se de que a aba do Google Flow esteja aberta com um projeto ativo.
* **Erro de "EXDEV: cross-device link not permitted":**
  * Solução: O Flow Studio já foi atualizado com fallback automático para cópia de arquivos entre discos diferentes.
* **Geração demorando:**
  * O Flow possui fila e processamento assíncrono. O Antigravity deve consultar o progresso via `flow_wait` em vez de cancelar a tarefa antes do tempo.
* **A janela do instalador fechava rápido:**
  * Solução: Utilize a versão v1.0.0 corrigida com `criar_atalho.vbs` e execução sequencial sem conflito de parênteses.
