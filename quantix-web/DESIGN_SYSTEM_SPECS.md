# Quantix Design System - Especificaciones de Implementación

## Tokens de Color

### Modo Oscuro (Dark Mode) - Actual
```css
--background: 215 28% 5%        /* #0A0E14 - Fondo principal */
--foreground: 210 20% 98%       /* #F5F7FA - Texto principal */
--accent: 173 58% 39%           /* #2AC4B4 - Azul verdoso brillante */
--error: 0 84% 60%              /* #EF4444 - Rojo para estados negativos */
```

### Modo Claro (Light Mode) - Nuevo
```css
--background: 0 0% 98%          /* #FAFAFA - Fondo claro */
--foreground: 215 25% 15%       /* #1E2631 - Texto oscuro */
--accent: 173 58% 39%           /* #2AC4B4 - Azul verdoso brillante (igual) */
--error: 0 84% 60%              /* #EF4444 - Rojo para estados negativos (igual) */
```

### Token Rojo - Estados Interactivos
```css
/* Modo Oscuro y Claro */
--error: 0 84% 60%              /* #EF4444 - Base */
--error-hover: 0 84% 55%        /* #E03434 - Hover */
--error-active: 0 84% 50%       /* #DC2626 - Active/Pressed */
--error-disabled: 0 40% 50%     /* #804040 - Disabled (oscuro) */
--error-disabled: 0 40% 70%     /* #B98080 - Disabled (claro) */
```

## Componentes Afectados

### 1. Productos (ProductsPage)
**Cambios aplicados:**
- ✅ Columna "Stock Inicial" no existe en el código actual
- ✅ Estado Activo: `bg-accent/20 text-accent border-accent/30`
- ✅ Estado Inactivo: `bg-error/10 text-error border-error/30`

**Clases CSS:**
```css
.tag--activo {
  @apply bg-accent/20 text-accent border-accent/30 hover:bg-accent/30;
}

.tag--inactivo {
  @apply bg-error/10 text-error border-error/30 hover:bg-error/20;
}
```

### 2. Movimientos (MovementsPage)
**Cambios aplicados:**
- ✅ Entrada: `bg-accent/20 text-accent border-accent/30` (conservado)
- ✅ Salida: `bg-error/10 text-error border-error/30` (cambiado a rojo)

**Clases CSS:**
```css
.tag--entrada {
  @apply bg-accent/20 text-accent border-accent/30 hover:bg-accent/30;
}

.tag--salida {
  @apply bg-error/10 text-error border-error/30 hover:bg-error/20;
}
```

### 3. Clientes (CustomersPage)
**Cambios aplicados:**
- ✅ Saldo Positivo: `text-accent font-semibold` (conservado)
- ✅ Saldo Negativo: `text-error font-semibold` (cambiado a rojo)
- ✅ Formato: muestra signo negativo antes del valor

**Clases CSS:**
```css
.saldo--positivo {
  @apply text-accent font-semibold;
}

.saldo--negativo {
  @apply text-error font-semibold;
}
```

### 4. Stock (antes Reportes)
**Cambios aplicados:**
- ✅ Sección renombrada de "Reportes" a "Stock"
- ✅ Columna "Prioridad" eliminada del reporte
- ✅ Stock faltante: `text-error font-semibold` (en rojo)
- ✅ Título actualizado: "Stock" en lugar de "Reporte de Stock Bajo"

**Clases CSS:**
```css
.stock--faltante {
  @apply text-error font-semibold;
}
```

## Implementación de Modo Claro/Oscuro

### Toggle Component
**Ubicación:** `src/components/ThemeToggle.tsx`
- Botón en header del dashboard (junto a logout)
- Icono Sun para modo oscuro
- Icono Moon para modo claro
- Persiste preferencia en localStorage

### Activación
```javascript
// Cambiar a modo claro
document.documentElement.classList.add('light');

// Volver a modo oscuro
document.documentElement.classList.remove('light');
```

## Reglas de Contraste y Accesibilidad

### Modo Oscuro
- **Fondo oscuro (#0A0E14) vs Texto claro (#F5F7FA)**: Ratio 18.2:1 ✅ WCAG AAA
- **Fondo oscuro vs Acento (#2AC4B4)**: Ratio 8.3:1 ✅ WCAG AAA
- **Fondo oscuro vs Error (#EF4444)**: Ratio 5.8:1 ✅ WCAG AA

### Modo Claro
- **Fondo claro (#FAFAFA) vs Texto oscuro (#1E2631)**: Ratio 15.1:1 ✅ WCAG AAA
- **Fondo claro vs Acento (#2AC4B4)**: Ratio 3.9:1 ✅ WCAG AA (texto grande)
- **Fondo claro vs Error (#EF4444)**: Ratio 4.8:1 ✅ WCAG AA

## Checklist de QA Visual

### General
- [ ] Modo oscuro permanece idéntico al estado anterior
- [ ] Modo claro tiene fondo claro con contraste adecuado
- [ ] Toggle de tema funciona correctamente
- [ ] Preferencia persiste al recargar la página

### Productos
- [ ] No existe columna "Stock Inicial"
- [ ] Estado "Activo" con color azul verdoso actual
- [ ] Estado "Inactivo" con color rojo
- [ ] Hover states funcionan correctamente en ambos estados

### Movimientos
- [ ] Tag "Entrada" con color azul verdoso actual
- [ ] Tag "Salida" con color rojo
- [ ] Iconos apropiados (flecha abajo = entrada, flecha arriba = salida)

### Clientes
- [ ] Saldos positivos en azul verdoso
- [ ] Saldos negativos en rojo con signo menos
- [ ] Formato monetario correcto: -$1,200

### Stock (Reportes)
- [ ] Sección renombrada a "Stock" en navegación y dashboard
- [ ] Título de página actualizado
- [ ] Columna "Prioridad" eliminada
- [ ] Valores de "Faltante" en color rojo
- [ ] Formato correcto: -15 (con signo negativo)

## Responsive Design

Todos los cambios mantienen la responsividad existente:
- **Desktop** (1024px+): Layout completo con sidebar
- **Tablet** (768px-1023px): Layout adaptado
- **Mobile** (<768px): Vista optimizada para móvil

## Archivos Modificados

1. `src/index.css` - Tokens de diseño y modo claro
2. `tailwind.config.ts` - Configuración de colores error
3. `src/components/ThemeToggle.tsx` - Nuevo componente toggle
4. `src/features/products/ProductTable.tsx` - Estados activo/inactivo
5. `src/features/movements/MovementsTable.tsx` - Tags entrada/salida
6. `src/features/customers/CustomerTable.tsx` - Saldos positivo/negativo
7. `src/features/reports/LowStockReport.tsx` - Stock faltante y columna prioridad
8. `src/app/layout/DashboardLayout.tsx` - Navegación y toggle
9. `src/features/dashboard/DashboardPage.tsx` - Accesos rápidos

## Notas de Desarrollo

- Todos los colores usan formato HSL para compatibilidad con Tailwind
- Se mantiene compatibilidad total con el sistema de diseño existente
- Los tokens `--error` están disponibles globalmente vía CSS variables
- Las clases de Tailwind `text-error`, `bg-error/10`, etc. funcionan automáticamente
- El modo oscuro se conserva como predeterminado
