
┌──────────────────────────────┐
│ 1. Usuario manda login        │
│    (correo + contraseña)      │
└───────────────┬──────────────┘
                │
                ▼
┌──────────────────────────────┐
│ 2. validarCorreoYContrasena  │
│   - sanitiza texto           │
│   - valida formato           │
│   - valida longitud          │
└───────────────┬──────────────┘
     error ─────┘          │ ok
                            ▼
┌──────────────────────────────┐
│ 3. modeloUsuario.buscar...   │
│   - busca usuario por correo │
└───────────────┬──────────────┘
     no existe ─┘          │ existe
                            ▼
┌──────────────────────────────┐
│ 4. bcrypt.compare            │
│   - compara contraseña hash  │
└───────────────┬──────────────┘
 contraseña mal ┘           │ correcta
                            ▼
┌──────────────────────────────┐
│ 5. modeloSesion.crear...     │
│   - crea idSesion            │
│   - calcula expiración       │
│   - guarda en DB             │
└───────────────┬──────────────┘
                ▼
┌──────────────────────────────┐
│ 6. res.cookie(...)            │
│   - guarda idSesion en cookie│
└───────────────┬──────────────┘
                ▼
┌──────────────────────────────┐
│ 7. respuestasEstandar.ok     │
│   - arma respuesta final     │
└───────────────┬──────────────┘
                ▼
┌──────────────────────────────┐
│ 8. res.json(...)              │
│   - ENVÍA una sola respuesta │
│     al frontend              │
└──────────────────────────────┘

# VERSIÓN EN PALABRAS

## El usuario manda correo + contraseña

## El backend limpia y valida los datos

## Busca si existe el usuario en la base

## Compara la contraseña con el hash guardado

## Si todo está bien, crea la sesión y la guarda

## Mete el idSesion en una cookie segura

## Arma una respuesta estándar

## Envía solo un JSON final al frontend
