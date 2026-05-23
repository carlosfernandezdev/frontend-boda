import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { RutaProtegida } from './components/RutaProtegida.jsx';
import { Layout } from './components/Layout.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { RegistroPage } from './pages/RegistroPage.jsx';
import { GaleriaPage } from './pages/GaleriaPage.jsx';
import { EtapasPage } from './pages/EtapasPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegistroPage />} />

          {/* Protegidas */}
          <Route
            path="/"
            element={
              <RutaProtegida>
                <Layout>
                  <GaleriaPage />
                </Layout>
              </RutaProtegida>
            }
          />

          {/* Placeholders para las próximas vistas.
              Cada una exige el permiso correspondiente. */}
          <Route
            path="/etapas"
            element={
              <RutaProtegida permiso="etapas.crear">
                <Layout>
                  <EtapasPage />
                </Layout>
              </RutaProtegida>
            }
          />
          <Route
            path="/usuarios"
            element={
              <RutaProtegida permiso="usuarios.asignar_rol">
                <Layout>
                  <div className="font-display text-3xl text-vino">
                    Gestión de usuarios (próximamente)
                  </div>
                </Layout>
              </RutaProtegida>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
