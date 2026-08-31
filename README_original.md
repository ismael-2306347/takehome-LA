# Desafío Técnico

## Contexto

En el día a día de un desarrollador, entender qué pasa con un dominio es clave. Los comandos de red (`dig`, `nslookup`, `host`) devuelven información técnica que no siempre es fácil de leer rápidamente.

Tu misión: construir una API que actúe como un **intérprete de red inteligente**. Dado un dominio, la API debe ejecutar un lookup DNS real y devolver sus registros de forma estructurada y legible por otra máquina.

---

## Especificaciones Técnicas

- **Tiempo límite:** Hasta 24 horas
- **Lenguaje/Framework:** Libre (Node.js, Python, Go, etc.)

---

## Contrato de la API

### Endpoint

```
POST /analyze
```

### Input

```json
{
  "target": "google.com"
}
```

### Output esperado

```json
{
  "target": "google.com",
  "status": "healthy | degraded | unknown",
  "dns_records": {
    "A":     ["142.250.80.46"],
    "MX":    ["10 smtp.google.com"],
    "NS":    ["ns1.google.com"],
    "TXT":   "No encontrado",
    "CNAME": "No encontrado"
  },
  "domain_registrar": "MarkMonitor Inc."
}
```

> Cada tipo de registro que no tenga resultados debe retornar el string `"No encontrado"` en lugar de un array vacío.

---

## Requerimientos

1. **Ejecución real:** el backend debe resolver los registros DNS ejecutando un comando del sistema operativo (`dig`, `nslookup` o `host`) o usando una librería DNS nativa. No uses datos hardcodeados.

2. **Manejo de errores:** la API debe responder de forma clara ante:
   - Un dominio que no existe (`NXDOMAIN`)
   - Un input vacío o malformado
   - ⚠️ Un input malicioso como `; rm -rf /` o `$(whoami)` — *este punto se va a testear*

3. **Sin credenciales en el código:** si usás alguna variable de configuración, debe ir en un `.env` (no commiteado) con un `.env.example` como referencia.

---

## Criterios de Aceptación

**Correctitud del JSON**
La respuesta debe respetar exactamente el contrato definido: tipos de datos correctos, todos los campos presentes y el string `"No encontrado"` cuando corresponda.

**Seguridad del input**
El endpoint debe sanitizar el campo `target` antes de usarlo. Inputs como `; rm -rf /` o `$(whoami)` no deben ejecutarse ni romper la aplicación.

**Manejo de errores**
Los errores deben devolver un HTTP status code apropiado (400, 404, 500) con un mensaje descriptivo en JSON. La API nunca debe caerse ante un input inesperado.

**Código limpio**
El proyecto debe tener una estructura clara, nombres descriptivos y un `README` con instrucciones para correrlo localmente.

---

## Entrega

1. Hacé un **fork** de este repositorio
2. Trabajá en tu fork con commits claros y descriptivos
3. El proyecto debe incluir un script portable para correrlo (`.exe`, `.sh` o `.bat`)
4. Cuando termines, enviá por correo o mensaje la **URL de tu fork**
