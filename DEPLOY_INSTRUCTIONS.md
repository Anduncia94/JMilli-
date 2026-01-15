# Instrucciones de Despliegue en Vercel

## Pasos para Desplegar tu Aplicación

### 1. Crear cuenta en Vercel
- Ve a [vercel.com](https://vercel.com)
- Haz clic en "Sign Up" (Registrarse)
- Inicia sesión con tu cuenta de GitHub, GitLab o Bitbucket

### 2. Subir tu proyecto a GitHub
Si aún no tienes el proyecto en GitHub:
1. Ve a [github.com](https://github.com) y crea una cuenta (si no tienes)
2. Crea un nuevo repositorio (botón "New repository")
3. Desde tu computadora, en la carpeta del proyecto, ejecuta:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git
   git push -u origin main
   ```

### 3. Desplegar en Vercel
1. En Vercel, haz clic en "Add New Project"
2. Importa tu repositorio de GitHub
3. Vercel detectará automáticamente que es un proyecto Vite
4. **IMPORTANTE**: Agrega las variables de entorno:
   - `VITE_SUPABASE_URL` = (tu URL de Supabase)
   - `VITE_SUPABASE_ANON_KEY` = (tu clave anónima de Supabase)
5. Haz clic en "Deploy"

### 4. Listo!
- En unos minutos tendrás tu URL: `https://tu-app.vercel.app`
- Cada vez que hagas cambios y los subas a GitHub, Vercel actualizará automáticamente

## Instalar la App en tu Teléfono

Una vez desplegada:
1. Abre la URL en Safari (iOS) o Chrome (Android)
2. **En iOS**: Toca el botón de compartir → "Agregar a pantalla de inicio"
3. **En Android**: Toca el menú (⋮) → "Agregar a pantalla de inicio" o "Instalar app"

## ¿Necesitas las credenciales de Supabase?
Las puedes encontrar en tu archivo `.env` local o en el panel de Supabase:
- Ve a [supabase.com](https://supabase.com/dashboard)
- Selecciona tu proyecto
- Ve a Settings → API
- Copia "Project URL" y "anon public"
