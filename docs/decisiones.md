# Decisiones de diseño

## Node.js + Express

Lenguaje conocido y Express es la opción estándar para una API chica. Una sola
dependencia para el servidor.

## Resolución DNS con librería nativa

Se usa `node:dns/promises` en lugar de ejecutar `nslookup` o `dig`:

- Es portable: no depende de binarios del sistema. En Windows `dig` y `host` no
  vienen instalados.
- Elimina la superficie de inyección de comandos: nunca se arma ni se ejecuta
  una línea de shell con el input del usuario.

## Servidores DNS públicos

`dns.setServers(['8.8.8.8', '1.1.1.1'])`.

El resolver configurado en la máquina puede interceptar respuestas (varios ISP
devuelven una IP de publicidad ante un dominio inexistente en vez de NXDOMAIN).
Se comprobó localmente. Con resolvers públicos la salida es predecible y la
detección de NXDOMAIN funciona.

## Validación del target

Regex de formato de dominio + normalización (`trim` y `toLowerCase`).

Como no se ejecuta ningún comando de shell, el regex alcanza como sanitización:
inputs como `; rm -rf /` o `$(whoami)` no matchean el formato y se rechazan con
400 antes de llegar a la resolución.

## WHOIS con follow: 0

La librería `whois`, por defecto, hace una segunda consulta al servidor del
registrador. Ese servidor limita las consultas y responde de forma inconsistente,
lo que hacía que el registrador apareciera intermitentemente como "No encontrado".

Con `follow: 0` se usa solo la respuesta del registro del TLD, que ya incluye la
línea `Registrar:` y es estable.

## Regla de status

- `healthy`: resuelve y tiene registros A
- `degraded`: resuelve algún registro pero no A
- `unknown`: no resuelve nada por un error de DNS que no es NXDOMAIN

## Códigos de error

- 400: target inválido (formato, vacío, no string) o JSON malformado
- 404: NXDOMAIN. No se arma el body del contrato, solo `{ error }`
- 500: cualquier excepción no prevista, atrapada por el error handler de Express

La app no se cae ante ningún input.

## Limitación conocida: WHOIS sobre subdominios

`www.github.com` devuelve `domain_registrar: "No encontrado"` porque solo el
dominio registrable (`github.com`) tiene datos WHOIS. Resolverlo correctamente
requeriría la Public Suffix List para separar el dominio registrable del
subdominio. Se deja fuera de alcance.
