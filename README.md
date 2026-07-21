# Bot Pessoal

Bot de Discord pra zoeira com os amigos: comandos de zoeira, conversores de vídeo/imagem em GIF e integração com Roblox.

## 1. Criar o bot no Discord (modo App instalável / User Install)

1. Vá em https://discord.com/developers/applications e crie uma aplicação.
2. Na aba **Bot**, clique em "Reset Token" e copie o token.
3. Ative os **Privileged Gateway Intents**: `MESSAGE CONTENT INTENT`.
4. Vá na aba **Installation** (menu lateral):
   - Em **Installation Contexts**, deixe marcado só **User Install** (desmarque **Guild Install** se estiver marcado).
   - Em **Default Install Settings**, na aba "User Install", adicione o scope `applications.commands`.
   - Copie o **Install Link** que aparece ali em cima — é esse link que você (ou qualquer amigo) usa pra instalar o app na própria conta.
5. Pegue o **Application ID** (aba General Information) — é o `CLIENT_ID`.

⚠️ Como o app roda como **User Install**, algumas coisas mudam:
- Ele funciona em qualquer servidor onde você estiver (sem precisar de permissão de admin pra convidar bot) e também em DMs.
- Comandos que dependem de dados do servidor (`/rifa`, `/gado`) só funcionam quando usados dentro de um servidor, não em DM.
- O bot não consegue reagir sozinho a mensagens de outras pessoas nem ler o conteúdo delas automaticamente — só responde quando alguém chama um comando `/`.
- As respostas de um app instalado por usuário, quando usadas num servidor onde o app não foi formalmente adicionado, geralmente só ficam visíveis pra quem usou o comando (não pro servidor todo) — isso é um comportamento do próprio Discord, não do código.

## 2. Configurar o config.js

Abra o arquivo `config.js` na raiz do projeto e preencha direto:

```js
module.exports = {
  DISCORD_TOKEN: 'seu_token_aqui',
  CLIENT_ID: 'id_da_aplicacao',
  GUILD_ID: 'id_do_seu_servidor',   // pode deixar '' pra registrar globalmente (demora até 1h)
  ROBLOX_COOKIE: '',               // só preencha se for usar os comandos /roblox
};
```

### Como pegar o ROBLOX_COOKIE (.ROBLOSECURITY)

1. Abra roblox.com no navegador (Chrome/Edge/Firefox) e faça login normalmente.
2. Aperte **F12** pra abrir o DevTools.
3. Vá na aba **Application** (Chrome/Edge) ou **Armazenamento** (Firefox) → **Cookies** → `https://www.roblox.com`.
4. Procure o cookie chamado **`.ROBLOSECURITY`** e copie o valor inteiro (é bem longo, começa com algo como `_|WARNING:-DO-NOT-SHARE-THIS...`).
5. Cole esse valor completo (incluindo o aviso `WARNING...`) no `ROBLOX_COOKIE` do `config.js`.

**⚠️ Esse cookie dá acesso total à sua conta Roblox (login, senha, tudo).**
- Nunca compartilhe com ninguém, nunca suba `config.js` preenchido pra um GitHub público.
- Ele expira de tempos em tempos (geralmente quando você troca de IP/dispositivo ou muda a senha) — se os comandos de Roblox pararem de funcionar, é só pegar um cookie novo.
- Automatizar pedidos de amizade e consulta de presença viola os Termos de Uso do Roblox — o risco de suspensão da conta é seu, use com moderação (evite chamar `/roblox online` em excesso).

## 3. Rodar localmente (teste antes de subir)

```
npm install
npm run deploy   # registra os slash commands
npm start        # liga o bot
```

## 4. Subir na Discloud

1. Preencha o `config.js` com seus dados reais (token, IDs, cookie).
2. Rode `npm install` localmente antes, se quiser testar (a Discloud também instala sozinha via `package.json`).
3. Zipe a pasta inteira do projeto já com o `config.js` preenchido.
4. No Discord da Discloud, use `/commit` no seu bot ou envie o zip pela dashboard/comando de upload.
5. Rode o `deploy-commands.js` uma vez (localmente ou via terminal da Discloud) pra registrar os comandos.

**Atenção:** como o token/cookie agora ficam dentro do `config.js`, esse zip vira um arquivo sensível — guarde ele só com você, não poste em lugar nenhum público.

## Comandos disponíveis

**Zoeira:**
- `/dado [lados]`
- `/8ball <pergunta>`
- `/roleta-russa`
- `/rifa entrar` / `/rifa sortear`
- `/gado add <usuario>` / `/gado ranking`
- `/fake-ban <usuario> [motivo]`
- `/zoar <usuario>`

**Mídia:**
- `/video2gif <video> [duracao]` — converte um vídeo anexado em GIF
- `/img2gif <imagem> [duracao]` — converte uma imagem em GIF com efeito de zoom

**Roblox** (precisa de `ROBLOX_COOKIE` configurado):
- `/roblox vincular <usuario_roblox>` — cada pessoa vincula o próprio Discord ao Roblox
- `/roblox status <usuario>` — vê se tá online e em qual jogo
- `/roblox online` — lista todo mundo vinculado que tá online agora
- `/roblox add-amigo <usuario>` — manda pedido de amizade no Roblox

## Avisos importantes

- Os comandos de Roblox usam a biblioteca não-oficial `noblox.js` autenticada com o cookie da sua conta. Isso **não é uma API oficial do Roblox** e viola os Termos de Uso — use com moderação (não chame `/roblox online` toda hora, por exemplo) pra reduzir o risco de a Roblox suspeitar de automação.
- `/roleta-russa` e `/fake-ban` são só zoeira em texto, não banem nem fazem nada real no servidor.
- Vídeos maiores que 25MB não são aceitos no `/video2gif`.
"# asdasd" 
"# asdasdaaa" 
