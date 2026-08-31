# Intérprete de red

API que recibe un dominio, resuelve sus registros DNS y consulta su registrador,
y devuelve todo de forma estructurada.

## Requisitos

- Node.js 20 o superior

## Cómo correrlo

    run.bat      # Windows
    ./run.sh     # Linux / Mac

El script instala las dependencias si hace falta y levanta el servidor en el
puerto 3000. También se puede usar `npm install` y `npm start` directamente.

## Configuración

Las variables van en un archivo `.env` (ver `.env.example`):

- `PORT`: puerto del servidor (por defecto 3000)

## Uso

### `POST /analyze`

Request:

```json
{ "target": "google.com" }
```

Response (200):

```json
{
  "target": "google.com",
  "status": "healthy",
  "dns_records": {
    "A": ["142.250.80.46"],
    "MX": ["10 smtp.google.com"],
    "NS": ["ns1.google.com"],
    "TXT": "No encontrado",
    "CNAME": "No encontrado"
  },
  "domain_registrar": "MarkMonitor Inc."
}
```

Cada tipo de registro sin resultados devuelve el string `"No encontrado"` en
lugar de un array vacío.

El campo `status` puede tomar tres valores:

- `healthy`: el dominio resuelve y tiene registros A
- `degraded`: el dominio resuelve pero no tiene registros A
- `unknown`: el dominio no resuelve por un error de DNS que no es NXDOMAIN

### Errores

| Situación | Código |
|---|---|
| `target` ausente, vacío o con formato inválido | 400 |
| JSON malformado | 400 |
| El dominio no existe (NXDOMAIN) | 404 |
| Error interno | 500 |

Los errores devuelven un JSON con la forma `{ "error": "descripción" }`.

## Tests

```
npm test
```

Cubren la validación y sanitización del campo `target`.

## Decisiones de diseño

Ver [docs/decisiones.md](docs/decisiones.md).
