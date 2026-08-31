import { resolveAll } from './dns.js';
import { lookupRegistrar } from './whois.js';

//analiza un dominio y le asigna un status
export async function analyze(domain) {

  const [dns, registrar] = await Promise.all([
    resolveAll(domain),
    lookupRegistrar(domain),
  ]);

  if (dns.nxdomain) {
    return { notFound: true };
  }

  let status;
  if (dns.records.A !== 'No encontrado') {
    status = 'healthy';       // resuelve y tiene IP
  } else if (dns.resolved) {
    status = 'degraded';      // resuelve algo pero no tiene A
  } else {
    status = 'unknown';       // no resolvió nada y no es NXDOMAIN (error raro de DNS)
  }

  return {
    notFound: false,
    data: {
      target: domain,
      status,
      dns_records: dns.records,
      domain_registrar: registrar,
    },
  };
}
