// ATENÇÃO: usar noblox.js com o cookie .ROBLOSECURITY automatiza ações da SUA conta
// Roblox (amizades, presença). Isso viola os Termos de Uso do Roblox e pode resultar
// em banimento/suspensão da conta se abusado (ex: mandar muitos pedidos de amizade
// rapidamente). Use com moderação, só com amigos de verdade, e por sua conta e risco.

const noblox = require('@noblox/server');
const config = require('../config');

let logado = false;

async function garantirLogin() {
  if (logado) return true;
  const cookie = config.ROBLOX_COOKIE;
  if (!cookie) {
    throw new Error('ROBLOX_COOKIE não configurado no .env — os comandos de Roblox não vão funcionar sem ele.');
  }
  await noblox.setCookie(cookie);
  logado = true;
  return true;
}

module.exports = { noblox, garantirLogin };
