import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, App as AntdApp } from 'antd';
import enUS from 'antd/locale/en_US';
import AppLayout from './components/Layout/AppLayout';
import Dashboard from './pages/Dashboard';
import AppointmentList from './pages/AppointmentList';
import ConsultationPage from './pages/Consultation';
import { colors, radius } from './theme/designTokens';

const themeConfig = {
  token: {
    colorPrimary: colors.primary,
    colorSuccess: colors.success,
    colorWarning: colors.warning,
    colorError: colors.error,
    borderRadius: radius.md,
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  components: {
    Card: {
      borderRadiusLG: radius.xl,
    },
    Button: {
      borderRadius: radius.md,
    },
    Input: {
      borderRadius: radius.md,
    },
    Select: {
      borderRadius: radius.md,
    },
    Modal: {
      borderRadiusLG: radius.xl,
    },
  },
};

const App: React.FC = () => {
  return (
    <ConfigProvider theme={themeConfig} locale={enUS}>
      <AntdApp>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/appointments" element={<AppointmentList />} />
            </Route>
            <Route path="/consultation/:appointmentId" element={<ConsultationPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AntdApp>
    </ConfigProvider>
  );
};

export default App;
