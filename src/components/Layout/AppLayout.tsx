import React from 'react';
import { Layout, Menu, Avatar, Dropdown, Space, Typography, Badge } from 'antd';
import {
  UserOutlined,
  MedicineBoxOutlined,
  BellOutlined,
  SettingOutlined,
  LogoutOutlined,
  CalendarOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { currentDoctor } from '../../mock/data';
import { colors } from '../../theme/designTokens';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const AppLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/appointments',
      icon: <CalendarOutlined />,
      label: 'Appointments',
    },
  ];

  const userMenuItems = [
    { key: 'profile', icon: <UserOutlined />, label: 'My Profile' },
    { key: 'settings', icon: <SettingOutlined />, label: 'Settings' },
    { type: 'divider' as const },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Sign Out' },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          background: colors.primary,
          borderBottom: '3px solid #c8102e',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <MedicineBoxOutlined style={{ fontSize: 28, color: '#fff' }} />
          <div>
            <Text strong style={{ color: '#fff', fontSize: 16, display: 'block', lineHeight: 1.2 }}>
              MOH Oman - Clinical Workstation
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 11 }}>
              Ministry of Health - Sultanate of Oman
            </Text>
          </div>
        </div>

        <Space size={20}>
          <Badge count={3} size="small">
            <BellOutlined style={{ fontSize: 18, color: '#fff', cursor: 'pointer' }} />
          </Badge>
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <Space style={{ cursor: 'pointer' }}>
              <Avatar style={{ backgroundColor: '#1a7a5a' }} icon={<UserOutlined />} />
              <div style={{ lineHeight: 1.2 }}>
                <Text style={{ color: '#fff', fontSize: 13, display: 'block' }}>
                  {currentDoctor.name}
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 11 }}>
                  {currentDoctor.specialty}
                </Text>
              </div>
            </Space>
          </Dropdown>
        </Space>
      </Header>

      <Layout>
        <Sider
          width={200}
          style={{ background: '#fff', borderRight: `1px solid ${colors.borderLight}` }}
          breakpoint="lg"
          collapsedWidth="60"
        >
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
            style={{ height: '100%', borderRight: 0, paddingTop: 8 }}
          />
        </Sider>
        <Content style={{ background: colors.bgPage, minHeight: 'calc(100vh - 64px)' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
