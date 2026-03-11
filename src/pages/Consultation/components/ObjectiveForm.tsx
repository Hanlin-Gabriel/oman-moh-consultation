import React from 'react';
import { Card, Input, Row, Col, Space, Typography, Collapse, Tag, Descriptions, Statistic, Button } from 'antd';
import {
  HeartOutlined,
  EditOutlined,
  FileSearchOutlined,
} from '@ant-design/icons';
import { useConsultationStore } from '../../../store/consultationStore';
import { vitalsMap, medicationsMap, labResultsMap, imagingMap } from '../../../mock/data';
import SectionIcon from '../../../components/common/SectionIcon';
import { colors, cardStyles, radius } from '../../../theme/designTokens';
import type { PhysicalExam, VitalSigns } from '../../../types';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Text } = Typography;

const peFields: { key: keyof PhysicalExam; label: string; placeholder: string }[] = [
  { key: 'generalAppearance', label: 'General Appearance', placeholder: 'e.g., Alert, oriented, no acute distress' },
  { key: 'heent', label: 'HEENT', placeholder: 'e.g., PERRLA, TMs clear, oropharynx benign' },
  { key: 'neck', label: 'Neck', placeholder: 'e.g., Supple, no JVD, no lymphadenopathy' },
  { key: 'chest', label: 'Chest / Lungs', placeholder: 'e.g., Clear to auscultation bilaterally, no wheezes/crackles' },
  { key: 'cardiovascular', label: 'Cardiovascular', placeholder: 'e.g., RRR, no murmurs/gallops/rubs' },
  { key: 'abdomen', label: 'Abdomen', placeholder: 'e.g., Soft, non-tender, non-distended, BS active' },
  { key: 'extremities', label: 'Extremities', placeholder: 'e.g., No edema, pulses 2+ bilaterally' },
  { key: 'neurological', label: 'Neurological', placeholder: 'e.g., CN II-XII intact, strength 5/5 all extremities' },
  { key: 'skin', label: 'Skin', placeholder: 'e.g., Warm, dry, no rashes or lesions' },
  { key: 'musculoskeletal', label: 'Musculoskeletal', placeholder: 'e.g., Full ROM, no joint swelling or tenderness' },
  { key: 'other', label: 'Other Findings', placeholder: 'Any additional examination findings...' },
];

const VitalsDisplay: React.FC<{ vitals: VitalSigns }> = ({ vitals }) => {
  const bpColor = vitals.bloodPressureSystolic && vitals.bloodPressureSystolic >= 140 ? colors.error : colors.success;
  const spo2Color = vitals.oxygenSaturation && vitals.oxygenSaturation < 95 ? colors.error : colors.success;

  return (
    <Row gutter={[12, 8]}>
      <Col span={4}>
        <Statistic
          title="BP"
          value={`${vitals.bloodPressureSystolic}/${vitals.bloodPressureDiastolic}`}
          suffix="mmHg"
          valueStyle={{ fontSize: 16, color: bpColor }}
        />
      </Col>
      <Col span={3}>
        <Statistic title="HR" value={vitals.heartRate} suffix="bpm" valueStyle={{ fontSize: 16 }} />
      </Col>
      <Col span={3}>
        <Statistic title="SpO2" value={vitals.oxygenSaturation} suffix="%" valueStyle={{ fontSize: 16, color: spo2Color }} />
      </Col>
      <Col span={3}>
        <Statistic title="Temp" value={vitals.temperature} suffix="°C" valueStyle={{ fontSize: 16 }} />
      </Col>
      <Col span={3}>
        <Statistic title="RR" value={vitals.respiratoryRate} suffix="/min" valueStyle={{ fontSize: 16 }} />
      </Col>
      <Col span={3}>
        <Statistic title="Weight" value={vitals.weight} suffix="kg" valueStyle={{ fontSize: 16 }} />
      </Col>
      <Col span={3}>
        <Statistic title="BMI" value={vitals.bmi} valueStyle={{ fontSize: 16 }} />
      </Col>
      <Col span={2}>
        <Statistic title="Pain" value={`${vitals.painLevel}/10`} valueStyle={{ fontSize: 16 }} />
      </Col>
    </Row>
  );
};

const ObjectiveForm: React.FC = () => {
  const consultation = useConsultationStore((s) => s.consultation);
  const currentAppointment = useConsultationStore((s) => s.currentAppointment);
  const updatePhysicalExam = useConsultationStore((s) => s.updatePhysicalExam);

  if (!consultation || !currentAppointment) return null;

  const patientId = currentAppointment.patientId;
  const vitals = vitalsMap[patientId];
  const meds = medicationsMap[patientId] || [];
  const labs = labResultsMap[patientId] || [];
  const images = imagingMap[patientId] || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Vital Signs Review */}
      <Card
        size="small"
        style={cardStyles}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SectionIcon icon={<HeartOutlined />} color={colors.error} bg={colors.errorBg} />
            <span>Vital Signs</span>
            {vitals && (
              <Text type="secondary" style={{ fontSize: 11, fontWeight: 'normal' }}>
                (Recorded at {dayjs(vitals.recordedAt).format('HH:mm')} by {vitals.recordedBy})
              </Text>
            )}
          </div>
        }
      >
        {vitals ? (
          <VitalsDisplay vitals={vitals} />
        ) : (
          <Text type="secondary">No vitals recorded for this visit. Please request nursing to record vitals.</Text>
        )}
      </Card>

      {/* Physical Examination */}
      <Card
        size="small"
        style={cardStyles}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SectionIcon icon={<EditOutlined />} color={colors.info} bg={colors.infoBg} />
            <span>Physical Examination</span>
          </div>
        }
        extra={
          <Button
            size="small"
            type="link"
            onClick={() => {
              const normalFindings: Partial<PhysicalExam> = {};
              peFields.forEach((f) => {
                if (!consultation.physicalExam[f.key] && f.key !== 'other') {
                  normalFindings[f.key] = f.placeholder.replace('e.g., ', '');
                }
              });
              updatePhysicalExam(normalFindings);
            }}
          >
            Auto-fill Normal
          </Button>
        }
      >
        <Collapse
          size="small"
          defaultActiveKey={['generalAppearance', 'chest', 'cardiovascular', 'abdomen']}
          items={peFields.map((field) => ({
            key: field.key,
            label: (
              <Space>
                <span>{field.label}</span>
                {consultation.physicalExam[field.key] && (
                  <Tag color="blue" style={{ fontSize: 10, borderRadius: radius.pill }}>Documented</Tag>
                )}
              </Space>
            ),
            children: (
              <TextArea
                placeholder={field.placeholder}
                value={consultation.physicalExam[field.key] || ''}
                onChange={(e) => updatePhysicalExam({ [field.key]: e.target.value })}
                rows={2}
                style={{ borderRadius: radius.md }}
              />
            ),
          }))}
        />
      </Card>

      {/* Review Section - Current Meds, Labs, Imaging */}
      <Card
        size="small"
        style={cardStyles}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SectionIcon icon={<FileSearchOutlined />} color={colors.purple} bg={colors.purpleBg} />
            <span>Review: Current Medications, Labs & Imaging</span>
          </div>
        }
      >
        <Collapse
          size="small"
          items={[
            {
              key: 'meds',
              label: `Current Medications (${meds.filter((m) => m.status === 'Active').length} active)`,
              children: meds.filter((m) => m.status === 'Active').length === 0 ? (
                <Text type="secondary">No active medications</Text>
              ) : (
                <Descriptions size="small" column={1}>
                  {meds
                    .filter((m) => m.status === 'Active')
                    .map((m) => (
                      <Descriptions.Item key={m.id} label={m.name}>
                        {m.dosage} - {m.frequency} ({m.route})
                        {m.instructions && <Text type="secondary"> | {m.instructions}</Text>}
                      </Descriptions.Item>
                    ))}
                </Descriptions>
              ),
            },
            {
              key: 'labs',
              label: `Recent Lab Results (${labs.length})`,
              children: labs.length === 0 ? (
                <Text type="secondary">No recent lab results</Text>
              ) : (
                <div>
                  {labs.map((l) => (
                    <div key={l.id} style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
                      <Text style={{ width: 180 }}>{l.testName}:</Text>
                      <Text strong type={l.status !== 'Normal' ? 'danger' : undefined}>
                        {l.value} {l.unit}
                      </Text>
                      <Text type="secondary">(ref: {l.referenceRange})</Text>
                      <Tag
                        color={l.status === 'Normal' ? 'green' : l.status === 'Critical' ? 'red' : 'orange'}
                        style={{ fontSize: 10, borderRadius: radius.pill }}
                      >
                        {l.status}
                      </Tag>
                    </div>
                  ))}
                </div>
              ),
            },
            {
              key: 'imaging',
              label: `Imaging Results (${images.length})`,
              children: images.length === 0 ? (
                <Text type="secondary">No imaging results</Text>
              ) : (
                images.map((img) => (
                  <div key={img.id} style={{ marginBottom: 8, padding: 8, background: colors.bgHover, borderRadius: radius.md }}>
                    <Space>
                      <Tag color="blue">{img.type}</Tag>
                      <Text strong>{img.bodyPart}</Text>
                      <Text type="secondary" style={{ fontSize: 11 }}>
                        {dayjs(img.resultDate).format('DD/MM/YYYY')}
                      </Text>
                    </Space>
                    <div style={{ marginTop: 4 }}>
                      <Text style={{ fontSize: 12 }}>
                        <strong>Impression:</strong> {img.impression}
                      </Text>
                    </div>
                  </div>
                ))
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default ObjectiveForm;
