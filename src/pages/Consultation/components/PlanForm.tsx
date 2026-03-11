import React, { useState } from 'react';
import {
  Card, Space, Typography, Input, Button, Table, Tag, Select, Modal, Form,
  Radio, Popconfirm, InputNumber, Switch, Checkbox, Row, Col,
} from 'antd';
import {
  PlusOutlined, DeleteOutlined, ExperimentOutlined, MedicineBoxOutlined,
  SendOutlined, BookOutlined, CalendarOutlined, AimOutlined,
} from '@ant-design/icons';
import { useConsultationStore } from '../../../store/consultationStore';
import {
  commonLabOrders, commonImagingOrders, commonMedications, specialties,
} from '../../../mock/data';
import SectionIcon from '../../../components/common/SectionIcon';
import { colors, cardStyles, radius } from '../../../theme/designTokens';
import type { Order, Prescription, Referral, OrderPriority } from '../../../types';

const { TextArea } = Input;
const { Text } = Typography;

// ===================== Lab / Imaging Orders =====================
const OrdersSection: React.FC = () => {
  const consultation = useConsultationStore((s) => s.consultation);
  const addOrder = useConsultationStore((s) => s.addOrder);
  const removeOrder = useConsultationStore((s) => s.removeOrder);
  const [showModal, setShowModal] = useState(false);
  const [orderType, setOrderType] = useState<'Lab' | 'Imaging'>('Lab');
  const [form] = Form.useForm();

  if (!consultation) return null;

  const handleAdd = (values: { name: string; priority: OrderPriority; instructions?: string }) => {
    const order: Order = {
      id: `ORD-${Date.now()}`,
      type: orderType,
      status: 'Ordered',
      orderedAt: new Date().toISOString(),
      ...values,
    };
    addOrder(order);
    setShowModal(false);
    form.resetFields();
  };

  return (
    <Card
      size="small"
      style={cardStyles}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <SectionIcon icon={<ExperimentOutlined />} color={colors.purple} bg={colors.purpleBg} />
          <span>Orders (Lab / Imaging / Procedures)</span>
          <Tag>{consultation.orders.length}</Tag>
        </div>
      }
      extra={
        <Space>
          <Button size="small" icon={<PlusOutlined />} onClick={() => { setOrderType('Lab'); setShowModal(true); }}>
            Lab Order
          </Button>
          <Button size="small" icon={<PlusOutlined />} onClick={() => { setOrderType('Imaging'); setShowModal(true); }}>
            Imaging Order
          </Button>
        </Space>
      }
    >
      {consultation.orders.length === 0 ? (
        <Text type="secondary" style={{ display: 'block', textAlign: 'center', padding: 16 }}>
          No orders placed yet
        </Text>
      ) : (
        <Table
          size="small"
          pagination={false}
          dataSource={consultation.orders}
          rowKey="id"
          columns={[
            {
              title: 'Type', dataIndex: 'type', key: 'type', width: 80,
              render: (t: string) => <Tag color={t === 'Lab' ? 'purple' : 'orange'}>{t}</Tag>,
            },
            { title: 'Order', dataIndex: 'name', key: 'name' },
            {
              title: 'Priority', dataIndex: 'priority', key: 'priority', width: 80,
              render: (p: string) => <Tag color={p === 'STAT' ? 'red' : p === 'Urgent' ? 'orange' : 'default'}>{p}</Tag>,
            },
            { title: 'Instructions', dataIndex: 'instructions', key: 'instr', ellipsis: true, width: 150 },
            {
              title: '', key: 'action', width: 40,
              render: (_: unknown, record: Order) => (
                <Popconfirm title="Remove?" onConfirm={() => removeOrder(record.id)}>
                  <Button size="small" type="text" danger icon={<DeleteOutlined />} />
                </Popconfirm>
              ),
            },
          ]}
        />
      )}

      <Modal
        title={`Add ${orderType} Order`}
        open={showModal}
        onCancel={() => { setShowModal(false); form.resetFields(); }}
        onOk={() => form.submit()}
        okText="Place Order"
      >
        <div style={{ marginBottom: 12 }}>
          <Text type="secondary">Common {orderType} Orders (click to select):</Text>
          <div style={{ maxHeight: 150, overflow: 'auto', marginTop: 4, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {(orderType === 'Lab' ? commonLabOrders : commonImagingOrders).map((o) => (
              <Tag
                key={o.name}
                style={{ cursor: 'pointer', marginBottom: 2 }}
                onClick={() => form.setFieldsValue({ name: o.name })}
              >
                {o.name}
              </Tag>
            ))}
          </div>
        </div>
        <Form form={form} layout="vertical" onFinish={handleAdd} initialValues={{ priority: 'Routine' }}>
          <Form.Item name="name" label="Order Name" rules={[{ required: true }]}>
            <Input placeholder={`Enter ${orderType.toLowerCase()} order...`} />
          </Form.Item>
          <Form.Item name="priority" label="Priority">
            <Radio.Group>
              <Radio value="Routine">Routine</Radio>
              <Radio value="Urgent">Urgent</Radio>
              <Radio value="STAT">STAT</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="instructions" label="Special Instructions">
            <TextArea rows={2} placeholder="Any special instructions..." />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

// ===================== Prescriptions =====================
const PrescriptionSection: React.FC = () => {
  const consultation = useConsultationStore((s) => s.consultation);
  const addPrescription = useConsultationStore((s) => s.addPrescription);
  const removePrescription = useConsultationStore((s) => s.removePrescription);
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();

  if (!consultation) return null;

  const handleAdd = (values: Omit<Prescription, 'id'>) => {
    addPrescription({ id: `RX-${Date.now()}`, ...values });
    setShowModal(false);
    form.resetFields();
  };

  return (
    <Card
      size="small"
      style={cardStyles}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <SectionIcon icon={<MedicineBoxOutlined />} color={colors.success} bg={colors.successBg} />
          <span>Prescriptions</span>
          <Tag color="green">{consultation.prescriptions.length}</Tag>
        </div>
      }
      extra={
        <Button size="small" type="primary" icon={<PlusOutlined />} onClick={() => setShowModal(true)}>
          New Prescription
        </Button>
      }
    >
      {consultation.prescriptions.length === 0 ? (
        <Text type="secondary" style={{ display: 'block', textAlign: 'center', padding: 16 }}>
          No prescriptions added yet
        </Text>
      ) : (
        <Table
          size="small"
          pagination={false}
          dataSource={consultation.prescriptions}
          rowKey="id"
          columns={[
            { title: 'Medication', dataIndex: 'medicationName', key: 'med' },
            { title: 'Dosage', dataIndex: 'dosage', key: 'dose', width: 80 },
            { title: 'Frequency', dataIndex: 'frequency', key: 'freq', width: 110 },
            { title: 'Route', dataIndex: 'route', key: 'route', width: 70 },
            { title: 'Duration', dataIndex: 'duration', key: 'dur', width: 80 },
            { title: 'Qty', dataIndex: 'quantity', key: 'qty', width: 50 },
            { title: 'Instructions', dataIndex: 'instructions', key: 'instr', ellipsis: true, width: 150 },
            {
              title: '', key: 'action', width: 40,
              render: (_: unknown, record: Prescription) => (
                <Popconfirm title="Remove?" onConfirm={() => removePrescription(record.id)}>
                  <Button size="small" type="text" danger icon={<DeleteOutlined />} />
                </Popconfirm>
              ),
            },
          ]}
        />
      )}

      <Modal
        title="New Prescription"
        open={showModal}
        onCancel={() => { setShowModal(false); form.resetFields(); }}
        onOk={() => form.submit()}
        okText="Add Prescription"
        width={640}
      >
        <div style={{ marginBottom: 12 }}>
          <Text type="secondary">Common medications (click to select):</Text>
          <div style={{ maxHeight: 120, overflow: 'auto', marginTop: 4, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {commonMedications.map((m) => (
              <Tag
                key={m.name}
                style={{ cursor: 'pointer' }}
                onClick={() =>
                  form.setFieldsValue({
                    medicationName: m.name,
                    genericName: m.genericName,
                    route: m.route,
                    dosage: m.dosages[0],
                  })
                }
              >
                {m.name}
              </Tag>
            ))}
          </div>
        </div>

        <Form form={form} layout="vertical" onFinish={handleAdd} initialValues={{ quantity: 30, refills: 0, substitutionAllowed: true, route: 'Oral' }}>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item name="medicationName" label="Medication Name" rules={[{ required: true }]}>
                <Input placeholder="e.g., Metformin" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="genericName" label="Generic Name">
                <Input placeholder="e.g., Metformin HCl" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={6}>
              <Form.Item name="dosage" label="Dosage" rules={[{ required: true }]}>
                <Input placeholder="e.g., 500mg" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="frequency" label="Frequency" rules={[{ required: true }]}>
                <Select
                  placeholder="Select"
                  options={[
                    { label: 'Once daily', value: 'Once daily' },
                    { label: 'Twice daily', value: 'Twice daily' },
                    { label: 'Three times daily', value: 'Three times daily' },
                    { label: 'Four times daily', value: 'Four times daily' },
                    { label: 'Every 8 hours', value: 'Every 8 hours' },
                    { label: 'Every 12 hours', value: 'Every 12 hours' },
                    { label: 'As needed (PRN)', value: 'As needed (PRN)' },
                    { label: 'At bedtime', value: 'At bedtime' },
                    { label: 'Weekly', value: 'Weekly' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="route" label="Route" rules={[{ required: true }]}>
                <Select
                  options={[
                    { label: 'Oral', value: 'Oral' },
                    { label: 'IV', value: 'IV' },
                    { label: 'IM', value: 'IM' },
                    { label: 'SC', value: 'SC' },
                    { label: 'Topical', value: 'Topical' },
                    { label: 'Inhaled', value: 'Inhaled' },
                    { label: 'Rectal', value: 'Rectal' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="duration" label="Duration" rules={[{ required: true }]}>
                <Select
                  placeholder="Select"
                  options={[
                    { label: '3 days', value: '3 days' },
                    { label: '5 days', value: '5 days' },
                    { label: '7 days', value: '7 days' },
                    { label: '10 days', value: '10 days' },
                    { label: '14 days', value: '14 days' },
                    { label: '30 days', value: '30 days' },
                    { label: '60 days', value: '60 days' },
                    { label: '90 days', value: '90 days' },
                    { label: 'Ongoing', value: 'Ongoing' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={12}>
            <Col span={6}>
              <Form.Item name="quantity" label="Quantity">
                <InputNumber min={1} max={999} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item name="refills" label="Refills">
                <InputNumber min={0} max={12} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="substitutionAllowed" label=" " valuePropName="checked">
                <Checkbox>Generic substitution allowed</Checkbox>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item name="instructions" label="Instructions" rules={[{ required: true }]}>
            <TextArea rows={2} placeholder="e.g., Take with meals. Avoid alcohol." />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

// ===================== Referrals =====================
const ReferralSection: React.FC = () => {
  const consultation = useConsultationStore((s) => s.consultation);
  const addReferral = useConsultationStore((s) => s.addReferral);
  const removeReferral = useConsultationStore((s) => s.removeReferral);
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();

  if (!consultation) return null;

  const handleAdd = (values: Omit<Referral, 'id'>) => {
    addReferral({ id: `REF-${Date.now()}`, ...values });
    setShowModal(false);
    form.resetFields();
  };

  return (
    <Card
      size="small"
      style={cardStyles}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <SectionIcon icon={<SendOutlined />} color={colors.teal} bg={colors.tealBg} />
          <span>Referrals</span>
          <Tag>{consultation.referrals.length}</Tag>
        </div>
      }
      extra={
        <Button size="small" icon={<PlusOutlined />} onClick={() => setShowModal(true)}>
          Add Referral
        </Button>
      }
    >
      {consultation.referrals.length === 0 ? (
        <Text type="secondary" style={{ display: 'block', textAlign: 'center', padding: 16 }}>
          No referrals
        </Text>
      ) : (
        <Table
          size="small"
          pagination={false}
          dataSource={consultation.referrals}
          rowKey="id"
          columns={[
            { title: 'Specialty', dataIndex: 'specialty', key: 'spec', width: 150 },
            { title: 'Reason', dataIndex: 'reason', key: 'reason' },
            {
              title: 'Priority', dataIndex: 'priority', key: 'pri', width: 90,
              render: (p: string) => <Tag color={p === 'Emergency' ? 'red' : p === 'Urgent' ? 'orange' : 'default'}>{p}</Tag>,
            },
            {
              title: '', key: 'action', width: 40,
              render: (_: unknown, r: Referral) => (
                <Popconfirm title="Remove?" onConfirm={() => removeReferral(r.id)}>
                  <Button size="small" type="text" danger icon={<DeleteOutlined />} />
                </Popconfirm>
              ),
            },
          ]}
        />
      )}

      <Modal
        title="Add Referral"
        open={showModal}
        onCancel={() => { setShowModal(false); form.resetFields(); }}
        onOk={() => form.submit()}
        okText="Add Referral"
      >
        <Form form={form} layout="vertical" onFinish={handleAdd} initialValues={{ priority: 'Routine' }}>
          <Form.Item name="specialty" label="Specialty" rules={[{ required: true }]}>
            <Select
              showSearch
              placeholder="Select specialty"
              options={specialties.map((s) => ({ label: s, value: s }))}
            />
          </Form.Item>
          <Form.Item name="physician" label="Preferred Physician (Optional)">
            <Input placeholder="e.g., Dr. Mohammed Al-Farsi" />
          </Form.Item>
          <Form.Item name="facility" label="Preferred Facility (Optional)">
            <Input placeholder="e.g., Royal Hospital Cardiology Dept" />
          </Form.Item>
          <Form.Item name="reason" label="Reason for Referral" rules={[{ required: true }]}>
            <TextArea rows={3} placeholder="Describe the reason for referral..." />
          </Form.Item>
          <Form.Item name="priority" label="Priority">
            <Radio.Group>
              <Radio value="Routine">Routine</Radio>
              <Radio value="Urgent">Urgent</Radio>
              <Radio value="Emergency">Emergency</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="notes" label="Additional Notes">
            <TextArea rows={2} placeholder="Any additional information..." />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

// ===================== Main Plan Form =====================
const PlanForm: React.FC = () => {
  const consultation = useConsultationStore((s) => s.consultation);
  const updateEducation = useConsultationStore((s) => s.updatePatientEducation);
  const updateGoals = useConsultationStore((s) => s.updateTreatmentGoals);
  const updateFollowUp = useConsultationStore((s) => s.updateFollowUp);

  if (!consultation) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <OrdersSection />
      <PrescriptionSection />
      <ReferralSection />

      {/* Patient Education */}
      <Card
        size="small"
        style={cardStyles}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SectionIcon icon={<BookOutlined />} color={colors.info} bg={colors.infoBg} />
            <span>Patient Education</span>
          </div>
        }
      >
        <TextArea
          placeholder="Document patient education provided - disease management, lifestyle modifications, medication instructions, warning signs, when to seek emergency care..."
          value={consultation.patientEducation}
          onChange={(e) => updateEducation(e.target.value)}
          rows={3}
          maxLength={1000}
          showCount
          style={{ borderRadius: radius.md }}
        />
      </Card>

      {/* Treatment Goals */}
      <Card
        size="small"
        style={cardStyles}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SectionIcon icon={<AimOutlined />} color={colors.warning} bg={colors.warningBg} />
            <span>Treatment Goals</span>
          </div>
        }
      >
        <TextArea
          placeholder="Define specific, measurable treatment goals - target HbA1c, target BP, weight loss goals, symptom resolution..."
          value={consultation.treatmentGoals}
          onChange={(e) => updateGoals(e.target.value)}
          rows={3}
          maxLength={1000}
          showCount
          style={{ borderRadius: radius.md }}
        />
      </Card>

      {/* Follow-up Schedule */}
      <Card
        size="small"
        style={cardStyles}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <SectionIcon icon={<CalendarOutlined />} color={colors.success} bg={colors.successBg} />
            <span>Follow-up Schedule</span>
          </div>
        }
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <Space>
            <Text>Follow-up recommended:</Text>
            <Switch
              checked={consultation.followUp.recommended}
              onChange={(checked) =>
                updateFollowUp({ ...consultation.followUp, recommended: checked })
              }
            />
          </Space>
          {consultation.followUp.recommended && (
            <>
              <Select
                placeholder="Select follow-up interval"
                value={consultation.followUp.interval}
                onChange={(val) =>
                  updateFollowUp({ ...consultation.followUp, interval: val })
                }
                style={{ width: 250 }}
                options={[
                  { label: '1 week', value: '1 week' },
                  { label: '2 weeks', value: '2 weeks' },
                  { label: '1 month', value: '1 month' },
                  { label: '2 months', value: '2 months' },
                  { label: '3 months', value: '3 months' },
                  { label: '6 months', value: '6 months' },
                  { label: '1 year', value: '1 year' },
                  { label: 'As needed', value: 'As needed' },
                ]}
              />
              <TextArea
                placeholder="Follow-up instructions..."
                value={consultation.followUp.instructions || ''}
                onChange={(e) =>
                  updateFollowUp({ ...consultation.followUp, instructions: e.target.value })
                }
                rows={2}
                style={{ borderRadius: radius.md }}
              />
            </>
          )}
        </Space>
      </Card>
    </div>
  );
};

export default PlanForm;
