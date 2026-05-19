# 🥐 La Croassantina - Aplicación Web (Frontend)

Una aplicación web e-commerce completa para un obrador/panadería desarrollada en **React 18** y **Vite**, siguiendo las mejores prácticas de Clean Code, Custom Hooks, Context API y componentes funcionales.

## 📋 Descripción General

**La Croassantina** es una aplicación web (SPA) que permite a los usuarios:
- Autenticarse de forma segura mediante JWT (Login/Registro).
- Explorar un catálogo interactivo de productos.
- Ver los detalles de los productos, incluyendo información extendida.
- Buscar y filtrar el inventario.
- Agregar productos al carrito de compras validando siempre el stock.
- Realizar compras y revisar el historial de pedidos.
- Acceder a un panel de administración completo (Admin Dashboard) para gestión de inventario, ventas y usuarios.
- Gestionar su perfil de usuario (actualización de datos, contraseña y avatar).

## 🏗️ Arquitectura

La aplicación sigue un enfoque modularizado orientado a la separación de responsabilidades en la UI:

```text
frontend-web/src/
├── assets/             # Estilos BEM/ITCSS y recursos estáticos
│   └── styles/         # Variables CSS, Layouts, Utilities
├── components/         # UI Components reutilizables
│   ├── auth/           # Rutas protegidas (ProtectedRoute)
│   ├── cards/          # Tarjetas de producto (Horizontal, Vertical, Skeleton)
│   ├── forms/          # Campos de formulario y validación visual
│   ├── layout/         # Header, Footer, BrandLogo, UserAvatar
│   ├── product/        # Galería de productos, Interfaz de acción del carrito
│   └── purchase/       # Historial e información visual de compras
├── context/            # Estados Globales (AuthContext, CartContext, SearchContext)
├── hooks/              # Lógica de negocio reutilizable (useAuth, useProducts, etc.)
├── pages/              # Vistas principales (Screens) del Router
│   └── admin/          # Subvistas restrictivas del Dashboard (AdminProducts, etc.)
├── routes/             # Enrutador principal (AppRoutes.jsx)
├── services/           # Clientes HTTP (api.js) y repositorios REST (userService, etc.)
├── stories/            # Documentación interactiva de componentes UI (Storybook)
├── tests/              # Suite de pruebas automatizadas
│   ├── components/     # Testing DOM y de interacción de usuario
│   ├── hooks/          # Testing de lógica y flujos de contexto global
│   └── utils/          # Testing unitario estricto de validadores y formateadores
└── utils/              # Funciones puras (formatters.js, validators.js, mappers.js)
```

## 🛠️ Stack Tecnológico

### Core Framework
- **React 18** - UI declarativa moderna
- **Vite** - Bundler de última generación ultrarrápido
- **JavaScript (ES6+)** - Lenguaje de programación base

### UI y Navegación
- **React Router DOM v7** - Enrutamiento dinámico SPA y manipulación del DOM virtual
- **Vanilla CSS3** - Arquitectura de estilos modular BEM/ITCSS personalizada (sin depender de Tailwind/Bootstrap)
- **Lucide React** - Sistema de iconografía moderna y limpia

### Gestión de Estado
- **React Context API** - Estado global nativo de la aplicación
- **Custom Hooks** - Abstracciones reactivas de estado local

### Networking y Serialización
- **Fetch API** - Cliente HTTP nativo (envuelto en `apiFetch`)
- **JSON** - Formato estándar de comunicación

### Testing
- **Vitest** - Framework de pruebas con entorno similiar a Jest
- **React Testing Library** - Testing enfocado en comportamiento del usuario real
- **jsdom** - Emulación de entorno DOM para Node

### Documentación
- **Storybook** - Visualización asilada y catalogación del Design System (Sistema de Diseño).

## 📱 Pantallas y Funcionalidades

### 🔐 Autenticación
- **Login** - Acceso rápido y seguro de cuentas de cliente / administrador.
- **Register** - Formulario seguro de creación de cuentas con validación en tiempo real.

### 🏠 Home / Catálogo
- Búsqueda en vivo (`Debounce Search`).
- Visualización de productos en cuadrícula fluida (Responsive).
- Estado visual "Agotado" para productos sin existencias en almacén.

### 🛒 Carrito de Compras
- Resumen en tiempo real en la navegación.
- Eliminación interactiva y control numérico del stock (hasta el tope del almacén).
- Limpieza total y Checkout final del pedido.

### 📦 Compras e Historial
- **Mis Pedidos** - Tarjetas enriquecidas mostrando fecha, totales y estados dinámicos (Ej: "Pagada", "Creada").
- **Detalle de Compra** - Visualización detallada línea por línea de lo adquirido.

### ⚙️ Admin Dashboard
- **Admin Home**: Accesos rápidos y resumen estadístico.
- **Gestor de Productos**: CRUD completo (incluyendo subida de imágenes Base64).
- **Gestor de Categorías**: CRUD del árbol estructural.
- **Administrador de Pedidos**: Alteración del estado del pedido por parte del administrador.

## 🔑 Características Principales

### 🔐 Seguridad 
- **JWT (JSON Web Tokens)** implementado de forma transversal en el cliente.
- **Refresh Token en Cola**: Mecanismo interceptor que renueva tokens silenciosamente de forma encolada si varios endpoints fallan por 401 Unauthorized simultáneamente.
- **Validación Frontal Robusta**: Formularios protegidos con el hook custom `useFormValidation`.

### 🎨 Interfaz de Usuario
- Diseño hiper-optimizado móvil y web "Mobile First".
- Componentes altamente accesibles (`A11y`) garantizando navegación por teclado para botones y barras.
- Tematización coherente (Variables globales).
- Animaciones CSS ligeras e indicadores de carga para mejorar la interactividad (Spinners, Skeletons).

## 📋 Modelos de Datos Front-End

Nuestros Mappers traducen las complejas respuestas de Spring Boot a objetos fácilmente digeribles por el DOM:

### Usuario Autenticado (`AuthContext`)
```javascript
{
    id: 1,
    email: "luka.modric@realmadrid.com",
    name: "Luka Modric",
    role: "ADMIN",
    profileImageBase64: "data:image/jpeg;base64,..."
}
```

### Producto UI (`mapProduct`)
```javascript
{
    id: 15,
    title: "Croissant de Almendra",
    description: "Crujiente por fuera con relleno dulce de almendras tostadas.",
    price: 2.50,
    stock: 25,
    image: "data:image/jpeg;base64,...",
    active: true
}
```

### Compra UI (`mapPurchase`)
```javascript
{
    id: 101,
    title: "Compra #101",
    description: "Creada",
    detailRight: "25.50 EUR",
    status: "CREATED",
    total: 25.50
}
```

## 🚀 Configuración e Instalación

### Requisitos
- **Node.js 18+** instalado.
- Administrador de paquetes (NPM).

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <URL del repositorio>
   cd Proyecto_Intermodular_Web_React/frontend-web
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar Backend**
   La variable global `API_URL` se encuentra mapeada dinámicamente en `src/services/api.js`. Por defecto apunta a `http://localhost:8080/api/v1`. Asegúrate de tener levantado el backend Spring Boot.

4. **Compilar y Ejecutar en Desarrollo**
   ```bash
   npm run dev
   ```

## 📝 API Endpoints Críticos

Algunos de los endpoints gestionados por nuestros repositorios asíncronos bajo `src/services/`:

| Método | Endpoint Backend | Archivo Gestor | Descripción |
|--------|------------------|----------------|-------------|
| POST | `/auth/login` | `authService.js` | Login de usuario |
| POST | `/auth/register` | `authService.js` | Registro de usuario |
| PATCH | `/auth/me/profile-image` | `userService.js` | Cambiar foto de perfil |
| PATCH | `/auth/me/password` | `userService.js` | Cambiar credenciales |
| GET | `/products` | `productService.js` | Listar catálogo (Paginado / Filtrado) |
| GET | `/categories` | `categoryService.js`| Árbol de categorías |
| GET | `/purchases/my-purchases` | `purchaseService.js`| Historial de un cliente |
| PATCH | `/purchases/{id}/pay` | `purchaseService.js`| Simular pasarela de pago |
| POST | `/purchases` | `purchaseService.js`| Generar un pedido (Ticket) |

## 🧪 Testing

El entorno Frontend incluye una batería de **58 casos de prueba rigurosos (100% integrales)** ejecutados en paralelo:

```bash
# Ejecutar suite completa (DOM + Hooks + Utils)
npm run test
```

### Frameworks Involucrados
- **Vitest** - Plataforma de ejecución ultrarrápida.
- **React Testing Library** - Evaluación e interacción DOM sin fragilidad.

## 🎨 Storybook

Este proyecto expone un ecosistema de documentación visual para el equipo de UX/UI:

```bash
# Levantar el Sandbox de UI en http://localhost:6006
npm run storybook
```

---

**Título**: La Croassantina (Frontend SPA React)  
**Versión**: 1.0  
**Última actualización**: Mayo 2026
