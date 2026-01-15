# Admin Instructions - Tax Portal

## Información del Cliente

Los clientes ahora completan su propia información al registrarse:
- Nombre y apellido
- Últimos 4 dígitos del SSN
- Teléfono
- Dirección

**Como administrador, solo necesitas agregar la información de la compañía cuando aplique.**

## Agregar Información de Compañía

Para agregar información de compañía a un cliente existente:

### Ejemplo SQL:

```sql
-- Primero, encuentra al cliente por su email
SELECT id, email FROM auth.users WHERE email = 'cliente@ejemplo.com';

-- Obtén el perfil del cliente
SELECT * FROM client_profiles WHERE user_id = 'user-id-aqui';

-- Actualiza solo la información de la compañía
UPDATE client_profiles
SET
  company_name = 'Pérez LLC',
  company_ein = '12-3456789',
  updated_at = now()
WHERE user_id = 'user-id-aqui';
```

### Desde el Panel de Supabase:

1. Ve a la tabla `client_profiles`
2. Busca el registro del cliente por su `user_id` o email
3. Edita el registro y agrega:
   - **company_name**: Nombre de la compañía
   - **company_ein**: EIN de la compañía

## Subir Documentos para Clientes

Para subir documentos para un cliente:

### Opción 1: Desde el Panel de Supabase Storage

1. Ve a Storage > tax-documents
2. Crea una carpeta con el user_id del cliente
3. Sube los archivos en esa carpeta
4. Copia la URL pública del archivo

### Opción 2: Insertar registro en la tabla documents

```sql
-- Obtén el user_id del cliente
SELECT id, email FROM auth.users WHERE email = 'cliente@ejemplo.com';

-- Inserta el documento
INSERT INTO documents (
  user_id,
  title,
  type,
  file_url,
  category
) VALUES (
  'user-id-aqui',
  '2024 W2 Form',
  'W2',
  'https://your-supabase-url/storage/v1/object/public/tax-documents/user-id/document.pdf',
  'W2'
);
```

### Tipos de Documentos Disponibles:
- W2
- 1040
- Schedule A
- Schedule C
- Schedule D
- 1099-NEC
- 1099-MISC
- Other

## Gestionar Refund Tracker

Para actualizar la información del refund tracker:

```sql
-- Insertar o actualizar información de reembolso
INSERT INTO refund_tracker (
  user_id,
  tin,
  filing_status,
  estimated_refund
) VALUES (
  'user-id-aqui',
  '123-45-6789',
  'processed',
  2500.00
)
ON CONFLICT (user_id)
DO UPDATE SET
  tin = EXCLUDED.tin,
  filing_status = EXCLUDED.filing_status,
  estimated_refund = EXCLUDED.estimated_refund,
  last_checked = now();
```

## Notas Importantes

- Los clientes crean su propio perfil al registrarse
- Los clientes solo pueden **ver y descargar** sus documentos, no pueden subirlos o eliminarlos
- Solo tú puedes agregar/editar la información de compañía de los clientes
- Los clientes no pueden modificar `company_name` ni `company_ein`
- Asegúrate de usar el `user_id` correcto al insertar datos
- Los archivos deben estar en la carpeta correcta en Storage: `user-id/archivo.pdf`
