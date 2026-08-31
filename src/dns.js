import dns from 'node:dns/promises';

dns.setServers(['8.8.8.8', '1.1.1.1']);

const orNotFound = (arr) => (arr && arr.length ? arr : 'No encontrado');

// corre un lookup; devuelve { value } si anda, { error: codigo } si falla
async function tryLookup(fn) {
  try {
    return { value: await fn() };
  } catch (e) {
    return { error: e.code };
  }
}

export async function resolveAll(domain) {
  const [a, mx, ns, txt, cname] = await Promise.all([
    tryLookup(() => dns.resolve4(domain)),
    tryLookup(() => dns.resolveMx(domain)),
    tryLookup(() => dns.resolveNs(domain)),
    tryLookup(() => dns.resolveTxt(domain)),
    tryLookup(() => dns.resolveCname(domain)),
  ]);

  // A y NS ya vienen como array de strings
  const A = a.value ?? null;
  const NS = ns.value ?? null;

  // MX: convierte objetos en strings "priority exchange"
  const MX = mx.value ? mx.value.map(r => `${r.priority} ${r.exchange}`) : null;

  // TXT: de strings de strings a strings
  const TXT = txt.value ? txt.value.map(chunks => chunks.join('')) : null;

  const CNAME = cname.value ?? null;

  // nxdomain: las 5 fallaron y todas con ENOTFOUND
  const nxdomain = [a, mx, ns, txt, cname].every(r => r.error === 'ENOTFOUND');
  
  const resolved = [a, mx, ns, txt, cname].some((r) => r.value);
  
  return {
    records: {
      A: orNotFound(A),
      MX: orNotFound(MX),
      NS: orNotFound(NS),
      TXT: orNotFound(TXT),
      CNAME: orNotFound(CNAME),
    },
    nxdomain,
    resolved,
};
}
