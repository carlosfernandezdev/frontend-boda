import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { RutaProtegida } from './components/RutaProtegida.jsx';
import { Layout } from './components/Layout.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { RegistroPage } from './pages/RegistroPage.jsx';
import { InicioPage } from './pages/InicioPage.jsx';
import { GaleriaPage } from './pages/GaleriaPage.jsx';
import { EtapasPage } from './pages/EtapasPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegistroPage />} />

          <Route
            path="/"
            element={
              <RutaProtegida>
                <Layout>
                  <InicioPage />
                </Layout>
              </RutaProtegida>
            }
          />

          <Route
            path="/galeria"
            element={
              <RutaProtegida>
                <Layout>
                  <GaleriaPage />
                </Layout>
              </RutaProtegida>
            }
          />

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
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}