import React, { useState } from 'react';
import { Card, Button, Typography, Spin, Space, Tag, Alert } from 'antd';
import { RobotOutlined, ReloadOutlined, CopyOutlined } from '@ant-design/icons';
import SectionIcon from '../../../components/common/SectionIcon';
import { colors, cardStyles, radius } from '../../../theme/designTokens';
import type { Patient, VitalSigns, Medication, LabResult, MedicalHistory, Allergy } from '../../../types';

const { Text } = Typography;

interface AISummaryProps {
  patient: Patient;
  vitals?: VitalSigns;
  medications: Medication[];
  labResults: LabResult[];
  medicalHistory: MedicalHistory[];
  allergies: Allergy[];
  visitReason: string;
}

const generateSummary = (props: AISummaryProps): string => {
  const { patient, vitals, medications, labResults, medicalHistory, allergies, visitReason } = props;
  const activeProblems = medicalHistory.filter((h) => h.status !== 'Resolved');
  const abnormalLabs = labResults.filter((l) => l.status !== 'Normal');
  const activeAllergies = allergies.filter((a) => a.status === 'Active');
  const activeMeds = medications.filter((m) => m.status === 'Active');

  let summary = `**Patient:** ${patient.firstName} ${patient.lastName}, ${patient.age}-year-old ${patient.gender.toLowerCase()}\n`;
  summary += `**Visit Reason:** ${visitReason}\n\n`;

  if (activeProblems.length > 0) {
    summary += `**Active Problems:** ${activeProblems.map((p) => `${p.condition} (${p.icdCode})`).join('; ')}\n\n`;
  }

  if (activeAllergies.length > 0) {
    summary += `**Allergies:** ${activeAllergies.map((a) => `${a.allergen} - ${a.severity} (${a.reaction})`).join('; ')}\n\n`;
  }

  if (vitals) {
    const alerts: string[] = [];
    if (vitals.bloodPressureSystolic && vitals.bloodPressureSystolic >= 140)
      alerts.push(`Elevated BP: ${vitals.bloodPressureSystolic}/${vitals.bloodPressureDiastolic} mmHg`);
    if (vitals.oxygenSaturation && vitals.oxygenSaturation < 95)
      alerts.push(`Low SpO2: ${vitals.oxygenSaturation}%`);
    if (vitals.bloodGlucose && vitals.bloodGlucose > 126)
      alerts.push(`Elevated glucose: ${vitals.bloodGlucose} mg/dL`);
    if (vitals.heartRate && vitals.heartRate > 100)
      alerts.push(`Tachycardia: ${vitals.heartRate} bpm`);

    if (alerts.length > 0) {
      summary += `**Vital Sign Alerts:** ${alerts.join('; ')}\n\n`;
    }
  }

  if (abnormalLabs.length > 0) {
    summary += `**Abnormal Labs:** ${abnormalLabs.map((l) => `${l.testName}: ${l.value} ${l.unit} (ref: ${l.referenceRange})`).join('; ')}\n\n`;
  }

  if (activeMeds.length > 0) {
    summary += `**Current Medications (${activeMeds.length}):** ${activeMeds.map((m) => `${m.name} ${m.dosage} ${m.frequency}`).join('; ')}\n\n`;
  }

  // Clinical suggestions based on data
  const suggestions: string[] = [];
  const hasHbA1c = labResults.find((l) => l.testName === 'HbA1c');
  if (hasHbA1c && parseFloat(hasHbA1c.value) > 7.0) {
    suggestions.push('HbA1c above target (>7.0%) - consider medication adjustment or intensification of diabetes management');
  }
  if (vitals?.bloodPressureSystolic && vitals.bloodPressureSystolic >= 140) {
    suggestions.push('Blood pressure above 140/90 target - review antihypertensive regimen');
  }
  const ldl = labResults.find((l) => l.testName === 'LDL Cholesterol');
  if (ldl && parseFloat(ldl.value) > 100) {
    suggestions.push('LDL above 100 mg/dL - consider statin dose optimization');
  }

  if (suggestions.length > 0) {
    summary += `**Clinical Considerations:**\n${suggestions.map((s) => `- ${s}`).join('\n')}`;
  }

  return summary;
};

const AISummary: React.FC<AISummaryProps> = (props) => {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);

  const handleGenerate = () => {
    setLoading(true);
    // Simulate AI processing delay
    setTimeout(() => {
      setSummary(generateSummary(props));
      setLoading(false);
    }, 1500);
  };

  const handleCopy = () => {
    if (summary) {
      navigator.clipboard.writeText(summary.replace(/\*\*/g, ''));
    }
  };

  return (
    <Card
      size="small"
      style={cardStyles}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <SectionIcon icon={<RobotOutlined />} color={colors.purple} bg={colors.purpleBg} />
          <span>AI Quick Summary</span>
          <Tag color="purple" style={{ borderRadius: radius.pill }}>Beta</Tag>
        </div>
      }
      extra={
        <Space>
          {summary && (
            <Button size="small" icon={<CopyOutlined />} onClick={handleCopy}>
              Copy
            </Button>
          )}
          <Button
            size="small"
            type="primary"
            icon={summary ? <ReloadOutlined /> : <RobotOutlined />}
            onClick={handleGenerate}
            loading={loading}
            style={{ background: colors.purple, borderColor: colors.purple }}
          >
            {summary ? 'Regenerate' : 'Generate Summary'}
          </Button>
        </Space>
      }
    >
      <Alert
        type="info"
        showIcon
        message="AI-generated summaries are for reference only. Always verify clinical data independently."
        style={{ marginBottom: 12, fontSize: 12 }}
      />
      {loading ? (
        <div style={{ textAlign: 'center', padding: 24 }}>
          <Spin />
          <br />
          <Text type="secondary" style={{ marginTop: 8 }}>Analyzing patient data...</Text>
        </div>
      ) : summary ? (
        <div
          style={{
            background: colors.purpleBg,
            padding: 16,
            borderRadius: radius.md,
            border: `1px solid ${colors.purpleBorder}`,
            whiteSpace: 'pre-wrap',
            fontSize: 13,
            lineHeight: 1.6,
          }}
          dangerouslySetInnerHTML={{
            __html: summary
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/\n/g, '<br/>'),
          }}
        />
      ) : (
        <div style={{ textAlign: 'center', padding: 16 }}>
          <Text type="secondary">
            Click "Generate Summary" to get an AI-powered quick overview of this patient's clinical data.
          </Text>
        </div>
      )}
    </Card>
  );
};

export default AISummary;
