import React from 'react';
import { Card, Input, Alert, Tag } from 'antd';
import {
  FileSearchOutlined,
  EditOutlined,
  ToolOutlined,
} from '@ant-design/icons';
import { useConsultationStore } from '../../../store/consultationStore';
import SectionIcon from '../../../components/common/SectionIcon';
import { colors, cardStyles, radius } from '../../../theme/designTokens';

const { TextArea } = Input;
const EvaluationForm: React.FC = () => {
  const consultation = useConsultationStore((s) => s.consultation);
  const currentAppointment = useConsultationStore((s) => s.currentAppointment);
  const updateEvaluation = useConsultationStore((s) => s.updateEvaluationNotes);
  const updateProgress = useConsultationStore((s) => s.updateProgressNotes);
  const updatePlanAdj = useConsultationStore((s) => s.updatePlanAdjustment);

  if (!consultation || !currentAppointment) return null;

  const isFollowUp = currentAppointment.visitType === 'Follow-up';

  if (!isFollowUp) {
    return (
      <Card size="small" style={cardStyles}>
        <Alert
          type="info"
          message="Evaluation Step"
          description="This step is primarily for follow-up visits. Since this is an initial visit, you may skip this section or use it to document baseline evaluation notes."
          showIcon
        />
        <div style={{ marginTop: 16 }}>
          <Card
            size="small"
            style={cardStyles}
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <SectionIcon icon={<EditOutlined />} color={colors.info} bg={colors.infoBg} />
                <span>Baseline Evaluation Notes (Optional)</span>
              </div>
            }
          >
            <TextArea
              placeholder="Document any baseline evaluation notes for this initial visit..."
              value={consultation.evaluationNotes || ''}
              onChange={(e) => updateEvaluation(e.target.value)}
              rows={4}
              style={{ borderRadius: radius.md }}
            />
          </Card>
        </div>
      </Card>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Alert
        type="warning"
        message="Follow-up Visit Evaluation"
        description="Review previous visit results and document patient progress. You may amend previous notes if needed."
        showIcon
      />

      {/* Results / Progress */}
      <Card
        size="small"
        style={cardStyles}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SectionIcon icon={<FileSearchOutlined />} color={colors.purple} bg={colors.purpleBg} />
            <span>Results & Progress Review</span>
          </div>
        }
      >
        <TextArea
          placeholder={`Document review of results since last visit:\n- Lab results review\n- Imaging results review\n- Response to treatment\n- Symptom progression/resolution\n- Medication adherence & side effects`}
          value={consultation.evaluationNotes || ''}
          onChange={(e) => updateEvaluation(e.target.value)}
          rows={6}
          maxLength={2000}
          showCount
          style={{ borderRadius: radius.md }}
        />
      </Card>

      {/* Progress Notes */}
      <Card
        size="small"
        style={cardStyles}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SectionIcon icon={<EditOutlined />} color={colors.info} bg={colors.infoBg} />
            <span>Progress Notes</span>
            <Tag color="blue" style={{ borderRadius: radius.pill }}>Follow-up</Tag>
          </div>
        }
      >
        <TextArea
          placeholder={`Document patient progress:\n- Overall clinical status compared to previous visit\n- Goals achieved / not achieved\n- Complications or new findings\n- Patient's subjective improvement`}
          value={consultation.progressNotes || ''}
          onChange={(e) => updateProgress(e.target.value)}
          rows={5}
          maxLength={2000}
          showCount
          style={{ borderRadius: radius.md }}
        />
      </Card>

      {/* Plan Adjustment */}
      <Card
        size="small"
        style={cardStyles}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SectionIcon icon={<ToolOutlined />} color={colors.warning} bg={colors.warningBg} />
            <span>Plan Adjustment</span>
          </div>
        }
      >
        <TextArea
          placeholder={`Document any plan adjustments needed:\n- Medication changes (dose adjustment, add/discontinue)\n- New orders required\n- Change in follow-up interval\n- Referral modifications\n- Updated treatment goals`}
          value={consultation.planAdjustment || ''}
          onChange={(e) => updatePlanAdj(e.target.value)}
          rows={5}
          maxLength={2000}
          showCount
          style={{ borderRadius: radius.md }}
        />
      </Card>
    </div>
  );
};

export default EvaluationForm;
