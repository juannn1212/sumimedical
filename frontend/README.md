# Frontend - Sistema de Órdenes

## 📋 Descripción

Frontend desarrollado en Next.js 14 con App Router que permite:

- ✅ Subir archivos CSV/JSON con órdenes
- ✅ Listar todas las órdenes con paginación y filtros
- ✅ Consultar el estado de una orden específica

## 🚀 Instalación

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar variables de entorno:**
Crear archivo `.env.local`:
```env
NEXT_PUBLIC_LARAVEL_API_URL=http://localhost:8000
```

3. **Iniciar aplicación:**
```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm run start
```

La aplicación estará disponible en `http://localhost:3000`

## 🎨 Características

- **Diseño Moderno**: Interfaz premium con Tailwind CSS
- **Modo Oscuro**: Soporte para tema oscuro
- **Responsive**: Diseño adaptativo para móviles y tablets
- **Validación**: Validación de formularios en tiempo real
- **Feedback Visual**: Mensajes de éxito y error claros

## 📱 Componentes

### FileUpload
Componente para subir archivos CSV/JSON con validación y feedback visual.

### OrdersList
Lista paginada de órdenes con:
- Filtros por estado
- Paginación
- Indicadores de estado con colores
- Diseño de tabla responsivo

### OrderStatus
Buscador de órdenes por ID con visualización del estado actual.

## 🛠️ Tecnologías

- **Next.js 14**: Framework React con App Router
- **TypeScript**: Tipado estático
- **Tailwind CSS**: Estilos utility-first
- **Axios**: Cliente HTTP para API

## 📝 Uso

1. **Importar Órdenes**: Selecciona un archivo CSV o JSON y haz clic en "Subir Archivo"
2. **Ver Órdenes**: Navega por la lista de órdenes, usa los filtros y la paginación
3. **Consultar Estado**: Ingresa el ID de una orden para ver su estado actual
