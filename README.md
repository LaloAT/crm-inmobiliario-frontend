<div align="center">

# CRM Inmobiliario - Frontend

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![AWS Amplify](https://img.shields.io/badge/AWS_Amplify-Production-FF9900?style=for-the-badge&logo=aws-amplify&logoColor=white)](https://aws.amazon.com/amplify/)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge)](LICENSE)

**Aplicacion Web SPA para el Sistema CRM Inmobiliario Multi-tenant**

*Interfaz moderna desarrollada con React 19, TypeScript y las mejores practicas*

[Demo en Vivo](#-demo-en-vivo) |
[Stack Tecnologico](#-stack-tecnologico) |
[Instalacion](#-instalacion) |
[Modulos](#-modulos-implementados)

---

</div>

## Tabla de Contenidos

- [Demo en Vivo](#-demo-en-vivo)
- [Acerca del Proyecto](#-acerca-del-proyecto)
- [Stack Tecnologico](#-stack-tecnologico)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalacion](#-instalacion)
- [Variables de Entorno](#-variables-de-entorno)
- [Scripts Disponibles](#-scripts-disponibles)
- [Modulos Implementados](#-modulos-implementados)
- [Arquitectura Frontend](#-arquitectura-frontend)
- [Convenciones](#-convenciones)

---

## Demo en Vivo

| Servicio | URL |
|----------|-----|
| **CRM Frontend** | https://crm.grupoterranova.com.mx |
| **API Backend** | https://api.grupoterranova.com.mx |
| **Swagger/Docs** | https://api.grupoterranova.com.mx/swagger |

---

## Acerca del Proyecto

Este repositorio contiene el **frontend** del CRM Inmobiliario, una aplicacion SPA (Single Page Application) que consume la API REST del backend .NET.

### Caracteristicas Principales

| Caracteristica | Descripcion |
|----------------|-------------|
| **React 19** | Ultima version con nuevas caracteristicas |
| **TypeScript** | Tipado estatico para mayor robustez |
| **Vite 7** | Build tool ultrarapido |
| **TailwindCSS** | Utilidades CSS para diseno rapido |
| **React Query** | Cache y sincronizacion de datos del servidor |
| **React Hook Form** | Formularios performantes con validacion |
| **Zod** | Validacion de schemas tipo-segura |
| **Drag & Drop** | Pipeline Kanban con @dnd-kit |
| **Recharts** | Graficas interactivas para dashboards |
| **JWT Auth** | Autenticacion con refresh token automatico |

---

## Stack Tecnologico

### Core

| Tecnologia | Version | Proposito |
|------------|---------|-----------|
| React | 19.2 | Framework UI |
| TypeScript | 5.9 | Tipado estatico |
| Vite | 7.2 | Build tool y dev server |

### UI & Estilos

| Tecnologia | Version | Proposito |
|------------|---------|-----------|
| TailwindCSS | 3.4 | Framework de utilidades CSS |
| Lucide React | 0.562 | Iconos SVG |
| Recharts | 3.6 | Graficas y visualizaciones |

### Estado & Data Fetching

| Tecnologia | Version | Proposito |
|------------|---------|-----------|
| TanStack React Query | 5.90 | Server state management |
| Axios | 1.13 | Cliente HTTP |
| React Router DOM | 7.11 | Enrutamiento SPA |

### Formularios & Validacion

| Tecnologia | Version | Proposito |
|------------|---------|-----------|
| React Hook Form | 7.70 | Gestion de formularios |
| @hookform/resolvers | 5.2 | Integracion con Zod |
| Zod | 4.3 | Validacion de schemas |

### Drag & Drop

| Tecnologia | Version | Proposito |
|------------|---------|-----------|
| @dnd-kit/core | 6.3 | Sistema base de D&D |
| @dnd-kit/sortable | 10.0 | Listas ordenables |
| @dnd-kit/utilities | 3.2 | Utilidades D&D |

### Dev Tools

| Tecnologia | Version | Proposito |
|------------|---------|-----------|
| ESLint | 9.39 | Linting de codigo |
| PostCSS | 8.5 | Procesamiento CSS |
| Autoprefixer | 10.4 | Prefijos CSS automaticos |

---

## Estructura del Proyecto

```
crm-inmobiliario-frontend/
├── public/                       # Archivos estaticos
├── src/
│   ├── components/
│   │   ├── common/               # Componentes compartidos
│   │   │   └── ProtectedRoute.tsx
│   │   ├── layout/               # Layout principal
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── MainLayout.tsx
│   │   └── ui/                   # Componentes UI base
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Card.tsx
│   │       └── index.ts
│   │
│   ├── config/
│   │   ├── api.config.ts         # URLs y endpoints
│   │   └── axios.config.ts       # Instancia Axios con interceptors
│   │
│   ├── context/
│   │   └── AuthContext.tsx       # Contexto de autenticacion
│   │
│   ├── pages/                    # Paginas/Modulos
│   │   ├── auth/
│   │   │   └── LoginPage.tsx
│   │   ├── dashboard/
│   │   │   └── DashboardPage.tsx
│   │   ├── properties/
│   │   │   ├── PropertiesPage.tsx
│   │   │   └── PropertyModal.tsx
│   │   ├── leads/
│   │   │   ├── LeadsPage.tsx
│   │   │   └── LeadModal.tsx
│   │   ├── deals/
│   │   │   ├── DealsPage.tsx      # Pipeline Kanban
│   │   │   ├── DealModal.tsx
│   │   │   ├── DealCard.tsx
│   │   │   └── KanbanColumn.tsx
│   │   ├── contracts/
│   │   │   ├── ContractsPage.tsx
│   │   │   └── ContractModal.tsx
│   │   ├── developments/
│   │   │   ├── DevelopmentsPage.tsx
│   │   │   └── DevelopmentModal.tsx
│   │   ├── lots/
│   │   │   ├── LotsPage.tsx
│   │   │   └── LotModal.tsx
│   │   ├── commissions/
│   │   │   ├── CommissionsPage.tsx
│   │   │   └── CommissionModal.tsx
│   │   ├── shifts/
│   │   │   ├── ShiftsPage.tsx
│   │   │   └── ShiftModal.tsx
│   │   ├── users/
│   │   │   ├── UsersPage.tsx
│   │   │   └── UserModal.tsx
│   │   ├── organizations/
│   │   │   ├── OrganizationsPage.tsx
│   │   │   └── OrganizationModal.tsx
│   │   └── reports/
│   │       └── ReportsPage.tsx
│   │
│   ├── router/
│   │   └── index.tsx             # Configuracion de rutas
│   │
│   ├── schemas/                  # Schemas de validacion Zod
│   │   ├── property.schema.ts
│   │   ├── lead.schema.ts
│   │   ├── deal.schema.ts
│   │   ├── contract.schema.ts
│   │   ├── development.schema.ts
│   │   ├── lot.schema.ts
│   │   ├── commission.schema.ts
│   │   ├── user.schema.ts
│   │   └── organization.schema.ts
│   │
│   ├── services/                 # Servicios API
│   │   ├── auth.service.ts
│   │   ├── property.service.ts
│   │   ├── lead.service.ts
│   │   ├── deal.service.ts
│   │   ├── contract.service.ts
│   │   ├── development.service.ts
│   │   ├── lot.service.ts
│   │   ├── commission.service.ts
│   │   ├── shift.service.ts
│   │   ├── user.service.ts
│   │   ├── organization.service.ts
│   │   ├── dashboard.service.ts
│   │   └── report.service.ts
│   │
│   ├── types/                    # Tipos TypeScript
│   │   ├── auth.types.ts
│   │   ├── property.types.ts
│   │   ├── lead.types.ts
│   │   ├── deal.types.ts
│   │   ├── contract.types.ts
│   │   ├── development.types.ts
│   │   ├── lot.types.ts
│   │   ├── commission.types.ts
│   │   ├── shift.types.ts
│   │   ├── user.types.ts
│   │   ├── organization.types.ts
│   │   ├── dashboard.types.ts
│   │   ├── report.types.ts
│   │   └── index.ts
│   │
│   ├── utils/                    # Utilidades
│   │   └── storage.ts            # Manejo de localStorage
│   │
│   ├── App.tsx                   # Componente raiz
│   ├── main.tsx                  # Entry point
│   └── index.css                 # Estilos globales + Tailwind
│
├── .eslintrc.js                  # Configuracion ESLint
├── .gitignore
├── index.html                    # HTML template
├── package.json
├── postcss.config.js             # Configuracion PostCSS
├── tailwind.config.js            # Configuracion Tailwind
├── tsconfig.json                 # Configuracion TypeScript
├── vite.config.ts                # Configuracion Vite
└── README.md
```

---

## Instalacion

### Prerrequisitos

- [Node.js 20+](https://nodejs.org/) (recomendado: ultima LTS)
- [npm](https://www.npmjs.com/) o [pnpm](https://pnpm.io/)
- [Git](https://git-scm.com/)

### Pasos de Instalacion

#### 1. Clonar el repositorio

```bash
git clone https://github.com/LaloAT/crm-inmobiliario-frontend.git
cd crm-inmobiliario-frontend
```

#### 2. Instalar dependencias

```bash
npm install
```

#### 3. Ejecutar en desarrollo

```bash
npm run dev
```

#### 4. Acceder a la aplicacion

- http://localhost:5173

---

## Variables de Entorno

El proyecto usa **Vite** para el manejo de variables de entorno. Crea un archivo `.env` en la raiz:

```env
# API Backend URL (solo para produccion)
VITE_API_URL=https://api.grupoterranova.com.mx
```

### Configuracion por Ambiente

| Ambiente | API URL | Configuracion |
|----------|---------|---------------|
| **Desarrollo** | Proxy a produccion | `vite.config.ts` proxy |
| **Produccion** | `https://api.grupoterranova.com.mx` | Variable de entorno |

> **Nota:** En desarrollo, Vite usa un proxy configurado en `vite.config.ts` para evitar problemas de CORS. Las peticiones a `/api` se redirigen automaticamente al backend de produccion.

---

## Scripts Disponibles

| Script | Comando | Descripcion |
|--------|---------|-------------|
| **dev** | `npm run dev` | Inicia servidor de desarrollo en http://localhost:5173 |
| **build** | `npm run build` | Compila TypeScript y genera build de produccion |
| **preview** | `npm run preview` | Previsualiza el build de produccion localmente |
| **lint** | `npm run lint` | Ejecuta ESLint para analisis de codigo |

### Ejemplos de Uso

```bash
# Desarrollo con hot reload
npm run dev

# Build para produccion
npm run build

# Ver build de produccion localmente
npm run preview

# Verificar errores de codigo
npm run lint
```

---

## Modulos Implementados

### Auth (Autenticacion)

- Login con email y contrasena
- Manejo de tokens JWT
- Refresh token automatico
- Logout y limpieza de sesion

### Dashboard

- Tarjetas de metricas (Propiedades, Leads, Deals, Ingresos)
- Grafica de barras de resumen
- Grafica de pastel de cambios mensuales
- Resumen rapido
- Actividad reciente

### Properties (Propiedades)

- Listado con paginacion y filtros
- CRUD completo en modal
- Galeria de imagenes
- Estados: Disponible, Reservado, Vendido, Rentado

### Leads (Prospectos)

- Listado con busqueda y filtros
- CRUD en modal
- Preferencias de busqueda
- Asignacion a agentes
- Estados: Nuevo, Contactado, Calificado, etc.

### Deals (Pipeline de Ventas)

- **Vista Kanban** con drag & drop
- Columnas por etapa del pipeline
- Movimiento de deals entre etapas
- Modal de edicion
- Tarjetas con informacion resumida

### Contracts (Contratos)

- Listado de contratos
- Creacion y edicion
- Descarga de PDF
- Tipos: Compraventa, Arrendamiento, etc.

### Developments (Desarrollos)

- Listado de fraccionamientos
- CRUD completo
- Asociacion con lotes

### Lots (Lotes)

- Listado por desarrollo
- CRUD completo
- Estados: Disponible, Reservado, Vendido

### Commissions (Comisiones)

- Listado de comisiones
- Filtros por estado
- Estados: Pendiente, Aprobada, Pagada

### Shifts (Turnos)

- Gestion de horarios
- Asignacion de agentes
- Estados de turno

### Users (Usuarios)

- Listado de usuarios
- CRUD con roles
- Asignacion de supervisor

### Organizations (Organizaciones)

- Listado de organizaciones
- CRUD completo
- Tipos: Constructora, Inmobiliaria

### Reports (Reportes)

- Dashboard de metricas
- Exportacion a Excel
- Filtros por fecha

---

## Arquitectura Frontend

### Patron de Capas

```
┌─────────────────────────────────────────────────────────────┐
│                      PAGES (UI)                              │
│  Componentes de pagina con logica de presentacion           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   REACT QUERY                                │
│         Cache, sincronizacion y estado del servidor         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    SERVICES                                  │
│              Llamadas HTTP con Axios                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   AXIOS CONFIG                               │
│      Interceptors, tokens, manejo de errores                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    API BACKEND                               │
│              https://api.grupoterranova.com.mx              │
└─────────────────────────────────────────────────────────────┘
```

### Flujo de Datos

```
Usuario -> Pagina -> React Query -> Service -> Axios -> API
                          |
                       Cache
                          |
                    Actualizacion UI
```

### Autenticacion

```
Login -> JWT Token -> localStorage -> Axios Interceptor -> API
                                           |
                                   Token expirado?
                                           |
                                   Refresh automatico
```

---

## Convenciones

### Nomenclatura de Archivos

| Tipo | Patron | Ejemplo |
|------|--------|---------|
| Paginas | `[Nombre]Page.tsx` | `LeadsPage.tsx` |
| Modales | `[Nombre]Modal.tsx` | `LeadModal.tsx` |
| Servicios | `[nombre].service.ts` | `lead.service.ts` |
| Tipos | `[nombre].types.ts` | `lead.types.ts` |
| Schemas | `[nombre].schema.ts` | `lead.schema.ts` |

### Estructura de Paginas

```tsx
// 1. Imports
import { useQuery, useMutation } from '@tanstack/react-query';
import { leadService } from '../../services/lead.service';

// 2. Componente
export const LeadsPage: React.FC = () => {
  // 3. Queries
  const { data, isLoading } = useQuery({...});

  // 4. Mutations
  const createMutation = useMutation({...});

  // 5. Handlers
  const handleCreate = () => {...};

  // 6. Render
  return (...);
};
```

### Commits (Conventional Commits)

```bash
feat(leads): add lead filtering by status
fix(deals): resolve drag and drop issue
style(ui): update button colors
refactor(services): simplify API calls
docs(readme): update installation steps
```

---

## Repositorios Relacionados

| Repositorio | Descripcion |
|-------------|-------------|
| [CrmInmobiliario](https://github.com/LaloAT/CrmInmobiliario) | Backend .NET 8 con Clean Architecture |
| [crm-inmobiliario-frontend](https://github.com/LaloAT/crm-inmobiliario-frontend) | Este repositorio (Frontend React) |

---

## Contribuidores

| | |
|---|---|
| [@LaloAT](https://github.com/LaloAT) | Lead Developer |

---

## Licencia

Este proyecto es **privado y propietario**. Todos los derechos reservados.

---

<div align="center">

**Preguntas o sugerencias?** [Abre un issue](https://github.com/LaloAT/crm-inmobiliario-frontend/issues)

---

Hecho con amor en Leon, Guanajuato, Mexico

*Ultima actualizacion: Enero 2026*

</div>
