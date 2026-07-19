# Fixes para errores del navegador

## Error original (errors.txt)
```
Plugin: vite:react-babel
File: /media/alvaro/service/project-stack/guiones/frontend/src/components/Notification.tsx
  at Scope.checkBlockScopedCollisions
```

## Causa
Colisión de nombres en el scope de Babel/TypeScript entre:
1. El tipo `Notification` importado desde `../types/index.ts`
2. El componente `Notification` definido en el mismo archivo `Notification.tsx`

Cuando TypeScript compila, ve dos declaraciones con el mismo nombre `Notification` en el mismo scope, lo que causa el error de "block-scoped collision".

## Solución

### Archivo: `src/components/Notification.tsx`

1. **Cambio en el import:**
   ```typescript
   // Antes:
   import { Notification, NotificationType } from "../types";
   
   // Después:
   import { Notification as NotificationTypeInterface, NotificationType } from "../types";
   ```

2. **Actualización del tipo en NotificationProps:**
   ```typescript
   interface NotificationProps {
     notification: NotificationTypeInterface;  // Cambiado de Notification
     onDismiss: (id: string) => void;
   }
   ```

3. **Renombrado del componente:**
   ```typescript
   // Antes:
   export const Notification = ({ notification, onDismiss }: NotificationProps) => {
   
   // Después:
   export const NotificationComponent = ({ notification, onDismiss }: NotificationProps) => {
   ```

4. **Eliminación de código no utilizado:**
   - Eliminado `const [isVisible, setIsVisible] = useState(true);` ya que no se usaba
   - Simplificado el condicional: `if (isExiting) return null;`

5. **Definición explícita de NotificationContainerProps:**
   ```typescript
   interface NotificationContainerProps {
     notifications: NotificationTypeInterface[];
     onDismiss: (id: string) => void;
   }
   ```

6. **Exportaciones:**
   ```typescript
   export const Notification = NotificationComponent;
   export default NotificationComponent;
   ```

### Archivo: `src/App.tsx`

1. **Import del tipo Notification:**
   ```typescript
   import type { Notification as NotificationType } from "./types";
   ```

2. **Actualización del useState:**
   ```typescript
   // Antes:
   const [notifications, setNotifications] = useState<{
     id: string; 
     type: "success" | "error" | "info" | "warning"; 
     message: string
   }[]>([]);
   
   // Después:
   const [notifications, setNotifications] = useState<NotificationType[]>([]);
   ```

## Resultado
✅ El error de Babel/TypeScript ha sido resuelto
✅ El servidor de desarrollo de Vite se inicia sin errores de compilación
✅ La aplicación puede ahora ser ejecutada en el navegador sin el error original

## Notas
- El error de conexión al backend (ECONNREFUSED ::1:8000) es normal si el backend no está corriendo
- Para ejecutar la aplicación completa, necesitas iniciar tanto el backend como el frontend
