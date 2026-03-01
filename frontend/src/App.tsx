import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import Header from './components/Header';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import HomePage from './pages/HomePage';
import CarsPage from './pages/CarsPage';
import CarDetailPage from './pages/CarDetailPage';
import BookTestDrivePage from './pages/BookTestDrivePage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';

// Layout component for public pages
function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

// Admin layout (no public header/footer)
function AdminLayout() {
  return (
    <div className="min-h-screen bg-brand-gray">
      <Outlet />
    </div>
  );
}

// Route definitions
const rootRoute = createRootRoute();

const publicLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'public-layout',
  component: PublicLayout,
});

const homeRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/',
  component: HomePage,
});

const carsRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/cars',
  component: CarsPage,
});

const carDetailRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/cars/$slug',
  component: CarDetailPage,
});

const bookRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/book',
  component: BookTestDrivePage,
});

const adminLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'admin-layout',
  component: AdminLayout,
});

const adminLoginRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin',
  component: AdminLoginPage,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/admin/dashboard',
  component: AdminDashboardPage,
});

const routeTree = rootRoute.addChildren([
  publicLayoutRoute.addChildren([
    homeRoute,
    carsRoute,
    carDetailRoute,
    bookRoute,
  ]),
  adminLayoutRoute.addChildren([
    adminLoginRoute,
    adminDashboardRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
