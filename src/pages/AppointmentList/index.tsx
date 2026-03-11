import React, { useState } from 'react';
import {
  Table,
  Tag,
  Button,
  Card,
  Space,
  Typography,
  Avatar,
  Input,
  Select,
  Row,
  Col,
  Statistic,
  Badge,
  Tooltip,
} from 'antd';
import {
  PlayCircleOutlined,
  SearchOutlined,
  UserOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ManOutlined,
  WomanOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import type { Appointment, AppointmentStatus } from '../../types';
import { appointments as initialAppointments } from '../../mock/data';
import { useConsultationStore } from '../../store/consultationStore';
import { colors, cardStyles } from '../../theme/designTokens';

const { Title, Text } = Typography;

const AppointmentList: React.FC = () => {
  const navigate = useNavigate();
  const engageAppointment = useConsultationStore((s) => s.engageAppointment);
  const [appointments, setAppointments] = useState(initialAppointments);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const handleEngage = (apt: Appointment) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === apt.id ? { ...a, status: 'In Visit' as const } : a))
    );
    engageAppointment(apt);
    navigate(`/consultation/${apt.id}`);
  };

  const filtered = appointments.filter((apt) => {
    const matchesSearch =
      !searchText ||
      apt.patient.firstName.toLowerCase().includes(searchText.toLowerCase()) ||
      apt.patient.lastName.toLowerCase().includes(searchText.toLowerCase()) ||
      apt.patient.mrn.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: appointments.length,
    checkedIn: appointments.filter((a) => a.status === 'Checked-in').length,
    inVisit: appointments.filter((a) => a.status === 'In Visit').length,
    completed: appointments.filter((a) => a.status === 'Completed').length,
  };

  const columns = [
    {
      title: 'Time',
      dataIndex: 'scheduledTime',
      key: 'time',
      width: 100,
      render: (time: string) => (
        <Space direction="vertical" size={0}>
          <Text strong>{dayjs(time).format('HH:mm')}</Text>
          <Text type="secondary" style={{ fontSize: 11 }}>
            {dayjs(time).format('hh:mm A')}
          </Text>
        </Space>
      ),
    },
    {
      title: 'Patient',
      key: 'patient',
      width: 280,
      render: (_: unknown, record: Appointment) => (
        <Space>
          <Avatar
            style={{
              backgroundColor: record.patient.gender === 'Male' ? colors.info : '#eb2f96',
            }}
            icon={record.patient.gender === 'Male' ? <ManOutlined /> : <WomanOutlined />}
          />
          <div>
            <Text strong>
              {record.patient.firstName} {record.patient.lastName}
            </Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              MRN: {record.patient.mrn} | Age: {record.patient.age}{record.patient.gender === 'Male' ? 'M' : 'F'}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: 'Visit Type',
      key: 'visitType',
      width: 120,
      render: (_: unknown, record: Appointment) => (
        <Tag color={record.visitType === 'Initial' ? 'blue' : 'green'}>
          {record.visitType}
        </Tag>
      ),
    },
    {
      title: 'Reason',
      dataIndex: 'visitReason',
      key: 'reason',
      ellipsis: true,
    },
    {
      title: 'Priority',
      key: 'priority',
      width: 90,
      render: (_: unknown, record: Appointment) =>
        record.priority === 'Urgent' ? (
          <Tag color="red" icon={<ExclamationCircleOutlined />}>
            Urgent
          </Tag>
        ) : (
          <Tag color="default">Normal</Tag>
        ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: AppointmentStatus) => (
        <Badge
          status={
            status === 'Completed'
              ? 'success'
              : status === 'In Visit'
              ? 'warning'
              : status === 'Checked-in'
              ? 'processing'
              : 'default'
          }
          text={status}
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 130,
      render: (_: unknown, record: Appointment) => {
        if (record.status === 'Completed') {
          return (
            <Button size="small" icon={<CheckCircleOutlined />} disabled>
              Completed
            </Button>
          );
        }
        if (record.status === 'In Visit') {
          return (
            <Button
              type="primary"
              size="small"
              style={{ background: colors.warning }}
              onClick={() => {
                engageAppointment(record);
                navigate(`/consultation/${record.id}`);
              }}
            >
              Resume
            </Button>
          );
        }
        return (
          <Tooltip
            title={
              record.status !== 'Checked-in'
                ? 'Patient must be checked in first'
                : ''
            }
          >
            <Button
              type="primary"
              size="small"
              icon={<PlayCircleOutlined />}
              disabled={record.status !== 'Checked-in'}
              onClick={() => handleEngage(record)}
            >
              Engage
            </Button>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>
          <CalendarOutlined /> Today's Appointments
        </Title>
        <Text type="secondary">{dayjs().format('dddd, D MMMM YYYY')} | Internal Medicine Clinic</Text>
      </div>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card size="small" style={cardStyles}>
            <Statistic
              title="Total"
              value={stats.total}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: colors.primary }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" style={cardStyles}>
            <Statistic
              title="Checked In"
              value={stats.checkedIn}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: colors.info }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" style={cardStyles}>
            <Statistic
              title="In Visit"
              value={stats.inVisit}
              prefix={<UserOutlined />}
              valueStyle={{ color: colors.warning }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small" style={cardStyles}>
            <Statistic
              title="Completed"
              value={stats.completed}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: colors.success }}
            />
          </Card>
        </Col>
      </Row>

      <Card style={cardStyles}>
        <Space style={{ marginBottom: 16, width: '100%', justifyContent: 'space-between' }}>
          <Space>
            <Input
              placeholder="Search patient name or MRN..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
              allowClear
            />
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 160 }}
              options={[
                { label: 'All Status', value: 'all' },
                { label: 'Scheduled', value: 'Scheduled' },
                { label: 'Checked-in', value: 'Checked-in' },
                { label: 'In Visit', value: 'In Visit' },
                { label: 'Completed', value: 'Completed' },
              ]}
            />
          </Space>
        </Space>

        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          pagination={false}
          size="middle"
          rowClassName={(record) =>
            record.priority === 'Urgent' ? 'urgent-row' : ''
          }
        />
      </Card>
    </div>
  );
};

export default AppointmentList;
