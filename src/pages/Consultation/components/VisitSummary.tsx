import React, { useState } from 'react';
import {
  Card, Descriptions, Tag, Typography, Space, Button, Alert,
  Divider, Modal, Input, Result, Row, Col,
} from 'antd';
import {
  CheckCircleOutlined, PrinterOutlined, LockOutlined,
  FileDoneOutlined, WarningOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { useConsultationStore } from '../../../store/consultationStore';
import { useNavigate } from 'react-router-dom';
import SectionIcon from '../../../components/common/SectionIcon';
import { colors, cardStyles, radius, gradients } from '../../../theme/designTokens';

const { Text, Paragraph } = Typography;

const VisitSummary: React.FC = () => {
  const navigate = useNavigate();
  const consultation = useConsultationStore((s) => s.consultation);
  const currentAppointment = useConsultationStore((s) => s.currentAppointment);
  const signConsultation = useConsultationStore((s) => s.signConsultation);
  const closeVisit = useConsultationStore((s) => s.closeVisit);
  const resetConsultation = useConsultationStore((s) => s.resetConsultation);

  const [showSignModal, setShowSignModal] = useState(false);
  const [signPin, setSignPin] = useState('');
  const [signed, setSigned] = useState(false);
  const [closed, setClosed] = useState(false);

  if (!consultation || !currentAppointment) return null;

  const patient = currentAppointment.patient;

  // Validation checks
  const warnings: string[] = [];
  if (!consultation.chiefComplaint) warnings.push('Chief complaint is empty');
  if (consultation.diagnoses.length === 0) warnings.push('No diagnoses recorded');
  if (consultation.prescriptions.length > 0 && !consultation.followUp.recommended) {
    warnings.push('Prescriptions were added but no follow-up was scheduled');
  }

  const handleSign = () => {
    signConsultation();
    setSigned(true);
    setShowSignModal(false);
    setSignPin('');
  };

  const handleClose = () => {
    closeVisit();
    setClosed(true);
  };

  const handleReturn = () => {
    resetConsultation();
    navigate('/appointments');
  };

  if (closed) {
    return (
      <Result
        status="success"
        title="Visit Completed Successfully"
        subTitle={
          <div>
            <Text>
              Patient: {patient.firstName} {patient.lastName} ({patient.mrn})
            </Text>
            <br />
            <Text>
              Visit ID: {consultation.id} | Signed by: {consultation.doctorSignature}
            </Text>
            <br />
            <Text type="secondary">
              {dayjs(consultation.endTime).format('DD/MM/YYYY HH:mm')}
            </Text>
          </div>
        }
        extra={[
          <Button type="primary" key="return" onClick={handleReturn}>
            Return to Appointments
          </Button>,
          <Button key="print" icon={<PrinterOutlined />}>
            Print Summary
          </Button>,
        ]}
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Warnings */}
      {warnings.length > 0 && (
        <Alert
          type="warning"
          icon={<WarningOutlined />}
          message="Please review before signing"
          description={
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {warnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          }
          showIcon
        />
      )}

      {/* Visit Info */}
      <Card
        size="small"
        style={cardStyles}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SectionIcon icon={<FileDoneOutlined />} color={colors.primary} bg={colors.primaryBg} />
            <span>Visit Summary</span>
          </div>
        }
      >
        <Descriptions size="small" column={3}>
          <Descriptions.Item label="Patient">
            {patient.firstName} {patient.lastName}
          </Descriptions.Item>
          <Descriptions.Item label="MRN">{patient.mrn}</Descriptions.Item>
          <Descriptions.Item label="Visit Type">
            <Tag color={consultation.visitType === 'Initial' ? 'blue' : 'green'}>
              {consultation.visitType}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Documentation Mode">
            <Tag>{consultation.documentationMode}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Start Time">
            {dayjs(consultation.startTime).format('DD/MM/YYYY HH:mm')}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Tag color={signed ? 'success' : 'processing'}>
              {signed ? 'Signed' : consultation.status}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Row gutter={14}>
        {/* Subjective */}
        <Col span={12}>
          <Card size="small" title="Subjective" style={{ ...cardStyles, height: '100%' }}>
            <Text strong>Chief Complaint: </Text>
            <Text>{consultation.chiefComplaint || <Text type="secondary">Not documented</Text>}</Text>
            <Divider style={{ margin: '8px 0' }} />
            <Text strong>HPI: </Text>
            <Paragraph style={{ marginBottom: 0 }}>
              {consultation.historyOfPresentIllness || <Text type="secondary">Not documented</Text>}
            </Paragraph>
          </Card>
        </Col>

        {/* Assessment */}
        <Col span={12}>
          <Card size="small" title="Assessment" style={{ ...cardStyles, height: '100%' }}>
            {consultation.diagnoses.length === 0 ? (
              <Text type="secondary">No diagnoses recorded</Text>
            ) : (
              consultation.diagnoses.map((dx) => (
                <div key={dx.id} style={{ marginBottom: 4 }}>
                  <Tag color="blue">{dx.icdCode}</Tag>
                  <Text>{dx.description}</Text>
                  <Tag color={dx.type === 'Primary' ? 'green' : 'default'} style={{ marginLeft: 8 }}>
                    {dx.type}
                  </Tag>
                  <Tag color={dx.status === 'Final' ? 'success' : 'processing'}>
                    {dx.status}
                  </Tag>
                </div>
              ))
            )}
            {consultation.clinicalImpression && (
              <>
                <Divider style={{ margin: '8px 0' }} />
                <Text strong>Impression: </Text>
                <Text>{consultation.clinicalImpression}</Text>
              </>
            )}
          </Card>
        </Col>
      </Row>

      {/* Plan Summary */}
      <Card size="small" title="Plan" style={cardStyles}>
        <Row gutter={14}>
          <Col span={8}>
            <Text strong>Orders ({consultation.orders.length})</Text>
            {consultation.orders.map((o) => (
              <div key={o.id} style={{ marginTop: 4 }}>
                <Tag color={o.type === 'Lab' ? 'purple' : 'orange'}>{o.type}</Tag>
                <Text style={{ fontSize: 12 }}>{o.name}</Text>
              </div>
            ))}
            {consultation.orders.length === 0 && <div><Text type="secondary" style={{ fontSize: 12 }}>None</Text></div>}
          </Col>
          <Col span={8}>
            <Text strong>Prescriptions ({consultation.prescriptions.length})</Text>
            {consultation.prescriptions.map((rx) => (
              <div key={rx.id} style={{ marginTop: 4 }}>
                <Text style={{ fontSize: 12 }}>
                  {rx.medicationName} {rx.dosage} - {rx.frequency}
                </Text>
              </div>
            ))}
            {consultation.prescriptions.length === 0 && <div><Text type="secondary" style={{ fontSize: 12 }}>None</Text></div>}
          </Col>
          <Col span={8}>
            <Text strong>Referrals ({consultation.referrals.length})</Text>
            {consultation.referrals.map((ref) => (
              <div key={ref.id} style={{ marginTop: 4 }}>
                <Text style={{ fontSize: 12 }}>
                  {ref.specialty} - {ref.priority}
                </Text>
              </div>
            ))}
            {consultation.referrals.length === 0 && <div><Text type="secondary" style={{ fontSize: 12 }}>None</Text></div>}
          </Col>
        </Row>
        {consultation.followUp.recommended && (
          <>
            <Divider style={{ margin: '8px 0' }} />
            <Text strong>Follow-up: </Text>
            <Tag color="blue">{consultation.followUp.interval}</Tag>
            {consultation.followUp.instructions && (
              <Text style={{ fontSize: 12 }}> - {consultation.followUp.instructions}</Text>
            )}
          </>
        )}
      </Card>

      {/* Evaluation (if follow-up) */}
      {consultation.visitType === 'Follow-up' && (consultation.evaluationNotes || consultation.progressNotes) && (
        <Card size="small" title="Evaluation" style={cardStyles}>
          {consultation.evaluationNotes && (
            <div>
              <Text strong>Results Review: </Text>
              <Text>{consultation.evaluationNotes}</Text>
            </div>
          )}
          {consultation.progressNotes && (
            <div style={{ marginTop: 8 }}>
              <Text strong>Progress: </Text>
              <Text>{consultation.progressNotes}</Text>
            </div>
          )}
          {consultation.planAdjustment && (
            <div style={{ marginTop: 8 }}>
              <Text strong>Plan Adjustment: </Text>
              <Text>{consultation.planAdjustment}</Text>
            </div>
          )}
        </Card>
      )}

      {/* Actions */}
      <Card size="small" style={cardStyles}>
        <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
          {!signed ? (
            <>
              <Button icon={<PrinterOutlined />} style={{ borderRadius: radius.md }}>Print Preview</Button>
              <Button
                type="primary"
                icon={<LockOutlined />}
                onClick={() => setShowSignModal(true)}
                style={{
                  background: gradients.primary,
                  border: 'none',
                  borderRadius: radius.md,
                  height: 40,
                  fontWeight: 600,
                }}
                size="large"
              >
                Sign & Lock Consultation
              </Button>
            </>
          ) : (
            <>
              <Tag color="success" icon={<CheckCircleOutlined />} style={{ padding: '4px 12px', fontSize: 14, borderRadius: radius.pill }}>
                Signed by {consultation.doctorSignature} at{' '}
                {dayjs(consultation.signedAt).format('HH:mm')}
              </Tag>
              <Button icon={<PrinterOutlined />} style={{ borderRadius: radius.md }}>Print</Button>
              <Button
                type="primary"
                size="large"
                onClick={handleClose}
                style={{
                  background: gradients.primary,
                  border: 'none',
                  borderRadius: radius.md,
                  height: 40,
                  fontWeight: 600,
                }}
              >
                Close Visit & Update Billing
              </Button>
            </>
          )}
        </Space>
      </Card>

      {/* Sign Modal */}
      <Modal
        title={
          <Space>
            <LockOutlined />
            <span>Sign Consultation</span>
          </Space>
        }
        open={showSignModal}
        onCancel={() => {
          setShowSignModal(false);
          setSignPin('');
        }}
        onOk={handleSign}
        okText="Sign & Lock"
        okButtonProps={{
          disabled: signPin.length < 4,
        }}
      >
        <Alert
          type="warning"
          message="Once signed, this consultation note will be locked and cannot be modified without an amendment request."
          showIcon
          style={{ marginBottom: 16 }}
        />
        <div>
          <Text>Enter your PIN to sign as <strong>Dr. Ahmed Al-Balushi</strong>:</Text>
          <Input.Password
            placeholder="Enter 4-digit PIN"
            maxLength={6}
            value={signPin}
            onChange={(e) => setSignPin(e.target.value)}
            style={{ marginTop: 8, width: 200 }}
            size="large"
          />
          <div style={{ marginTop: 4 }}>
            <Text type="secondary" style={{ fontSize: 11 }}>
              (For demo purposes, enter any 4+ characters)
            </Text>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default VisitSummary;
