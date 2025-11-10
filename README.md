# Práctica: Express Mini-Project - Travel Reviews

Vamos a construir una aplicación CRUD completa de reseñas de viajes usando:
- Express
- Handlebars
- LowDB
- Tailwind CSS
- Cloudinary.

## Primeros Pasos

### 1. Fork & Clone

1. Haz **Fork** de este repositorio
2. Clona tu fork y navega a la carpeta del proyecto

### 2. Configuración del Proyecto

1. Instalar dependencias: `npm install`
2. Crear un archivo `.env` basado en `.env.example` y configurar las variables de entorno
3. Iniciar el servidor: `npm start` el cual ejecuta `node --watch app.js`.
4. Verificar que el servidor está corriendo en `http://localhost:3000`

## Estructura del Proyecto

Vamos a seguir la siguiente estructura:

```bash
express-mini-project/
├── app.js                      # Archivo principal del servidor
├── routes/
│   └── reviews.js              # Rutas de reviews
├── db/
│   ├── connection.js           # Configuración de LowDB
│   └── db.json                 # Base de datos
├── views/
│   ├── layouts/
│   │   └── main.handlebars     # Layout principal
│   └── reviews/
│       ├── list.handlebars     # Lista de destinos
│       ├── detail.handlebars   # Detalle de destino
│       ├── new.handlebars      # Formulario crear
│       └── edit.handlebars     # Formulario editar
├── public/
│   └── (archivos estáticos opcionales)
├── .env.example                # Plantilla para variables de entorno
├── .env                        # Tu archivo de configuración (CREAR)
├── .gitignore                  # Archivos a ignorar en git
└── package.json                # Dependencias del proyecto
```

## Tu Tarea

Vamos a construir una aplicación completa con las siguientes funcionalidades:

- **CREATE**: Crear nuevas reseñas de viajes con una imagen
- **READ**: Ver lista de destinos y detalle individual
- **UPDATE**: Editar reseñas existentes
- **DELETE**: Eliminar reseñas

Cada reseña tendrá:
- **Destino**: Nombre del lugar (ej: "Barcelona, España")
- **Título**: Título de la reseña (ej: "Ciudad increíble con mucha historia")
- **Comentario**: Texto descriptivo de la experiencia
- **Valoración**: Rating de 1 a 5 estrellas
- **Imagen**: Foto del destino (subida a Cloudinary)

---

## Iteración 0: Configuración Inicial

### Paso 1: Crear archivo `.env`

Crea un archivo `.env` basado en `.env.example` con tus credenciales de Cloudinary:

```bash
PORT=3000
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
```

### Paso 2: Verificar instalación

```bash
npm install
npm start
```

Deberías ver: `Server running at http://localhost:3000`

---

## Iteración 1: Estructura Base y Layout

### Objetivo
Crear el layout principal con Tailwind CSS y configurar Handlebars correctamente.

### Tareas

1. **Crear `views/layouts/main.handlebars`**.  
   Añade un menu de navegación.

2. **Configurar `app.js`**

   Añade las siguientes configuraciones en `app.js`:

   - **Configurar express-handlebars:**
   ```js
   import { engine } from 'express-handlebars';

   app.engine('handlebars', engine());
   app.set('view engine', 'handlebars');
   ```

   - **Configurar archivos estáticos:**
   ```js
   app.use(express.static('public'));
   ```

   - **Configurar middleware para procesar formularios:**
   ```js
   app.use(express.urlencoded({ extended: true }));
   ```

   - **Importar y usar las rutas de reviews:**
   ```js
   import reviewsRouter from './routes/reviews.js';

   app.use('/reviews', reviewsRouter);
   ```

3. **Crear vista temporal `views/reviews/list.handlebars`** con un texto de prueba.

4. **Crear ruta de prueba en `routes/reviews.js`**

   ```js
   router.get('/', (req, res) => {
     res.render('reviews/list', { reviews: [] });
   });
   ```


**Resultado esperado:** Al visitar `http://localhost:3000/reviews`, deberías ver tu página.

---

## Iteración 2: Listar Destinos (READ - List)

### Objetivo
Mostrar una lista de todos los destinos con sus reseñas.

### Tareas

1. **Implementar ruta GET `/` en `routes/reviews.js`**
   - Importar la conexión a la base de datos: `import db from '../db/connection.js'`
   - Leer los datos usando LowDB
   - Renderizar la vista `reviews/list` pasando los destinos

2. **Crear `views/reviews/list.handlebars`**
   - Mostrar para cada destino: imagen, destino, título, valoración
   - Añadir enlace "Ver detalle" que apunte a `/reviews/:id`

**Resultado esperado:** Ver una lista con todos los destinos almacenados en la base de datos.

![Screenshot](travel-reviews-home.webp)

---

## Iteración 3: Ver Detalle de un Destino (READ - Detail)

### Objetivo
Mostrar toda la información de un destino específico.

### Tareas

1. **Implementar ruta GET `/:id` en `routes/reviews.js`**
2. **Crear `views/reviews/detail.handlebars`**
   - Mostrar imagen del destino (grande)
   - Mostrar: destino, título, comentario completo, valoración
   - Añadir botones:
     - "Volver a la lista" → `/reviews`
     - "Editar" → `/reviews/:id/edit`
     - "Eliminar" → Formulario POST a `/reviews/:id/delete`

**Resultado esperado:** Ver toda su información detallada.

![Screenshot](travel-reviews-read.webp)

---

## Iteración 4: Crear Nuevo Destino - Formulario (CREATE - Parte 1)

### Objetivo
Mostrar un formulario para crear una nueva reseña.

### Tareas

1. **Implementar ruta GET `/new` en `routes/reviews.js`**
2. **Crear `views/reviews/new.handlebars`**
   - Crear formulario con método POST que envíe a `/reviews`
   - Configurar `enctype="multipart/form-data"` para subir archivos
   - Campos del formulario:
     - `destination` (text, requerido)
     - `title` (text, requerido)
     - `comment` (textarea, requerido)
     - `rating` (select con opciones 1-5, requerido)
     - `image` (file, requerido, accept="image/*")
   - Botones: "Guardar" y "Cancelar" (enlace a `/reviews`)

**Resultado esperado:** Ver un formulario para crear un nuevo destino.

![Screenshot](travel-reviews-create.webp)

---

## Iteración 5: Crear Nuevo Destino - Procesar (CREATE - Parte 2)

### Objetivo
Procesar el formulario, subir imagen a Cloudinary y guardar en la base de datos.

### Tareas

1. **Configurar Cloudinary en `app.js`**
   - Importar y configurar Cloudinary con variables de entorno
   - Configurar multer con memory storage para manejar archivos

2. **Implementar ruta POST `/` en `routes/reviews.js`**
   - Subir imagen a Cloudinary usando `cloudinary.uploader.upload()`
   - Crear objeto del nuevo destino:
     ```js
     {
       id: crypto.randomUUID(),
       destination: req.body.destination,
       title: req.body.title,
       comment: req.body.comment,
       rating: req.body.rating,
       imageUrl: resultado_de_cloudinary.secure_url,
       imagePublicId: resultado_de_cloudinary.public_id
     }
     ```

**Resultado esperado:** Al enviar el formulario, el nuevo destino aparece en la lista.

---

## Iteración 6: Editar Destino - Formulario (UPDATE - Parte 1)

### Objetivo
Mostrar un formulario pre-cargado con los datos del destino para editarlo.

### Tareas

1. **Implementar ruta GET `/:id/edit` en `routes/reviews.js`**

2. **Crear `views/reviews/edit.handlebars`**
   - Pre-cargar los valores del formulario
   - Mostrar la imagen
   - Botones: "Actualizar" y "Cancelar"

**Resultado esperado:** Ver el formulario con los datos del destino pre-cargados.

![Screenshot](travel-reviews-edit.webp)

---

## Iteración 7: Editar Destino - Actualizar (UPDATE - Parte 2)

### Objetivo
Procesar la actualización, opcionalmente subir nueva imagen y guardar cambios.

### Tareas

1. **Implementar ruta POST `/:id` en `routes/reviews.js`**
   - Si hay nueva imagen, eliminar la antigua de Cloudinary y subir la nueva
   - Si NO hay nueva imagen, mantener la URL existente
   - Actualizar los datos del destino:
     ```js
     db.data.reviews[index] = {
       ...db.data.reviews[index],
       destination: req.body.destination,
       title: req.body.title,
       comment: req.body.comment,
       rating: req.body.rating,
       imageUrl: nuevaUrl || urlExistente,
       imagePublicId: nuevoPublicId || publicIdExistente
     }
     ```
   - Redireccionar a `/reviews/:id`

**Resultado esperado:** Al actualizar, los cambios se reflejan en el detalle del destino.

---

## Iteración 8: Eliminar Destino (DELETE)

### Objetivo
Eliminar un destino de la base de datos y su imagen de Cloudinary.

### Tareas

1. **Implementar ruta POST `/:id/delete` en `routes/reviews.js`**
   - Eliminar la imagen de Cloudinary usando `cloudinary.uploader.destroy(imagePublicId)`
   - Eliminar el destino de la base de datos
   - Al finalizar, la página debe redireccionar a `/reviews`

2. **Verificar que el botón eliminar está en `views/reviews/detail.handlebars`**
   - Debe ser un formulario POST a `/reviews/{{id}}/delete`
   - Añadir confirmación JavaScript: `onsubmit="return confirm('¿Estás seguro?')"`

**Resultado esperado:** Al eliminar un destino, desaparece de la lista y su imagen se elimina de Cloudinary.

---

## Recursos Útiles

- [Express Routing](https://expressjs.com/en/guide/routing.html)
- [Express Handlebars](https://github.com/express-handlebars/express-handlebars)
- [LowDB Documentation](https://github.com/typicode/lowdb)
- [Cloudinary Node.js SDK](https://cloudinary.com/documentation/node_integration)
- [Tailwind CSS](https://tailwindcss.com/docs)
