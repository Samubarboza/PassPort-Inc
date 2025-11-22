
flowchart TD

A[1. Usuario envía login<br/>(correo + contraseña)] --> B

B[2. validarCorreoYContrasena<br/>- sanitiza<br/>- valida formato<br/>- valida longitud] --> C

C[3. Buscar usuario en DB<br/>modeloUsuario.buscar...] --> D

D[4. bcrypt.compare<br/>- compara hash] --> E

E[5. Crear sesión<br/>- genera idSesion<br/>- guarda en DB] --> F

F[6. Guardar cookie segura<br/>res.cookie(...)] --> G

G[7. Armar respuesta estándar<br/>respuestasEstandar.ok] --> H

H[8. res.json(...): enviar respuesta final]

# VERSIÓN EN PALABRAS

## El usuario manda correo + contraseña

## El backend limpia y valida los datos

## Busca si existe el usuario en la base

## Compara la contraseña con el hash guardado

## Si todo está bien, crea la sesión y la guarda

## Mete el idSesion en una cookie segura

## Arma una respuesta estándar

## Envía solo un JSON final al frontend
