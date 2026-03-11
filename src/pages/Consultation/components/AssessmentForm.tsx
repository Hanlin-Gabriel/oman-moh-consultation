import React, { useState } from 'react';
import { Card, Typography, Input, Button, Table, Tag, Modal, Form, Radio, Popconfirm } from 'antd';
import {
  PlusOutlined,
  DeleteOutlined,
  SearchOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import { useConsultationStore } from '../../../store/consultationStore';
import { commonICDCodes } from '../../../mock/data';
import SectionIcon from '../../../components/common/SectionIcon';
import { colors, cardStyles, radius } from '../../../theme/designTokens';
import type { Diagnosis } from '../../../types';

const { TextArea } = Input;
const { Text } = Typography;

const AssessmentForm: React.FC = () => {
  const consultation = useConsultationStore((s) => s.consultation);
  const addDiagnosis = useConsultationStore((s) => s.addDiagnosis);
  const removeDiagnosis = useConsultationStore((s) => s.removeDiagnosis);
  const updateImpression = useConsultationStore((s) => s.updateClinicalImpression);

  const [showDxModal, setShowDxModal] = useState(false);
  const [icdSearch, setIcdSearch] = useState('');
  const [form] = Form.useForm();

  if (!consultation) return null;

  const filteredCodes = commonICDCodes.filter(
    (c) =>
      c.code.toLowerCase().includes(icdSearch.toLowerCase()) ||
      c.description.toLowerCase().includes(icdSearch.toLowerCase()) ||
      c.category.toLowerCase().includes(icdSearch.toLowerCase())
  );

  const handleAddDx = (values: { icdCode: string; description: string; type: 'Primary' | 'Secondary'; status: 'Preliminary' | 'Final' | 'Working'; notes?: string }) => {
    const dx: Diagnosis = {
      id: `DX-${Date.now()}`,
      ...values,
    };
    addDiagnosis(dx);
    setShowDxModal(false);
    form.resetFields();
    setIcdSearch('');
  };

  const handleSelectICD = (code: string) => {
    const icd = commonICDCodes.find((c) => c.code === code);
    if (icd) {
      form.setFieldsValue({
        icdCode: icd.code,
        description: icd.description,
      });
    }
  };

  const dxColumns = [
    {
      title: '#',
      key: 'index',
      width: 40,
      render: (_: unknown, __: unknown, idx: number) => idx + 1,
    },
    {
      title: 'ICD-10',
      dataIndex: 'icdCode',
      key: 'icd',
      width: 80,
      render: (code: string) => <Tag color="blue">{code}</Tag>,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'desc',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (t: string) => (
        <Tag color={t === 'Primary' ? 'green' : 'default'}>{t}</Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (s: string) => (
        <Tag color={s === 'Final' ? 'success' : s === 'Working' ? 'processing' : 'warning'}>
          {s}
        </Tag>
      ),
    },
    {
      title: 'Notes',
      dataIndex: 'notes',
      key: 'notes',
      ellipsis: true,
      width: 150,
    },
    {
      title: '',
      key: 'action',
      width: 40,
      render: (_: unknown, record: Diagnosis) => (
        <Popconfirm title="Remove this diagnosis?" onConfirm={() => removeDiagnosis(record.id)}>
          <Button size="small" type="text" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Diagnosis List */}
      <Card
        size="small"
        style={cardStyles}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SectionIcon icon={<FileTextOutlined />} color={colors.warning} bg={colors.warningBg} />
            <span>Diagnosis / Impression</span>
          </div>
        }
        extra={
          <Button
            type="primary"
            size="small"
            icon={<PlusOutlined />}
            onClick={() => setShowDxModal(true)}
          >
            Add Diagnosis
          </Button>
        }
      >
        {consultation.diagnoses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 24, color: '#999' }}>
            <FileTextOutlined style={{ fontSize: 32, marginBottom: 8 }} />
            <br />
            <Text type="secondary">No diagnoses added yet. Click "Add Diagnosis" to begin.</Text>
          </div>
        ) : (
          <Table
            size="small"
            pagination={false}
            dataSource={consultation.diagnoses}
            columns={dxColumns}
            rowKey="id"
          />
        )}
      </Card>

      {/* Clinical Impression */}
      <Card
        size="small"
        style={cardStyles}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SectionIcon icon={<FileTextOutlined />} color={colors.info} bg={colors.infoBg} />
            <span>Clinical Impression / Summary</span>
          </div>
        }
      >
        <TextArea
          placeholder="Summarize your clinical impression, differential diagnoses, and reasoning..."
          value={consultation.clinicalImpression}
          onChange={(e) => updateImpression(e.target.value)}
          rows={4}
          maxLength={2000}
          showCount
          style={{ borderRadius: radius.md }}
        />
      </Card>

      {/* Add Diagnosis Modal */}
      <Modal
        title="Add Diagnosis"
        open={showDxModal}
        onCancel={() => {
          setShowDxModal(false);
          form.resetFields();
          setIcdSearch('');
        }}
        onOk={() => form.submit()}
        okText="Add"
        width={640}
      >
        <div style={{ marginBottom: 16 }}>
          <Text type="secondary">Search ICD-10 codes:</Text>
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search by code, description, or category..."
            value={icdSearch}
            onChange={(e) => setIcdSearch(e.target.value)}
            style={{ marginTop: 4 }}
            allowClear
          />
          {icdSearch && (
            <div
              style={{
                maxHeight: 200,
                overflow: 'auto',
                border: `1px solid ${colors.borderLight}`,
                borderRadius: radius.md,
                marginTop: 4,
              }}
            >
              {filteredCodes.map((c) => (
                <div
                  key={c.code}
                  onClick={() => handleSelectICD(c.code)}
                  style={{
                    padding: '6px 12px',
                    cursor: 'pointer',
                    borderBottom: `1px solid ${colors.bgSubtle}`,
                    display: 'flex',
                    gap: 8,
                    alignItems: 'center',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = colors.bgSubtle)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <Tag color="blue" style={{ margin: 0 }}>{c.code}</Tag>
                  <Text style={{ fontSize: 13 }}>{c.description}</Text>
                  <Tag style={{ fontSize: 10, marginLeft: 'auto' }}>{c.category}</Tag>
                </div>
              ))}
              {filteredCodes.length === 0 && (
                <div style={{ padding: 12, textAlign: 'center' }}>
                  <Text type="secondary">No matching codes found</Text>
                </div>
              )}
            </div>
          )}
        </div>

        <Form form={form} layout="vertical" onFinish={handleAddDx} initialValues={{ type: 'Primary', status: 'Working' }}>
          <Form.Item name="icdCode" label="ICD-10 Code" rules={[{ required: true, message: 'Required' }]}>
            <Input placeholder="e.g., E11.9" />
          </Form.Item>
          <Form.Item name="description" label="Description" rules={[{ required: true, message: 'Required' }]}>
            <Input placeholder="e.g., Type 2 diabetes mellitus without complications" />
          </Form.Item>
          <Form.Item name="type" label="Diagnosis Type" rules={[{ required: true }]}>
            <Radio.Group>
              <Radio value="Primary">Primary</Radio>
              <Radio value="Secondary">Secondary</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="status" label="Diagnosis Status" rules={[{ required: true }]}>
            <Radio.Group>
              <Radio value="Preliminary">Preliminary</Radio>
              <Radio value="Working">Working</Radio>
              <Radio value="Final">Final</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="notes" label="Notes (Optional)">
            <TextArea rows={2} placeholder="Additional notes about this diagnosis..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AssessmentForm;
