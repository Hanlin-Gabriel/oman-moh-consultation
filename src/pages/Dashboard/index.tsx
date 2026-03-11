import React from 'react';
import {
  Card, Row, Col, Typography, Space, Button, Tag, Avatar, Badge, Progress, Divider, Timeline,
} from 'antd';
import {
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined,
  AlertOutlined,
  PlayCircleOutlined,
  MedicineBoxOutlined,
  FileTextOutlined,
  BellOutlined,
  FieldTimeOutlined,
  TeamOutlined,
  RightOutlined,
  ExperimentOutlined,
  ScheduleOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { appointments, currentDoctor } from '../../mock/data';
import { colors, radius, gradients, cardStyles } from '../../theme/designTokens';

const { Title, Text } = Typography;

// Stat card component with colored left border and icon background
const StatCard: React.FC<{
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  onClick?: () => void;
  suffix?: string;
}> = ({ title, value, icon, color, bgColor, onClick, suffix }) => (
  <Card
    hoverable={!!onClick}
    onClick={onClick}
    style={{ ...cardStyles, borderLeft: `4px solid ${color}`, cursor: onClick ? 'pointer' : 'default' }}
    styles={{ body: { padding: '16px 20px' } }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <Text type="secondary" style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {title}
        </Text>
        <div style={{ marginTop: 4 }}>
          <span style={{ fontSize: 28, fontWeight: 700, color }}>{value}</span>
          {suffix && <Text type="secondary" style={{ marginLeft: 4, fontSize: 13 }}>{suffix}</Text>}
        </div>
      </div>
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: radius.xl,
          background: bgColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 22,
          color,
        }}
      >
        {icon}
      </div>
    </div>
  </Card>
);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const stats = {
    total: appointments.length,
    checkedIn: appointments.filter((a) => a.status === 'Checked-in').length,
    inVisit: appointments.filter((a) => a.status === 'In Visit').length,
    completed: appointments.filter((a) => a.status === 'Completed').length,
  };

  const nextPatient = appointments.find((a) => a.status === 'Checked-in');
  const completionRate = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  // Quick actions
  const quickActions = [
    { icon: <CalendarOutlined />, label: 'Appointments', onClick: () => navigate('/appointments') },
    { icon: <FileTextOutlined />, label: 'Visit Notes', onClick: () => {} },
    { icon: <ExperimentOutlined />, label: 'Lab Results', onClick: () => {} },
    { icon: <ScheduleOutlined />, label: 'My Schedule', onClick: () => {} },
  ];

  // Notifications
  const notifications = [
    { type: 'lab', text: 'Lab results ready for Khalid Al-Rashdi (HbA1c, Lipid Panel)', time: '15 min ago', color: colors.purple },
    { type: 'alert', text: 'Abdullah Al-Siyabi flagged as Urgent - Hypertension follow-up', time: '30 min ago', color: colors.error },
    { type: 'schedule', text: 'Reminder: 5 patients scheduled for today\'s clinic', time: '1 hr ago', color: colors.info },
  ];

  return (
    <div style={{ padding: '20px 24px' }}>
      {/* Welcome Banner */}
      <Card
        styles={{ body: { padding: 0 } }}
        style={{
          marginBottom: 20,
          background: gradients.primary,
          border: 'none',
          borderRadius: radius.xl,
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '24px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={3} style={{ color: '#fff', margin: 0, fontWeight: 600 }}>
              Good Morning, {currentDoctor.name}
            </Title>
            <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14, display: 'block', marginTop: 4 }}>
              {dayjs().format('dddd, D MMMM YYYY')} &nbsp;|&nbsp; {currentDoctor.department} &nbsp;|&nbsp; {currentDoctor.facility}
            </Text>
            <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
              {quickActions.map((action, i) => (
                <Button
                  key={i}
                  onClick={action.onClick}
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    border: '1px solid rgba(255,255,255,0.25)',
                    color: '#fff',
                    borderRadius: radius.md,
                    height: 36,
                  }}
                  icon={action.icon}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <Progress
              type="circle"
              percent={completionRate}
              size={90}
              strokeColor={{ '0%': '#52c41a', '100%': '#a0d911' }}
              trailColor="rgba(255,255,255,0.2)"
              format={(p) => (
                <div>
                  <div style={{ color: '#fff', fontSize: 22, fontWeight: 700, lineHeight: 1 }}>{p}%</div>
                  <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10, marginTop: 2 }}>Complete</div>
                </div>
              )}
            />
          </div>
        </div>
      </Card>

      {/* Stats Row */}
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={6}>
          <StatCard
            title="Total Appointments"
            value={stats.total}
            icon={<CalendarOutlined />}
            color={colors.primary}
            bgColor={colors.primaryBg}
            onClick={() => navigate('/appointments')}
            suffix="patients"
          />
        </Col>
        <Col span={6}>
          <StatCard
            title="Waiting"
            value={stats.checkedIn}
            icon={<ClockCircleOutlined />}
            color={colors.info}
            bgColor={colors.infoBg}
            suffix="checked-in"
          />
        </Col>
        <Col span={6}>
          <StatCard
            title="In Visit"
            value={stats.inVisit}
            icon={<TeamOutlined />}
            color={colors.warning}
            bgColor={colors.warningBg}
          />
        </Col>
        <Col span={6}>
          <StatCard
            title="Completed"
            value={stats.completed}
            icon={<CheckCircleOutlined />}
            color={colors.success}
            bgColor={colors.successBg}
            suffix={`of ${stats.total}`}
          />
        </Col>
      </Row>

      <Row gutter={16}>
        {/* Left Column */}
        <Col span={16}>
          {/* Next Patient Card */}
          {nextPatient && (
            <Card
              style={{ ...cardStyles, marginBottom: 16 }}
              styles={{ body: { padding: 0 } }}
            >
              <div
                style={{
                  padding: '14px 20px',
                  borderBottom: `1px solid ${colors.borderLight}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Space>
                  <Badge status="processing" />
                  <Text strong style={{ fontSize: 14 }}>Next Patient</Text>
                </Space>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  <FieldTimeOutlined /> Scheduled {dayjs(nextPatient.scheduledTime).format('HH:mm')}
                </Text>
              </div>
              <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Space size={16}>
                  <Avatar
                    size={56}
                    style={{
                      backgroundColor: nextPatient.patient.gender === 'Male' ? colors.info : '#eb2f96',
                      fontSize: 22,
                      fontWeight: 600,
                    }}
                  >
                    {nextPatient.patient.firstName[0]}{nextPatient.patient.lastName[0]}
                  </Avatar>
                  <div>
                    <Text strong style={{ fontSize: 16 }}>
                      {nextPatient.patient.firstName} {nextPatient.patient.lastName}
                    </Text>
                    <div style={{ marginTop: 2 }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        MRN: {nextPatient.patient.mrn} &nbsp;|&nbsp; Age: {nextPatient.patient.age} &nbsp;|&nbsp; {nextPatient.patient.gender}
                      </Text>
                    </div>
                    <div style={{ marginTop: 6 }}>
                      <Tag color={nextPatient.visitType === 'Initial' ? 'blue' : 'green'}>
                        {nextPatient.visitType}
                      </Tag>
                      {nextPatient.priority === 'Urgent' && (
                        <Tag color="red" icon={<AlertOutlined />}>Urgent</Tag>
                      )}
                      <Text style={{ fontSize: 13, marginLeft: 4 }}>{nextPatient.visitReason}</Text>
                    </div>
                  </div>
                </Space>
                <Button
                  type="primary"
                  size="large"
                  icon={<PlayCircleOutlined />}
                  style={{
                    background: gradients.primary,
                    border: 'none',
                    borderRadius: radius.md,
                    height: 44,
                    paddingInline: 24,
                  }}
                  onClick={() => navigate('/appointments')}
                >
                  Start Visit
                </Button>
              </div>
            </Card>
          )}

          {/* Today's Schedule */}
          <Card
            title={
              <Space>
                <CalendarOutlined style={{ color: colors.primary }} />
                <span>Today's Schedule</span>
                <Tag style={{ fontWeight: 'normal' }}>{appointments.length} patients</Tag>
              </Space>
            }
            extra={
              <Button type="link" onClick={() => navigate('/appointments')} style={{ color: colors.primary }}>
                View All <RightOutlined />
              </Button>
            }
            styles={{ body: { padding: 0 } }}
            style={cardStyles}
          >
            {appointments.map((apt, index) => (
              <div
                key={apt.id}
                style={{
                  padding: '12px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: index < appointments.length - 1 ? `1px solid ${colors.bgSubtle}` : 'none',
                  background: apt.priority === 'Urgent' ? '#fff8f6' : 'transparent',
                  cursor: 'pointer',
                  transition: 'background 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (apt.priority !== 'Urgent') e.currentTarget.style.background = colors.bgHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = apt.priority === 'Urgent' ? '#fff8f6' : 'transparent';
                }}
              >
                <Space size={16}>
                  {/* Time */}
                  <div style={{ width: 52, textAlign: 'center' }}>
                    <Text strong style={{ color: colors.primary, fontSize: 15 }}>
                      {dayjs(apt.scheduledTime).format('HH:mm')}
                    </Text>
                  </div>
                  {/* Colored line indicator */}
                  <div
                    style={{
                      width: 3,
                      height: 36,
                      borderRadius: 2,
                      background:
                        apt.status === 'Completed' ? colors.success
                        : apt.status === 'In Visit' ? colors.warning
                        : apt.status === 'Checked-in' ? colors.info
                        : '#d9d9d9',
                    }}
                  />
                  {/* Patient info */}
                  <div>
                    <Space align="center">
                      <Text strong style={{ fontSize: 13 }}>
                        {apt.patient.firstName} {apt.patient.lastName}
                      </Text>
                      <Tag
                        color={
                          apt.status === 'Completed' ? 'success'
                          : apt.status === 'In Visit' ? 'warning'
                          : apt.status === 'Checked-in' ? 'processing'
                          : 'default'
                        }
                        style={{ fontSize: 11 }}
                      >
                        {apt.status}
                      </Tag>
                      {apt.priority === 'Urgent' && (
                        <Tag color="red" icon={<AlertOutlined />} style={{ fontSize: 11 }}>
                          Urgent
                        </Tag>
                      )}
                    </Space>
                    <div style={{ marginTop: 2 }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>{apt.visitReason}</Text>
                    </div>
                  </div>
                </Space>
                <Space>
                  <Tag color={apt.visitType === 'Initial' ? 'blue' : 'green'} style={{ fontSize: 11 }}>
                    {apt.visitType}
                  </Tag>
                </Space>
              </div>
            ))}
          </Card>
        </Col>

        {/* Right Column */}
        <Col span={8}>
          {/* Notifications */}
          <Card
            title={
              <Space>
                <BellOutlined style={{ color: colors.warning }} />
                <span>Notifications</span>
                <Badge count={notifications.length} style={{ backgroundColor: colors.warning }} />
              </Space>
            }
            styles={{ body: { padding: '4px 0' } }}
            style={{ ...cardStyles, marginBottom: 16 }}
          >
            {notifications.map((n, i) => (
              <div
                key={i}
                style={{
                  padding: '12px 20px',
                  borderBottom: i < notifications.length - 1 ? `1px solid ${colors.bgSubtle}` : 'none',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', gap: 10 }}>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: n.color,
                      marginTop: 6,
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <Text style={{ fontSize: 13 }}>{n.text}</Text>
                    <div>
                      <Text type="secondary" style={{ fontSize: 11 }}>{n.time}</Text>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Card>

          {/* Clinic Info */}
          <Card
            title={
              <Space>
                <MedicineBoxOutlined style={{ color: colors.primary }} />
                <span>Clinic Info</span>
              </Space>
            }
            style={{ ...cardStyles, marginBottom: 16 }}
            styles={{ body: { padding: '12px 20px' } }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary" style={{ fontSize: 12 }}>Clinic</Text>
                <Text style={{ fontSize: 13 }}>Clinic A - Room 102</Text>
              </div>
              <Divider style={{ margin: 0 }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary" style={{ fontSize: 12 }}>Department</Text>
                <Text style={{ fontSize: 13 }}>{currentDoctor.department}</Text>
              </div>
              <Divider style={{ margin: 0 }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary" style={{ fontSize: 12 }}>License No.</Text>
                <Text style={{ fontSize: 13 }}>{currentDoctor.licenseNo}</Text>
              </div>
              <Divider style={{ margin: 0 }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary" style={{ fontSize: 12 }}>Clinic Hours</Text>
                <Text style={{ fontSize: 13 }}>08:00 - 14:00</Text>
              </div>
              <Divider style={{ margin: 0 }} />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary" style={{ fontSize: 12 }}>Avg. Visit Time</Text>
                <Text style={{ fontSize: 13 }}>~25 min</Text>
              </div>
            </div>
          </Card>

          {/* Pending Tasks */}
          <Card
            title={
              <Space>
                <FileTextOutlined style={{ color: colors.purple }} />
                <span>Pending Tasks</span>
              </Space>
            }
            style={cardStyles}
            styles={{ body: { padding: '8px 20px' } }}
          >
            <Timeline
              style={{ marginTop: 8 }}
              items={[
                {
                  color: colors.error,
                  children: (
                    <div>
                      <Text style={{ fontSize: 13 }}>Review lab results - Al-Rashdi</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 11 }}>HbA1c: 7.2% (above target)</Text>
                    </div>
                  ),
                },
                {
                  color: colors.warning,
                  children: (
                    <div>
                      <Text style={{ fontSize: 13 }}>Sign pending notes (2)</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 11 }}>From yesterday's clinic</Text>
                    </div>
                  ),
                },
                {
                  color: colors.info,
                  children: (
                    <div>
                      <Text style={{ fontSize: 13 }}>Referral follow-up - Al-Siyabi</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 11 }}>Cardiology appointment pending</Text>
                    </div>
                  ),
                },
                {
                  color: colors.success,
                  children: (
                    <div>
                      <Text style={{ fontSize: 13 }}>Complete CME module</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: 11 }}>Diabetes management - Due Mar 15</Text>
                    </div>
                  ),
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
