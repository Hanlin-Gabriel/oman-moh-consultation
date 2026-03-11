import React from 'react';
import { Card, Row, Col, Tag, Typography, Empty, Space } from 'antd';
import {
  HeartOutlined,
  MedicineBoxOutlined,
  ExperimentOutlined,
  UserOutlined,
  AlertOutlined,
  DashboardOutlined,
  ThunderboltOutlined,
  IdcardOutlined,
  GlobalOutlined,
  CalendarOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import SectionIcon from '../../../components/common/SectionIcon';
import { colors, cardStyles, radius } from '../../../theme/designTokens';
import type { Patient, VitalSigns, Medication, LabResult, MedicalHistory } from '../../../types';

const { Text } = Typography;

// ========== Vital metric mini card ==========
const VitalMetric: React.FC<{
  label: string;
  value: string | number | undefined;
  unit: string;
  color?: string;
  icon?: React.ReactNode;
  alert?: boolean;
}> = ({ label, value, unit, color, icon, alert }) => {
  if (value === undefined) return null;
  return (
    <div
      style={{
        background: alert
          ? `linear-gradient(135deg, ${colors.errorBg} 0%, #fff2f0 100%)`
          : `linear-gradient(135deg, #f8f9fa 0%, ${colors.bgPage} 100%)`,
        borderRadius: radius.xl,
        padding: '14px 16px',
        border: alert ? '1px solid #ffa39e' : `1px solid ${colors.border}`,
        flex: 1,
        minWidth: 0,
        transition: 'box-shadow 0.2s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 8 }}>
        {icon && (
          <span
            style={{
              color: alert ? colors.error : color || colors.textSecondary,
              fontSize: 13,
            }}
          >
            {icon}
          </span>
        )}
        <Text style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px', color: colors.textSecondary, fontWeight: 500 }}>
          {label}
        </Text>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline' }}>
        <span style={{ fontSize: 24, fontWeight: 700, color: color || colors.text, lineHeight: 1 }}>
          {value}
        </span>
        <span style={{ fontSize: 11, color: colors.textSecondary, marginLeft: 4, fontWeight: 500 }}>{unit}</span>
      </div>
    </div>
  );
};

// ========== Vitals Section ==========
const VitalsSection: React.FC<{ vitals?: VitalSigns }> = ({ vitals }) => {
  if (!vitals) return <Empty description="No vitals recorded yet" />;

  const bpAlert = !!(vitals.bloodPressureSystolic && vitals.bloodPressureSystolic >= 140);
  const spo2Alert = !!(vitals.oxygenSaturation && vitals.oxygenSaturation < 95);
  const glucoseAlert = !!(vitals.bloodGlucose && vitals.bloodGlucose > 126);
  const hrAlert = !!(vitals.heartRate && vitals.heartRate > 100);

  return (
    <Card
      size="small"
      style={cardStyles}
      styles={{ header: { borderBottom: `1px solid ${colors.borderLight}` } }}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <SectionIcon icon={<HeartOutlined />} color={colors.error} bg={colors.errorBg} />
          <span>Vital Signs</span>
        </div>
      }
      extra={
        <Tag style={{ background: colors.bgSubtle, border: 'none', borderRadius: radius.sm, color: colors.textSecondary, fontSize: 11 }}>
          {dayjs(vitals.recordedAt).format('HH:mm')} by {vitals.recordedBy}
        </Tag>
      }
    >
      <div style={{ display: 'flex', gap: 10 }}>
        <VitalMetric
          label="Blood Pressure"
          value={`${vitals.bloodPressureSystolic}/${vitals.bloodPressureDiastolic}`}
          unit="mmHg"
          color={bpAlert ? colors.error : colors.primary}
          icon={<DashboardOutlined />}
          alert={bpAlert}
        />
        <VitalMetric
          label="Heart Rate"
          value={vitals.heartRate}
          unit="bpm"
          color={hrAlert ? colors.error : undefined}
          icon={<HeartOutlined />}
          alert={hrAlert}
        />
        <VitalMetric
          label="SpO2"
          value={vitals.oxygenSaturation}
          unit="%"
          color={spo2Alert ? colors.error : colors.primary}
          icon={<ThunderboltOutlined />}
          alert={spo2Alert}
        />
        <VitalMetric label="Temp" value={vitals.temperature} unit="°C" />
        <VitalMetric label="RR" value={vitals.respiratoryRate} unit="/min" />
        {vitals.bloodGlucose && (
          <VitalMetric
            label="Glucose"
            value={vitals.bloodGlucose}
            unit="mg/dL"
            color={glucoseAlert ? colors.error : undefined}
            alert={glucoseAlert}
          />
        )}
      </div>
      {/* Body metrics strip */}
      <div
        style={{
          marginTop: 12,
          padding: '8px 14px',
          background: colors.bgHover,
          borderRadius: radius.md,
          display: 'flex',
          gap: 24,
          alignItems: 'center',
        }}
      >
        {[
          { label: 'BMI', value: vitals.bmi },
          { label: 'Weight', value: `${vitals.weight} kg` },
          { label: 'Height', value: `${vitals.height} cm` },
        ].map((m) => (
          <div key={m.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Text type="secondary" style={{ fontSize: 11 }}>{m.label}:</Text>
            <Text strong style={{ fontSize: 12 }}>{m.value}</Text>
          </div>
        ))}
        {vitals.painLevel !== undefined && (
          <div style={{ marginLeft: 'auto' }}>
            <Text type="secondary" style={{ fontSize: 11, marginRight: 6 }}>Pain Level:</Text>
            <Tag
              color={vitals.painLevel > 5 ? 'red' : vitals.painLevel > 3 ? 'orange' : 'green'}
              style={{ borderRadius: radius.pill, margin: 0, fontSize: 11, fontWeight: 600 }}
            >
              {vitals.painLevel}/10
            </Tag>
          </div>
        )}
      </div>
    </Card>
  );
};

// ========== Demographics ==========
const DemoBadge: React.FC<{ label: string; value: string; icon?: React.ReactNode }> = ({ label, value, icon }) => (
  <div
    style={{
      flex: 1,
      minWidth: 140,
      padding: '10px 14px',
      background: colors.bgHover,
      borderRadius: radius.md,
      border: `1px solid ${colors.borderLight}`,
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 3 }}>
      {icon && <span style={{ color: colors.textSecondary, fontSize: 11 }}>{icon}</span>}
      <Text type="secondary" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</Text>
    </div>
    <Text style={{ fontSize: 13, fontWeight: 600 }}>{value}</Text>
  </div>
);

// ========== Problem list item ==========
const ProblemItem: React.FC<{ item: MedicalHistory; last: boolean }> = ({ item, last }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '11px 16px',
      borderBottom: last ? 'none' : `1px solid ${colors.bgSubtle}`,
      transition: 'background 0.15s',
    }}
    onMouseEnter={(e) => { e.currentTarget.style.background = colors.bgHover; }}
    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: item.status === 'Chronic' ? colors.warning : item.status === 'Active' ? colors.error : colors.success,
          flexShrink: 0,
          boxShadow: `0 0 0 3px ${
            item.status === 'Chronic' ? 'rgba(250,140,22,0.15)' : item.status === 'Active' ? 'rgba(255,77,79,0.15)' : 'rgba(82,196,26,0.15)'
          }`,
        }}
      />
      <Text style={{ fontSize: 13, fontWeight: 500 }}>{item.condition}</Text>
    </div>
    <Space size={6}>
      <Tag color="blue" style={{ fontSize: 11, borderRadius: 4, margin: 0 }}>{item.icdCode}</Tag>
      <Tag
        color={item.status === 'Chronic' ? 'orange' : item.status === 'Active' ? 'red' : 'green'}
        style={{ fontSize: 11, borderRadius: 4, margin: 0 }}
      >
        {item.status}
      </Tag>
    </Space>
  </div>
);

// ========== Medication item ==========
const MedItem: React.FC<{ med: Medication; last: boolean }> = ({ med, last }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '11px 16px',
      borderBottom: last ? 'none' : `1px solid ${colors.bgSubtle}`,
      transition: 'background 0.15s',
    }}
    onMouseEnter={(e) => { e.currentTarget.style.background = colors.bgHover; }}
    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
  >
    <div>
      <Text style={{ fontSize: 13, fontWeight: 500 }}>{med.name}</Text>
      <Text type="secondary" style={{ fontSize: 11, marginLeft: 6 }}>{med.genericName}</Text>
    </div>
    <Space size={4}>
      <Tag color="processing" style={{ fontSize: 11, borderRadius: 4, margin: 0, fontWeight: 600 }}>{med.dosage}</Tag>
      <Tag style={{ fontSize: 11, borderRadius: 4, margin: 0, background: colors.borderLight, border: 'none', color: '#595959' }}>{med.frequency}</Tag>
      <Tag style={{ fontSize: 11, borderRadius: 4, margin: 0, background: colors.borderLight, border: 'none', color: colors.textSecondary }}>{med.route}</Tag>
    </Space>
  </div>
);

// ==================== MAIN ====================
interface CoverSheetProps {
  patient: Patient;
  vitals?: VitalSigns;
  medications: Medication[];
  recentLabs: LabResult[];
  medicalHistory: MedicalHistory[];
}

const CoverSheet: React.FC<CoverSheetProps> = ({
  patient,
  vitals,
  medications,
  recentLabs,
  medicalHistory,
}) => {
  const activeMeds = medications.filter((m) => m.status === 'Active');
  const abnormalCount = recentLabs.filter((l) => l.status !== 'Normal').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Patient Demographics */}
      <Card
        size="small"
        style={cardStyles}
        styles={{ header: { borderBottom: `1px solid ${colors.borderLight}` } }}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SectionIcon icon={<UserOutlined />} color={colors.primary} bg={colors.primaryBg} />
            <span>Patient Demographics</span>
          </div>
        }
      >
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <DemoBadge label="Full Name" value={`${patient.firstName} ${patient.lastName}`} icon={<UserOutlined />} />
          <DemoBadge label="Civil ID" value={patient.civilId} icon={<IdcardOutlined />} />
          <DemoBadge label="Date of Birth" value={dayjs(patient.dateOfBirth).format('DD/MM/YYYY')} icon={<CalendarOutlined />} />
          <DemoBadge label="Nationality" value={patient.nationality} icon={<GlobalOutlined />} />
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 10 }}>
          <DemoBadge label="Governorate" value={patient.governorate || 'N/A'} />
          <DemoBadge label="Wilayat" value={patient.wilayat || 'N/A'} />
          <DemoBadge label="Insurance" value={patient.insuranceProvider || 'N/A'} icon={<SafetyCertificateOutlined />} />
          <DemoBadge label="Policy No." value={patient.insurancePolicyNo || 'N/A'} />
        </div>
      </Card>

      {/* Vitals */}
      <VitalsSection vitals={vitals} />

      {/* Active Problems + Medications side by side */}
      <Row gutter={14}>
        <Col span={12}>
          <Card
            size="small"
            style={{ ...cardStyles, height: '100%' }}
            styles={{ header: { borderBottom: `1px solid ${colors.borderLight}` }, body: { padding: 0 } }}
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <SectionIcon icon={<AlertOutlined />} color={colors.warning} bg={colors.warningBg} />
                <span>Active Problems</span>
                <Tag style={{ borderRadius: radius.pill, fontSize: 11, fontWeight: 'normal' }}>{medicalHistory.length}</Tag>
              </div>
            }
          >
            {medicalHistory.length === 0 ? (
              <div style={{ padding: 32, textAlign: 'center' }}>
                <Empty description="No medical history" image={Empty.PRESENTED_IMAGE_SIMPLE} />
              </div>
            ) : (
              medicalHistory.map((h, i) => <ProblemItem key={h.id} item={h} last={i === medicalHistory.length - 1} />)
            )}
          </Card>
        </Col>
        <Col span={12}>
          <Card
            size="small"
            style={{ ...cardStyles, height: '100%' }}
            styles={{ header: { borderBottom: `1px solid ${colors.borderLight}` }, body: { padding: 0 } }}
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <SectionIcon icon={<MedicineBoxOutlined />} color={colors.success} bg={colors.successBg} />
                <span>Current Medications</span>
                <Tag color="success" style={{ borderRadius: radius.pill, fontSize: 11, fontWeight: 'normal' }}>{activeMeds.length} active</Tag>
              </div>
            }
          >
            {activeMeds.length === 0 ? (
              <div style={{ padding: 32, textAlign: 'center' }}>
                <Empty description="No active medications" image={Empty.PRESENTED_IMAGE_SIMPLE} />
              </div>
            ) : (
              activeMeds.map((m, i) => <MedItem key={m.id} med={m} last={i === activeMeds.length - 1} />)
            )}
          </Card>
        </Col>
      </Row>

      {/* Lab Results */}
      <Card
        size="small"
        style={cardStyles}
        styles={{ header: { borderBottom: `1px solid ${colors.borderLight}` }, body: { padding: 0 } }}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SectionIcon icon={<ExperimentOutlined />} color={colors.purple} bg={colors.purpleBg} />
            <span>Recent Lab Results</span>
            {abnormalCount > 0 && (
              <Tag color="warning" style={{ borderRadius: radius.pill, fontSize: 11, fontWeight: 'normal' }}>
                {abnormalCount} abnormal
              </Tag>
            )}
          </div>
        }
      >
        {recentLabs.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center' }}>
            <Empty description="No recent lab results" image={Empty.PRESENTED_IMAGE_SIMPLE} />
          </div>
        ) : (
          <>
            {/* Header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1.2fr 1fr 1fr 1fr',
                padding: '9px 16px',
                borderBottom: `2px solid ${colors.borderLight}`,
                background: colors.bgHover,
                gap: 8,
              }}
            >
              {['Test', 'Category', 'Value', 'Reference', 'Status', 'Date'].map((h) => (
                <Text key={h} type="secondary" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, textAlign: h === 'Test' ? 'left' : 'center' }}>
                  {h}
                </Text>
              ))}
            </div>
            {/* Rows */}
            {recentLabs.map((lab, i) => {
              const isAbnormal = lab.status !== 'Normal';
              return (
                <div
                  key={lab.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1.2fr 1fr 1fr 1fr',
                    alignItems: 'center',
                    padding: '10px 16px',
                    borderBottom: i < recentLabs.length - 1 ? `1px solid ${colors.bgSubtle}` : 'none',
                    background: isAbnormal ? '#fffbe6' : 'transparent',
                    transition: 'background 0.15s',
                    gap: 8,
                  }}
                  onMouseEnter={(e) => { if (!isAbnormal) e.currentTarget.style.background = colors.bgHover; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = isAbnormal ? '#fffbe6' : 'transparent'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {isAbnormal && (
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: colors.error, flexShrink: 0 }} />
                    )}
                    <Text style={{ fontSize: 13, fontWeight: isAbnormal ? 500 : 400 }}>{lab.testName}</Text>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <Tag style={{ fontSize: 10, borderRadius: 4, margin: 0, background: colors.bgSubtle, border: 'none', color: colors.textSecondary }}>{lab.category}</Tag>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <Text
                      strong={isAbnormal}
                      style={{ fontSize: 14, color: isAbnormal ? colors.error : colors.text, fontWeight: isAbnormal ? 700 : 400 }}
                    >
                      {lab.value}
                    </Text>
                    <Text style={{ fontSize: 10, color: colors.textSecondary, marginLeft: 3 }}>{lab.unit}</Text>
                  </div>
                  <Text type="secondary" style={{ fontSize: 11, textAlign: 'center' }}>{lab.referenceRange}</Text>
                  <div style={{ textAlign: 'center' }}>
                    <Tag
                      color={lab.status === 'Normal' ? 'success' : lab.status === 'Critical' ? 'error' : 'warning'}
                      style={{ fontSize: 10, borderRadius: radius.pill, margin: 0, fontWeight: 600 }}
                    >
                      {lab.status}
                    </Tag>
                  </div>
                  <Text type="secondary" style={{ fontSize: 11, textAlign: 'center' }}>
                    {dayjs(lab.resultDate).format('DD/MM/YY')}
                  </Text>
                </div>
              );
            })}
          </>
        )}
      </Card>
    </div>
  );
};

export default CoverSheet;
