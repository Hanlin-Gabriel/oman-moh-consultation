import React from 'react';
import { Collapse, Tag, Typography, Space } from 'antd';
import {
  MedicineBoxOutlined,
  AlertOutlined,
  ExperimentOutlined,
  FileImageOutlined,
  HistoryOutlined,
  TeamOutlined,
  ScissorOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import SectionIcon from '../../../components/common/SectionIcon';
import { colors, radius } from '../../../theme/designTokens';
import type {
  Allergy,
  Medication,
  LabResult,
  ImagingResult,
  MedicalHistory,
  SurgicalHistory,
  FamilyHistory,
} from '../../../types';

const { Text } = Typography;

// ========== Row wrapper ==========
const ListRow: React.FC<{ children: React.ReactNode; highlight?: boolean; last?: boolean }> = ({
  children,
  highlight,
  last,
}) => (
  <div
    style={{
      padding: '10px 16px',
      borderBottom: last ? 'none' : `1px solid ${colors.bgSubtle}`,
      background: highlight ? '#fffbe6' : 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
    }}
  >
    {children}
  </div>
);

// ========== Section header in collapse ==========
const SectionLabel: React.FC<{
  icon: React.ReactNode;
  iconColor: string;
  iconBg: string;
  title: string;
  badge?: React.ReactNode;
}> = ({ icon, iconColor, iconBg, title, badge }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <SectionIcon icon={icon} color={iconColor} bg={iconBg} />
    <Text strong style={{ fontSize: 13 }}>{title}</Text>
    {badge}
  </div>
);

// ========== Severity dot ==========
const severityColor = (s: string) =>
  s === 'Life-threatening' || s === 'Severe' ? colors.error : s === 'Moderate' ? colors.warning : '#bbb';

const statusColor = (s: string) =>
  s === 'Chronic' ? colors.warning : s === 'Active' ? colors.error : colors.success;

// ========== Empty placeholder ==========
const EmptyState: React.FC<{ text: string }> = ({ text }) => (
  <div style={{ padding: '20px 16px', textAlign: 'center' }}>
    <Text type="secondary" style={{ fontSize: 13 }}>{text}</Text>
  </div>
);

interface DomainPanelProps {
  allergies: Allergy[];
  medications: Medication[];
  labResults: LabResult[];
  imaging: ImagingResult[];
  medicalHistory: MedicalHistory[];
  surgicalHistory: SurgicalHistory[];
  familyHistory: FamilyHistory[];
}

const DomainPanel: React.FC<DomainPanelProps> = ({
  allergies,
  medications,
  labResults,
  imaging,
  medicalHistory,
  surgicalHistory,
  familyHistory,
}) => {
  const activeMeds = medications.filter((m) => m.status === 'Active');
  const abnormalLabs = labResults.filter((l) => l.status !== 'Normal');

  const items = [
    // ============ ALLERGIES ============
    {
      key: 'allergies',
      label: (
        <SectionLabel
          icon={<AlertOutlined />}
          iconColor={colors.error}
          iconBg={colors.errorBg}
          title="Allergies"
          badge={
            allergies.length > 0 ? (
              <Tag color="error" style={{ borderRadius: radius.pill, fontSize: 11 }}>
                <WarningOutlined /> {allergies.length}
              </Tag>
            ) : (
              <Tag color="success" style={{ borderRadius: radius.pill, fontSize: 11 }}>
                <CheckCircleOutlined /> NKA
              </Tag>
            )
          }
        />
      ),
      children: allergies.length === 0 ? (
        <EmptyState text="No Known Allergies (NKA)" />
      ) : (
        <div>
          {allergies.map((a, i) => (
            <ListRow key={a.id} last={i === allergies.length - 1}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: severityColor(a.severity), flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <Text strong style={{ fontSize: 13 }}>{a.allergen}</Text>
                  <Text type="secondary" style={{ fontSize: 12, marginLeft: 8 }}>{a.reaction}</Text>
                </div>
              </div>
              <Space size={4}>
                <Tag style={{ borderRadius: 4, fontSize: 11, margin: 0, background: colors.bgSubtle, border: 'none' }}>{a.type}</Tag>
                <Tag
                  color={a.severity === 'Severe' || a.severity === 'Life-threatening' ? 'error' : a.severity === 'Moderate' ? 'warning' : 'default'}
                  style={{ borderRadius: 4, fontSize: 11, margin: 0 }}
                >
                  {a.severity}
                </Tag>
              </Space>
            </ListRow>
          ))}
        </div>
      ),
    },

    // ============ MEDICAL HISTORY ============
    {
      key: 'medical-history',
      label: (
        <SectionLabel
          icon={<HistoryOutlined />}
          iconColor={colors.info}
          iconBg={colors.infoBg}
          title="Medical History"
          badge={<Tag style={{ borderRadius: radius.pill, fontSize: 11 }}>{medicalHistory.length}</Tag>}
        />
      ),
      children: medicalHistory.length === 0 ? (
        <EmptyState text="No medical history recorded" />
      ) : (
        <div>
          {medicalHistory.map((h, i) => (
            <ListRow key={h.id} last={i === medicalHistory.length - 1}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor(h.status), flexShrink: 0 }} />
                <Text style={{ fontSize: 13 }}>{h.condition}</Text>
              </div>
              <Space size={4}>
                <Tag color="blue" style={{ borderRadius: 4, fontSize: 11, margin: 0 }}>{h.icdCode}</Tag>
                <Text type="secondary" style={{ fontSize: 11, minWidth: 72 }}>
                  <CalendarOutlined style={{ marginRight: 3 }} />
                  {dayjs(h.diagnosedDate).format('MM/YYYY')}
                </Text>
                <Tag color={h.status === 'Chronic' ? 'orange' : h.status === 'Active' ? 'red' : 'green'} style={{ borderRadius: 4, fontSize: 11, margin: 0 }}>
                  {h.status}
                </Tag>
              </Space>
            </ListRow>
          ))}
        </div>
      ),
    },

    // ============ SURGICAL HISTORY ============
    {
      key: 'surgical-history',
      label: (
        <SectionLabel
          icon={<ScissorOutlined />}
          iconColor={colors.purple}
          iconBg={colors.purpleBg}
          title="Surgical History"
          badge={<Tag style={{ borderRadius: radius.pill, fontSize: 11 }}>{surgicalHistory.length}</Tag>}
        />
      ),
      children: surgicalHistory.length === 0 ? (
        <EmptyState text="No surgical history recorded" />
      ) : (
        <div>
          {surgicalHistory.map((s, i) => (
            <ListRow key={s.id} last={i === surgicalHistory.length - 1}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
                <div style={{ width: 3, height: 28, borderRadius: 2, background: colors.purple, flexShrink: 0 }} />
                <div>
                  <Text strong style={{ fontSize: 13 }}>{s.procedure}</Text>
                  <div>
                    <Text type="secondary" style={{ fontSize: 12 }}>{s.hospital}</Text>
                  </div>
                </div>
              </div>
              <Tag style={{ borderRadius: 4, fontSize: 11, margin: 0, background: colors.bgSubtle, border: 'none' }}>
                <CalendarOutlined style={{ marginRight: 3 }} />
                {dayjs(s.date).format('DD/MM/YYYY')}
              </Tag>
            </ListRow>
          ))}
        </div>
      ),
    },

    // ============ FAMILY HISTORY ============
    {
      key: 'family-history',
      label: (
        <SectionLabel
          icon={<TeamOutlined />}
          iconColor={colors.teal}
          iconBg={colors.tealBg}
          title="Family History"
          badge={<Tag style={{ borderRadius: radius.pill, fontSize: 11 }}>{familyHistory.length}</Tag>}
        />
      ),
      children: familyHistory.length === 0 ? (
        <EmptyState text="No family history recorded" />
      ) : (
        <div>
          {familyHistory.map((f, i) => (
            <ListRow key={f.id} last={i === familyHistory.length - 1}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
                <Tag
                  style={{
                    borderRadius: radius.sm,
                    fontSize: 11,
                    margin: 0,
                    minWidth: 64,
                    textAlign: 'center',
                    background: colors.tealBg,
                    color: colors.teal,
                    border: '1px solid #b5f5ec',
                    fontWeight: 600,
                  }}
                >
                  {f.relation}
                </Tag>
                <Text style={{ fontSize: 13 }}>{f.condition}</Text>
              </div>
              {f.ageOfOnset && (
                <Text type="secondary" style={{ fontSize: 12 }}>
                  <ClockCircleOutlined style={{ marginRight: 3 }} />
                  Onset: {f.ageOfOnset}y
                </Text>
              )}
            </ListRow>
          ))}
        </div>
      ),
    },

    // ============ MEDICATIONS ============
    {
      key: 'medications',
      label: (
        <SectionLabel
          icon={<MedicineBoxOutlined />}
          iconColor={colors.success}
          iconBg={colors.successBg}
          title="Medications"
          badge={
            <Tag color="success" style={{ borderRadius: radius.pill, fontSize: 11 }}>
              {activeMeds.length} Active
            </Tag>
          }
        />
      ),
      children: medications.length === 0 ? (
        <EmptyState text="No medications recorded" />
      ) : (
        <div>
          {medications.map((m, i) => (
            <ListRow key={m.id} last={i === medications.length - 1}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: m.status === 'Active' ? colors.success : '#d9d9d9',
                      flexShrink: 0,
                    }}
                  />
                  <Text strong style={{ fontSize: 13 }}>{m.name}</Text>
                  <Text type="secondary" style={{ fontSize: 11 }}>({m.genericName})</Text>
                </div>
                {m.instructions && (
                  <Text type="secondary" style={{ fontSize: 11, marginLeft: 18, display: 'block' }}>
                    {m.instructions}
                  </Text>
                )}
              </div>
              <Space size={4}>
                <Tag color="blue" style={{ borderRadius: 4, fontSize: 11, margin: 0 }}>{m.dosage}</Tag>
                <Tag style={{ borderRadius: 4, fontSize: 11, margin: 0, background: colors.bgSubtle, border: 'none' }}>{m.frequency}</Tag>
                <Tag style={{ borderRadius: 4, fontSize: 11, margin: 0, background: colors.bgSubtle, border: 'none' }}>{m.route}</Tag>
                <Text type="secondary" style={{ fontSize: 11, minWidth: 64 }}>
                  {dayjs(m.startDate).format('MM/YYYY')}
                </Text>
              </Space>
            </ListRow>
          ))}
        </div>
      ),
    },

    // ============ LAB RESULTS ============
    {
      key: 'labs',
      label: (
        <SectionLabel
          icon={<ExperimentOutlined />}
          iconColor={colors.purple}
          iconBg={colors.purpleBg}
          title="Laboratory Results"
          badge={
            <>
              <Tag style={{ borderRadius: radius.pill, fontSize: 11 }}>{labResults.length}</Tag>
              {abnormalLabs.length > 0 && (
                <Tag color="warning" style={{ borderRadius: radius.pill, fontSize: 11 }}>
                  {abnormalLabs.length} abnormal
                </Tag>
              )}
            </>
          }
        />
      ),
      children: labResults.length === 0 ? (
        <EmptyState text="No lab results available" />
      ) : (
        <div>
          {/* Header */}
          <div
            style={{
              display: 'flex',
              padding: '8px 16px',
              background: colors.bgHover,
              borderBottom: `2px solid ${colors.borderLight}`,
              gap: 8,
            }}
          >
            <Text type="secondary" style={{ flex: 2, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Test</Text>
            <Text type="secondary" style={{ width: 80, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, textAlign: 'center' }}>Category</Text>
            <Text type="secondary" style={{ width: 90, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, textAlign: 'right' }}>Value</Text>
            <Text type="secondary" style={{ width: 60, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, textAlign: 'center' }}>Ref</Text>
            <Text type="secondary" style={{ width: 70, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, textAlign: 'center' }}>Status</Text>
            <Text type="secondary" style={{ width: 70, fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600, textAlign: 'right' }}>Date</Text>
          </div>
          {labResults.map((l, i) => {
            const isAbnormal = l.status !== 'Normal';
            return (
              <div
                key={l.id}
                style={{
                  display: 'flex',
                  padding: '9px 16px',
                  borderBottom: i < labResults.length - 1 ? `1px solid ${colors.bgSubtle}` : 'none',
                  background: isAbnormal ? '#fffbe6' : 'transparent',
                  gap: 8,
                  alignItems: 'center',
                }}
              >
                <Text style={{ flex: 2, fontSize: 13 }}>{l.testName}</Text>
                <div style={{ width: 80, textAlign: 'center' }}>
                  <Tag style={{ fontSize: 10, borderRadius: 4, margin: 0, background: colors.bgSubtle, border: 'none' }}>{l.category}</Tag>
                </div>
                <Text
                  strong={isAbnormal}
                  style={{ width: 90, fontSize: 13, textAlign: 'right', color: isAbnormal ? colors.error : undefined }}
                >
                  {l.value} <span style={{ fontSize: 10, color: '#999', fontWeight: 400 }}>{l.unit}</span>
                </Text>
                <Text type="secondary" style={{ width: 60, fontSize: 11, textAlign: 'center' }}>{l.referenceRange}</Text>
                <div style={{ width: 70, textAlign: 'center' }}>
                  <Tag
                    color={l.status === 'Normal' ? 'success' : l.status === 'Critical' ? 'error' : 'warning'}
                    style={{ fontSize: 10, borderRadius: 4, margin: 0 }}
                  >
                    {l.status}
                  </Tag>
                </div>
                <Text type="secondary" style={{ width: 70, fontSize: 11, textAlign: 'right' }}>
                  {dayjs(l.resultDate).format('DD/MM/YY')}
                </Text>
              </div>
            );
          })}
        </div>
      ),
    },

    // ============ IMAGING ============
    {
      key: 'imaging',
      label: (
        <SectionLabel
          icon={<FileImageOutlined />}
          iconColor={colors.warning}
          iconBg={colors.warningBg}
          title="Imaging Results"
          badge={<Tag style={{ borderRadius: radius.pill, fontSize: 11 }}>{imaging.length}</Tag>}
        />
      ),
      children: imaging.length === 0 ? (
        <EmptyState text="No imaging results available" />
      ) : (
        <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {imaging.map((img) => (
            <div
              key={img.id}
              style={{
                padding: 14,
                background: colors.bgHover,
                borderRadius: radius.lg,
                border: `1px solid ${colors.borderLight}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <Space size={8}>
                  <Tag color="blue" style={{ borderRadius: 4, margin: 0, fontSize: 11 }}>{img.type}</Tag>
                  <Text strong style={{ fontSize: 13 }}>{img.bodyPart}</Text>
                </Space>
                <Text type="secondary" style={{ fontSize: 11 }}>
                  <CalendarOutlined style={{ marginRight: 3 }} />
                  {dayjs(img.resultDate).format('DD/MM/YYYY')}
                </Text>
              </div>
              <div style={{ padding: '8px 12px', background: '#fff', borderRadius: radius.sm, border: `1px solid ${colors.borderLight}`, marginBottom: 6 }}>
                <Text type="secondary" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.3px' }}>Findings</Text>
                <div><Text style={{ fontSize: 12 }}>{img.findings}</Text></div>
              </div>
              <div style={{ padding: '8px 12px', background: colors.successBg, borderRadius: radius.sm, border: `1px solid ${colors.primaryBorder}` }}>
                <Text type="secondary" style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.3px' }}>Impression</Text>
                <div><Text strong style={{ fontSize: 12, color: '#389e0d' }}>{img.impression}</Text></div>
              </div>
            </div>
          ))}
        </div>
      ),
    },
  ];

  return (
    <Collapse
      items={items}
      defaultActiveKey={['allergies', 'medical-history']}
      style={{ background: '#fff', border: 'none' }}
      expandIconPosition="start"
    />
  );
};

export default DomainPanel;
