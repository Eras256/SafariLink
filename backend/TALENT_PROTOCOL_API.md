# Talent Protocol API Integration

## API Key

La API key de Talent Protocol está configurada en el código por defecto, pero puedes configurarla como variable de entorno:

```bash
TALENT_PROTOCOL_API_KEY=your_talent_protocol_api_key_here
```

## Endpoints Utilizados

### 1. Búsqueda Avanzada de Perfiles
- **Endpoint**: `POST /search/advanced/profiles`
- **Header**: `X-API-KEY: {api_key}`
- **Body**: 
```json
{
  "account_identifiers": ["0x..."],
  "limit": 1
}
```

### 2. Obtener Perfil por Account Identifier
- **Endpoint**: `GET /profile?account_identifier={address}`
- **Header**: `X-API-KEY: {api_key}`

## Base URL

```
https://api.talentprotocol.com
```

## Documentación

- API Reference: https://docs.talentprotocol.com/docs/developers/talent-api/api-reference
- Getting Started: https://docs.talentprotocol.com/docs/developers/talent-api

## Notas

- Todos los endpoints requieren autenticación usando el header `X-API-KEY`
- La API usa REST en lugar de GraphQL
- Los endpoints están organizados alrededor de "Profiles" como entidad central

