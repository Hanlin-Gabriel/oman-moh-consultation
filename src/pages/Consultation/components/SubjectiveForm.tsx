import React from 'react';
import { Card, Input, Button, Typography, Tag, Row, Col } from 'antd';
import {
  AudioOutlined, EditOutlined, FileTextOutlined, UnorderedListOutlined,
  CheckCircleOutlined, CloseCircleOutlined, MinusCircleOutlined,
} from '@ant-design/icons';
import { useConsultationStore } from '../../../store/consultationStore';
import SectionIcon from '../../../components/common/SectionIcon';
import { colors, cardStyles, radius } from '../../../theme/designTokens';
import type { ReviewOfSystems } from '../../../types';

const { TextArea } = Input;
const { Text } = Typography;

const rosFields: { key: keyof ReviewOfSystems; label: string; icon: string }[] = [
  { key: 'general', label: 'General', icon: '🏥' },
  { key: 'heent', label: 'HEENT', icon: '👁' },
  { key: 'cardiovascular', label: 'Cardiovascular', icon: '❤️' },
  { key: 'respiratory', label: 'Respiratory', icon: '🫁' },
  { key: 'gastrointestinal', label: 'Gastrointestinal', icon: '🔄' },
  { key: 'genitourinary', label: 'Genitourinary', icon: '💧' },
  { key: 'musculoskeletal', label: 'Musculoskeletal', icon: '🦴' },
  { key: 'neurological', label: 'Neurological', icon: '🧠' },
  { key: 'psychiatric', label: 'Psychiatric', icon: '🧘' },
  { key: 'skin', label: 'Skin', icon: '🩹' },
  { key: 'endocrine', label: 'Endocrine', icon: '⚡' },
  { key: 'hematologic', label: 'Hematologic', icon: '🩸' },
];

const quickTemplates = [
  'Chest pain',
  'Shortness of breath',
  'Headache',
  'Abdominal pain',
  'Fatigue',
  'Chronic disease follow-up',
  'Medication refill',
  'Routine check-up',
  'Dizziness',
  'Back pain',
];

// ========== ROS Item ==========
const RosItem: React.FC<{
  field: typeof rosFields[0];
  value: string;
  onChange: (val: string) => void;
}> = ({ field, value, onChange }) => {
  const [expanded, setExpanded] = React.useState(false);
  const documented = !!value;
  const isNegative = value === 'Negative / No complaints';

  return (
    <div
      style={{
        borderRadius: radius.lg,
        border: documented ? `1px solid ${colors.primaryBorder}` : `1px solid ${colors.borderLight}`,
        background: documented ? colors.successBg : '#fff',
        overflow: 'hidden',
        transition: 'all 0.2s',
      }}
    >
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          transition: 'background 0.15s',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,0,0,0.02)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 14 }}>{field.icon}</span>
          <Text style={{ fontSize: 13, fontWeight: 500 }}>{field.label}</Text>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {documented && (
            <Tag
              color={isNegative ? 'default' : 'success'}
              icon={isNegative ? <MinusCircleOutlined /> : <CheckCircleOutlined />}
              style={{ borderRadius: radius.pill, fontSize: 10, margin: 0 }}
            >
              {isNegative ? 'Negative' : 'Documented'}
            </Tag>
          )}
          <span style={{ color: '#bbb', fontSize: 10, transition: 'transform 0.2s', transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>▶</span>
        </div>
      </div>
      {expanded && (
        <div style={{ padding: '0 14px 12px' }}>
          <TextArea
            placeholder={`Document ${field.label} findings... (e.g., "Denies..." or "Reports...")`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={2}
            style={{ borderRadius: radius.md }}
            autoFocus
          />
          <div style={{ marginTop: 6, display: 'flex', gap: 4 }}>
            <Button
              size="small"
              type="text"
              style={{ fontSize: 11, color: colors.textSecondary }}
              onClick={() => onChange('Negative / No complaints')}
            >
              <CloseCircleOutlined /> Negative
            </Button>
            <Button
              size="small"
              type="text"
              style={{ fontSize: 11, color: colors.textSecondary }}
              onClick={() => onChange(`Denies ${field.label.toLowerCase()} symptoms`)}
            >
              <MinusCircleOutlined /> Denies
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

// ========== MAIN ==========
const SubjectiveForm: React.FC = () => {
  const consultation = useConsultationStore((s) => s.consultation);
  const updateCC = useConsultationStore((s) => s.updateChiefComplaint);
  const updateHPI = useConsultationStore((s) => s.updateHPI);
  const updateROS = useConsultationStore((s) => s.updateROS);

  const [isRecording, setIsRecording] = React.useState(false);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => setIsRecording(false), 3000);
    }
  };

  if (!consultation) return null;

  const documentedRos = rosFields.filter((f) => consultation.reviewOfSystems[f.key]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Chief Complaint */}
      <Card
        size="small"
        style={cardStyles}
        styles={{ header: { borderBottom: `1px solid ${colors.borderLight}` } }}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SectionIcon icon={<EditOutlined />} color={colors.info} bg={colors.infoBg} />
            <span>Chief Complaint (CC)</span>
          </div>
        }
        extra={
          <Button
            size="small"
            icon={<AudioOutlined />}
            onClick={toggleRecording}
            type={isRecording ? 'primary' : 'default'}
            danger={isRecording}
            style={{
              borderRadius: radius.md,
              ...(isRecording ? {} : { background: colors.bgSubtle, border: 'none' }),
            }}
          >
            {isRecording ? 'Recording...' : 'Voice Input'}
          </Button>
        }
      >
        <TextArea
          placeholder="Enter the patient's chief complaint in their own words..."
          value={consultation.chiefComplaint}
          onChange={(e) => updateCC(e.target.value)}
          rows={2}
          maxLength={500}
          showCount
          style={{ borderRadius: radius.md }}
        />
        <div style={{ marginTop: 10 }}>
          <Text type="secondary" style={{ fontSize: 11, marginBottom: 6, display: 'block' }}>
            Quick Templates:
          </Text>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {quickTemplates.map((t) => (
              <Tag
                key={t}
                onClick={() => updateCC(consultation.chiefComplaint ? `${consultation.chiefComplaint}; ${t}` : t)}
                style={{
                  cursor: 'pointer',
                  borderRadius: radius.sm,
                  padding: '3px 10px',
                  fontSize: 12,
                  border: `1px solid ${colors.border}`,
                  background: colors.bgHover,
                  transition: 'all 0.15s',
                  margin: 0,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = colors.primaryBg; e.currentTarget.style.borderColor = colors.primary; e.currentTarget.style.color = colors.primary; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = colors.bgHover; e.currentTarget.style.borderColor = colors.border; e.currentTarget.style.color = 'inherit'; }}
              >
                {t}
              </Tag>
            ))}
          </div>
        </div>
      </Card>

      {/* History of Present Illness */}
      <Card
        size="small"
        style={cardStyles}
        styles={{ header: { borderBottom: `1px solid ${colors.borderLight}` } }}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SectionIcon icon={<FileTextOutlined />} color={colors.purple} bg={colors.purpleBg} />
            <span>History of Present Illness (HPI)</span>
          </div>
        }
      >
        <TextArea
          placeholder="Describe the history of the present illness - onset, duration, character, severity, associated symptoms, aggravating/alleviating factors..."
          value={consultation.historyOfPresentIllness}
          onChange={(e) => updateHPI(e.target.value)}
          rows={5}
          maxLength={2000}
          showCount
          style={{ borderRadius: radius.md }}
        />
        <div
          style={{
            marginTop: 10,
            padding: '8px 12px',
            background: colors.purpleBg,
            borderRadius: radius.md,
            border: `1px solid ${colors.purpleBorder}`,
          }}
        >
          <Text style={{ fontSize: 11, color: colors.purple }}>
            <strong>OLDCARTS:</strong> Onset, Location, Duration, Character, Aggravating factors, Relieving factors, Timing, Severity
          </Text>
        </div>
      </Card>

      {/* Review of Systems */}
      <Card
        size="small"
        style={cardStyles}
        styles={{ header: { borderBottom: `1px solid ${colors.borderLight}` } }}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SectionIcon icon={<UnorderedListOutlined />} color={colors.teal} bg={colors.tealBg} />
            <span>Review of Systems (ROS)</span>
            <Tag style={{ borderRadius: radius.pill, fontSize: 11, fontWeight: 'normal' }}>
              {documentedRos.length}/{rosFields.length} documented
            </Tag>
          </div>
        }
        extra={
          <Button
            size="small"
            type="text"
            style={{ borderRadius: radius.md, background: colors.bgSubtle, fontSize: 12 }}
            onClick={() => {
              const allNegative: Partial<ReviewOfSystems> = {};
              rosFields.forEach((f) => {
                if (!consultation.reviewOfSystems[f.key]) {
                  allNegative[f.key] = 'Negative / No complaints';
                }
              });
              updateROS(allNegative);
            }}
          >
            <CheckCircleOutlined /> Mark all negative
          </Button>
        }
      >
        <Row gutter={[10, 10]}>
          {rosFields.map((field) => (
            <Col span={12} key={field.key}>
              <RosItem
                field={field}
                value={consultation.reviewOfSystems[field.key] || ''}
                onChange={(val) => updateROS({ [field.key]: val })}
              />
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
};

export default SubjectiveForm;
