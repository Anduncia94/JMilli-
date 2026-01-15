# 🚀 Instrucciones de Despliegue en Netlify

## Pasos para Desplegar tu Aplicación

### 1. Crear cuenta en Netlify
- Ve a [netlify.com](https://netlify.com)
- Haz clic en "Sign Up" (Registrarse)
- Inicia sesión con tu cuenta de GitHub, GitLab o Bitbucket (recomendado)
- O crea una cuenta con tu correo electrónico

### 2. Subir tu proyecto a GitHub (si no lo has hecho)

Si aún no tienes el proyecto en GitHub:

1. Ve a [github.com](https://github.com) y crea una cuenta (si no tienes)
2. Crea un nuevo repositorio:
   - Haz clic en el botón "+" en la esquina superior derecha
   - Selecciona "New repository"
   - Dale un nombre (ej: `jmilli-tax-app`)
   - Deja todo lo demás por defecto
   - Haz clic en "Create repository"

3. Desde tu computadora, en la carpeta del proyecto, ejecuta:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git
   git push -u origin main
   ```

### 3. Desplegar en Netlify

#### **Opción A: Desde GitHub (Recomendado)**

1. En Netlify, haz clic en **"Add new site"** → **"Import an existing project"**

2. Selecciona **"Deploy with GitHub"**
   - Autoriza a Netlify para acceder a GitHub
   - Selecciona tu repositorio

3. Configuración del Build:
   - **Build command**: `npm run build` (debe aparecer automáticamente)
   - **Publish directory**: `dist` (debe aparecer automáticamente)
   - **Branch to deploy**: `main`

4. **IMPORTANTE**: Agrega las variables de entorno:
   - Haz clic en **"Add environment variables"**
   - Agrega estas dos variables:
     - `VITE_SUPABASE_URL` = (tu URL de Supabase)
     - `VITE_SUPABASE_ANON_KEY` = (tu clave anónima de Supabase)

5. Haz clic en **"Deploy site"**

#### **Opción B: Arrastrar y Soltar (Más Rápido)**

Si quieres desplegar rápido sin GitHub:

1. En tu computadora, ejecuta:
   ```bash
   npm run build
   ```
   Esto creará una carpeta `dist`

2. Ve a Netlify y arrastra la carpeta `dist` directamente al área de "drag and drop"

3. **IMPORTANTE**: Después del primer deploy, ve a:
   - **Site settings** → **Environment variables**
   - Agrega las variables:
     - `VITE_SUPABASE_URL` = (tu URL de Supabase)
     - `VITE_SUPABASE_ANON_KEY` = (tu clave anónima de Supabase)

4. Vuelve a hacer el build y despliega de nuevo

### 4. Configurar Variables de Entorno en Netlify

Para agregar o editar variables de entorno después:

1. Ve a tu sitio en Netlify
2. Haz clic en **"Site configuration"** → **"Environment variables"**
3. Haz clic en **"Add a variable"** o **"Edit variables"**
4. Agrega:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Guarda y haz un nuevo deploy

### 5. ¿Dónde encuentro las credenciales de Supabase?

Puedes encontrarlas en:

**Opción 1: En tu archivo `.env` local**
- Abre el archivo `.env` en tu proyecto
- Copia los valores de `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`

**Opción 2: En el panel de Supabase**
1. Ve a [supabase.com/dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **Settings** → **API**
4. Copia:
   - **Project URL** → Esta es tu `VITE_SUPABASE_URL`
   - **anon public** (en API Keys) → Esta es tu `VITE_SUPABASE_ANON_KEY`

### 6. Configurar Dominio Personalizado (Opcional)

Si quieres usar tu propio dominio (ej: `app.jmilli.com`):

1. Ve a **Domain management** en Netlify
2. Haz clic en **"Add custom domain"**
3. Ingresa tu dominio
4. Sigue las instrucciones para configurar los DNS

### 7. ¡Listo!

- En unos minutos tendrás tu URL: `https://tu-app.netlify.app`
- Cada vez que hagas cambios y los subas a GitHub, Netlify actualizará automáticamente
- La app estará disponible como PWA instalable

## Instalar la App en tu Teléfono

Una vez desplegada, tus clientes pueden instalarla:

1. Abre la URL en Safari (iOS) o Chrome (Android)
2. **En iPhone**:
   - Toca el botón de compartir (⎙)
   - Selecciona "Añadir a pantalla de inicio"
3. **En Android**:
   - Espera el banner "Instalar app" y toca "Instalar"
   - O toca el menú (⋮) → "Instalar aplicación"

Para instrucciones detalladas, consulta el archivo `INSTALL_APP.md`

## Actualizar la App

Para hacer cambios y actualizar:

1. Haz tus cambios en el código
2. Ejecuta:
   ```bash
   git add .
   git commit -m "Descripción de los cambios"
   git push
   ```
3. Netlify detectará los cambios y desplegará automáticamente
4. En 2-3 minutos estará actualizado

## Solución de Problemas

### "La app no carga"
- Verifica que las variables de entorno estén configuradas
- Revisa los logs del build en Netlify
- Asegúrate de que el archivo `netlify.toml` esté en la raíz del proyecto

### "Error de conexión a Supabase"
- Verifica que las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` estén correctas
- Ve a Supabase → Settings → API y verifica las credenciales

### "La app no funciona como PWA"
- Verifica que estés accediendo con HTTPS (Netlify lo provee automáticamente)
- Abre en Chrome (Android) o Safari (iPhone), no otros navegadores
- Revisa que el archivo `manifest.json` esté presente en la carpeta `public`

### "Cambios no se reflejan"
- Espera 2-3 minutos después del deploy
- Limpia el caché del navegador (Ctrl+Shift+R o Cmd+Shift+R)
- Si la app ya está instalada, ciérrala completamente y vuelve a abrirla

## Comandos Útiles

```bash
# Hacer build local para probar
npm run build

# Previsualizar el build localmente
npm run preview

# Linter (verificar errores)
npm run lint

# Verificar tipos de TypeScript
npm run typecheck
```

## Monitoreo

Netlify te ofrece:
- **Analytics**: Ve a tu sitio → Analytics (puede requerir plan de pago)
- **Logs**: Ve a Deploys → Logs para ver errores
- **Functions**: Si usas Netlify Functions, ve a Functions → Logs

## Seguridad

Netlify provee automáticamente:
- ✅ HTTPS (SSL gratuito)
- ✅ DDoS protection
- ✅ Headers de seguridad (configurados en `netlify.toml`)

**IMPORTANTE**:
- NUNCA subas tu archivo `.env` a GitHub
- El archivo `.gitignore` ya está configurado para ignorar `.env`
- Solo agrega variables de entorno en el panel de Netlify

---

**¿Necesitas ayuda?** Revisa la [documentación oficial de Netlify](https://docs.netlify.com/)
