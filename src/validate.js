// definimos el formato de dominio utilizando una expresión regular
// una o más "etiquetas" (letras/números/guiones, sin empezar ni terminar en guión, máx 63) separadas por puntos,
// y termina en un TLD de al menos 2 letras. google.com y sub.dominio.co.uk pasan; ; rm -rf /, $(whoami), hola mundo, google..com 
// no pasan porque tienen espacios, ;, $, (, / o puntos dobles.

const DOMAIN = /^(?=.{1,253}$)([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;
const clean = (target) => target.trim().toLowerCase();

export function validateDomain (target) {
    if (typeof target !== 'string') {
        throw new Error('Target must be a string');
    }
   
    target = clean(target);
    
    if (!DOMAIN.test(target)) {
        throw new Error('Invalid domain format');
    }

    return target;
}