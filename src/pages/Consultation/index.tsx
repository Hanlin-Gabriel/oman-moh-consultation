import React, { useEffect, useState } from 'react';
import {
  Button, Card, Space, Typography, Drawer, Tag,
} from 'antd';
import {
  ArrowLeftOutlined, ArrowRightOutlined, RobotOutlined,
  FormOutlined, FileSearchOutlined, FileTextOutlined, MedicineBoxOutlined,
  CheckSquareOutlined, FileDoneOutlined, AppstoreOutlined,
  PlayCircleOutlined, SwapOutlined, CheckCircleOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useConsultationStore } from '../../store/consultationStore';
import {
  appointments, allergiesMap, vitalsMap, medicationsMap,
  labResultsMap, imagingMap, medicalHistoryMap, surgicalHistoryMap, familyHistoryMap,
} from '../../mock/data';
import { colors, radius, gradients, cardStyles, stepColors } from '../../theme/designTokens';

import PatientBanner from './components/PatientBanner';
import CoverSheet from './components/CoverSheet';
import DomainPanel from './components/DomainPanel';
import AISummary from './components/AISummary';
import SubjectiveForm from './components/SubjectiveForm';
import ObjectiveForm from './components/ObjectiveForm';
import AssessmentForm from './components/AssessmentForm';
import PlanForm from './components/PlanForm';
import EvaluationForm from './components/EvaluationForm';
import VisitSummary from './components/VisitSummary';

const { Text, Title } = Typography;

const soapSteps = [
  { title: 'Subjective', icon: <FormOutlined />, description: 'Chief Complaint & HPI' },
  { title: 'Objective', icon: <FileSearchOutlined />, description: 'Physical Exam & Review' },
  { title: 'Assessment', icon: <FileTextOutlined />, description: 'Diagnosis & Impression' },
  { title: 'Plan', icon: <MedicineBoxOutlined />, description: 'Orders, Rx & Referrals' },
  { title: 'Evaluation', icon: <CheckSquareOutlined />, description: 'Results & Progress' },
  { title: 'Summary', icon: <FileDoneOutlined />, description: 'Sign & Close' },
];

const apsoSteps = [
  { title: 'Assessment', icon: <FileTextOutlined />, description: 'Diagnosis & Impression' },
  { title: 'Plan', icon: <MedicineBoxOutlined />, description: 'Orders, Rx & Referrals' },
  { title: 'Objective', icon: <FileSearchOutlined />, description: 'Physical Exam & Review' },
  { title: 'Subjective', icon: <FormOutlined />, description: 'Chief Complaint & HPI' },
  { title: 'Evaluation', icon: <CheckSquareOutlined />, description: 'Results & Progress' },
  { title: 'Summary', icon: <FileDoneOutlined />, description: 'Sign & Close' },
];

const getStepContent = (stepTitle: string) => {
  switch (stepTitle) {
    case 'Subjective': return <SubjectiveForm />;
    case 'Objective': return <ObjectiveForm />;
    case 'Assessment': return <AssessmentForm />;
    case 'Plan': return <PlanForm />;
    case 'Evaluation': return <EvaluationForm />;
    case 'Summary': return <VisitSummary />;
    default: return null;
  }
};

// Mode selection card component
const ModeCard: React.FC<{
  mode: string;
  title: string;
  steps: string[];
  selected: boolean;
  onClick: () => void;
}> = ({ mode, title, steps, selected, onClick }) => (
  <div
    onClick={onClick}
    style={{
      flex: 1,
      padding: '20px 24px',
      borderRadius: radius.xl,
      border: selected ? `2px solid ${colors.primary}` : `2px solid ${colors.border}`,
      background: selected ? `linear-gradient(135deg, ${colors.primaryBg} 0%, #f0faf5 100%)` : '#fff',
      cursor: 'pointer',
      transition: 'all 0.2s',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    {selected && (
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          background: colors.primary,
          color: '#fff',
          fontSize: 10,
          padding: '2px 10px',
          borderRadius: `0 ${radius.lg}px 0 ${radius.lg}px`,
        }}
      >
        Selected
      </div>
    )}
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: radius.lg,
          background: selected ? colors.primary : colors.borderLight,
          color: selected ? '#fff' : '#999',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: 14,
        }}
      >
        {mode}
      </div>
      <Text strong style={{ fontSize: 16 }}>{title}</Text>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
      {steps.map((s, i) => (
        <React.Fragment key={s}>
          <Tag
            color={selected ? 'green' : 'default'}
            style={{ borderRadius: radius.sm, fontSize: 11, margin: 0 }}
          >
            {s}
          </Tag>
          {i < steps.length - 1 && (
            <ArrowRightOutlined style={{ fontSize: 9, color: '#bbb' }} />
          )}
        </React.Fragment>
      ))}
    </div>
  </div>
);

const ConsultationPage: React.FC = () => {
  const navigate = useNavigate();
  const { appointmentId } = useParams();
  const {
    currentAppointment, consultation, documentationMode,
    currentStep, showAISummary,
    engageAppointment, setDocumentationMode, setCurrentStep,
    setShowAISummary,
  } = useConsultationStore();

  const [domainDrawerOpen, setDomainDrawerOpen] = useState(false);
  const [modeSelected, setModeSelected] = useState(false);

  useEffect(() => {
    if (!currentAppointment && appointmentId) {
      const apt = appointments.find((a) => a.id === appointmentId);
      if (apt) {
        engageAppointment(apt);
      } else {
        navigate('/appointments');
      }
    }
  }, [appointmentId]);

  if (!currentAppointment || !consultation) return null;

  const patient = currentAppointment.patient;
  const patientId = patient.id;
  const allergies = allergiesMap[patientId] || [];
  const vitals = vitalsMap[patientId];
  const medications = medicationsMap[patientId] || [];
  const labResults = labResultsMap[patientId] || [];
  const imaging = imagingMap[patientId] || [];
  const medHistory = medicalHistoryMap[patientId] || [];
  const surgHistory = surgicalHistoryMap[patientId] || [];
  const famHistory = familyHistoryMap[patientId] || [];

  const steps = documentationMode === 'SOAPE' ? soapSteps : apsoSteps;

  const handleModeSelect = () => {
    setModeSelected(true);
  };

  const domainDrawer = (
    <Drawer
      title="Patient Domains"
      placement="right"
      width={720}
      open={domainDrawerOpen}
      onClose={() => setDomainDrawerOpen(false)}
    >
      <DomainPanel
        allergies={allergies}
        medications={medications}
        labResults={labResults}
        imaging={imaging}
        medicalHistory={medHistory}
        surgicalHistory={surgHistory}
        familyHistory={famHistory}
      />
    </Drawer>
  );

  // ==================== Phase 1: Cover Sheet ====================
  if (!modeSelected) {
    return (
      <div style={{ background: colors.bgPage, minHeight: '100vh' }}>
        <PatientBanner
          patient={patient}
          allergies={allergies}
          visitType={currentAppointment.visitType}
          visitReason={currentAppointment.visitReason}
        />

        {/* Toolbar */}
        <div
          style={{
            background: '#fff',
            padding: '8px 24px',
            borderBottom: `1px solid ${colors.border}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/appointments')}
            style={{ color: '#666' }}
          >
            Back to Appointments
          </Button>
          <Space size={12}>
            <Button
              size="small"
              icon={<RobotOutlined style={{ color: colors.purple }} />}
              onClick={() => setShowAISummary(!showAISummary)}
              type={showAISummary ? 'primary' : 'default'}
              ghost={showAISummary}
              style={showAISummary ? { borderColor: colors.purple, color: colors.purple } : {}}
            >
              AI Summary
            </Button>
            <Button
              size="small"
              icon={<AppstoreOutlined />}
              onClick={() => setDomainDrawerOpen(true)}
            >
              Patient Domains
            </Button>
          </Space>
        </div>

        <div style={{ padding: '16px 24px', maxWidth: 1400, margin: '0 auto' }}>
          {/* AI Summary */}
          {showAISummary && (
            <div style={{ marginBottom: 14 }}>
              <AISummary
                patient={patient}
                vitals={vitals}
                medications={medications}
                labResults={labResults}
                medicalHistory={medHistory}
                allergies={allergies}
                visitReason={currentAppointment.visitReason}
              />
            </div>
          )}

          {/* Cover Sheet */}
          <CoverSheet
            patient={patient}
            vitals={vitals}
            medications={medications}
            recentLabs={labResults}
            medicalHistory={medHistory}
          />

          {/* Documentation Mode Selection */}
          <Card
            style={{ ...cardStyles, marginTop: 14, overflow: 'hidden' }}
            styles={{ body: { padding: '24px 28px' } }}
          >
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 4 }}>
                <SwapOutlined style={{ color: colors.primary, fontSize: 18 }} />
                <Title level={4} style={{ margin: 0, color: colors.primary }}>
                  Select Documentation Mode
                </Title>
              </div>
              <Text type="secondary">Choose your preferred clinical documentation workflow</Text>
            </div>

            <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
              <ModeCard
                mode="S"
                title="SOAPE"
                steps={['Subjective', 'Objective', 'Assessment', 'Plan', 'Evaluation']}
                selected={documentationMode === 'SOAPE'}
                onClick={() => setDocumentationMode('SOAPE')}
              />
              <ModeCard
                mode="A"
                title="APSO"
                steps={['Assessment', 'Plan', 'Subjective', 'Objective', 'Evaluation']}
                selected={documentationMode === 'APSO'}
                onClick={() => setDocumentationMode('APSO')}
              />
            </div>

            <div style={{ textAlign: 'center' }}>
              <Button
                type="primary"
                size="large"
                icon={<PlayCircleOutlined />}
                onClick={handleModeSelect}
                style={{
                  background: gradients.primary,
                  border: 'none',
                  borderRadius: radius.lg,
                  height: 48,
                  paddingInline: 48,
                  fontSize: 15,
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(0,92,63,0.3)',
                }}
              >
                Begin Documentation
              </Button>
            </div>
          </Card>
        </div>

        {domainDrawer}
      </div>
    );
  }

  // ==================== Phase 2: SOAPE/APSO Workflow ====================

  return (
    <div style={{ background: colors.bgPage, minHeight: '100vh' }}>
      <PatientBanner
        patient={patient}
        allergies={allergies}
        visitType={currentAppointment.visitType}
        visitReason={currentAppointment.visitReason}
      />

      {/* Toolbar + Steps combined */}
      <div
        style={{
          background: '#fff',
          borderBottom: `1px solid ${colors.border}`,
          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          position: 'sticky',
          top: 53,
          zIndex: 40,
        }}
      >
        {/* Top row: navigation */}
        <div
          style={{
            padding: '6px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: `1px solid ${colors.bgSubtle}`,
          }}
        >
          <Space size={8}>
            <Button
              type="text"
              size="small"
              icon={<ArrowLeftOutlined />}
              onClick={() => setModeSelected(false)}
              style={{ color: '#666', fontSize: 12 }}
            >
              Cover Sheet
            </Button>
            <Tag
              style={{
                background: gradients.primary,
                color: '#fff',
                border: 'none',
                borderRadius: radius.sm,
                fontSize: 11,
                padding: '2px 10px',
                fontWeight: 600,
              }}
            >
              {documentationMode}
            </Tag>
          </Space>
          <Button
            size="small"
            icon={<AppstoreOutlined />}
            onClick={() => setDomainDrawerOpen(true)}
            style={{ borderRadius: radius.sm, fontSize: 12 }}
          >
            Domains
          </Button>
        </div>

        {/* Step navigation bar */}
        <div style={{ display: 'flex', padding: '0 16px' }}>
          {steps.map((s, i) => {
            const isActive = i === currentStep;
            const isCompleted = i < currentStep;
            const color = stepColors[i] || colors.textSecondary;

            return (
              <div
                key={i}
                onClick={() => setCurrentStep(i)}
                style={{
                  flex: 1,
                  padding: '12px 12px 10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  borderBottom: isActive ? `3px solid ${color}` : '3px solid transparent',
                  background: isActive ? `${color}08` : 'transparent',
                  transition: 'all 0.2s',
                  borderRadius: '4px 4px 0 0',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = colors.bgHover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = isActive ? `${color}08` : 'transparent';
                }}
              >
                {/* Step number / icon */}
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: radius.md,
                    background: isActive
                      ? color
                      : isCompleted
                      ? `${color}18`
                      : colors.borderLight,
                    color: isActive
                      ? '#fff'
                      : isCompleted
                      ? color
                      : '#bbb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 14,
                    flexShrink: 0,
                    transition: 'all 0.2s',
                  }}
                >
                  {isCompleted ? <CheckCircleOutlined /> : s.icon}
                </div>
                {/* Label */}
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? color : isCompleted ? colors.text : colors.textSecondary,
                      lineHeight: 1.2,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {s.title}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: isActive ? color : '#bbb',
                      lineHeight: 1.2,
                      marginTop: 2,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {s.description}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ padding: '16px 24px 80px', maxWidth: 1400, margin: '0 auto' }}>
        {/* Step Content */}
        <div style={{ minHeight: 400 }}>
          {getStepContent(steps[currentStep].title)}
        </div>
      </div>

      {/* Bottom Navigation - fixed */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '10px 24px',
          background: '#fff',
          borderTop: `1px solid ${colors.border}`,
          boxShadow: '0 -2px 8px rgba(0,0,0,0.06)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 40,
        }}
      >
        <div style={{ maxWidth: 1400, margin: '0 auto', width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Button
            disabled={currentStep === 0}
            onClick={() => setCurrentStep(currentStep - 1)}
            icon={<ArrowLeftOutlined />}
            style={{ borderRadius: radius.md, height: 38 }}
          >
            {currentStep > 0 ? steps[currentStep - 1].title : 'Previous'}
          </Button>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Step {currentStep + 1} of {steps.length}
          </Text>
          {currentStep < steps.length - 1 ? (
            <Button
              type="primary"
              onClick={() => setCurrentStep(currentStep + 1)}
              style={{
                background: gradients.primary,
                border: 'none',
                borderRadius: radius.md,
                height: 38,
                fontWeight: 600,
              }}
            >
              Next: {steps[currentStep + 1].title} <ArrowRightOutlined />
            </Button>
          ) : (
            <div style={{ width: 120 }} />
          )}
        </div>
      </div>

      {domainDrawer}
    </div>
  );
};

export default ConsultationPage;
