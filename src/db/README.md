# Base de Datos Hospital

La aplicación tendrá 3 colecciones

- Usuarios
- Médicos
- Hospitales

## Colección Usuarios

- Nombre: `string`
  - **obligatorio**
- e-Mail: `string` (_Correo electrónico_)
  - Es el username.
  - **obligatorio**
  - **único**
- Contraseña: `string`
  - **obligatorio**
  - **encriptado**
- Imagen: `string`
- Role: `string`
  - **obligatorio**
  - **rol por defecto**
- Google: `boolean`
  - **opcional**
  - **Autentificación por Google**

## Colección Médicos

- Nombre: `string`
  - **obligatorio**
- Imagen: `string`
  - **opcional**
- Usuario: `Usuario`
  - Referencia al usuario.
  - **obligatorio**
- Hospital: `Hospital`
  - Referencia al hospital.
  - **opcional**

## Colección Hospital

- Nombre: `string`
  - **obligatorio**
- Imagen: `string`
  - **opcional**
- Usuario: `Usuario`
  - Referenci al usuario que creó el hospital.
  - **obligatorio**
