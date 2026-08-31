import { lookup } from 'whois';

//pregunta al WHOIS, saca el nombre del registrador del texto, y nunca falla ruidosamente
export function lookupRegistrar(domain) {

  return new Promise((resolve) => {
    lookup(domain, { follow:0 ,timeout: 5000 }, (err, data) => {
      if (err || !data) {
        resolve('No encontrado');
        return;
      }
      const match = data.match(/Registrar:\s*(.+)/i);
      resolve(match ? match[1].trim() : 'No encontrado');
    });
  });
}
