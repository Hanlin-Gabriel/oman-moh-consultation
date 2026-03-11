import React from 'react';
import { Space, Tag, Typography, Avatar, Tooltip } from 'antd';
import {
  ManOutlined,
  WomanOutlined,
  AlertOutlined,
  PhoneOutlined,
  IdcardOutlined,
  HeartOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons';
import { colors, radius, gradients } from '../../../theme/designTokens';
import type { Patient, Allergy } from '../../../types';

const { Text } = Typography;

interface PatientBannerProps {
  patient: Patient;
  allergies: Allergy[];
  visitType: 'Initial' | 'Follow-up';
  visitReason: string;
}

const PatientBanner: React.FC<PatientBannerProps> = ({
  patient,
  allergies,
  visitType,
  visitReason,
}) => {
  const activeAllergies = allergies.filter((a) => a.status === 'Active');
  const hasSevereAllergy = activeAllergies.some(
    (a) => a.severity === 'Severe' || a.severity === 'Life-threatening'
  );

  return (
    <div
      style={{
        background: gradients.primary,
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 2px 8px rgba(0,92,63,0.2)',
      }}
    >
      {/* Left: patient info */}
      <Space size={14} align="center">
        <Avatar
          size={44}
          style={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            border: '2px solid rgba(255,255,255,0.4)',
            fontSize: 18,
            color: '#fff',
          }}
          icon={patient.gender === 'Male' ? <ManOutlined /> : <WomanOutlined />}
        />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Text strong style={{ fontSize: 15, color: '#fff' }}>
              {patient.firstName} {patient.lastName}
            </Text>
            {patient.firstNameAr && (
              <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
                ({patient.firstNameAr} {patient.lastNameAr})
              </Text>
            )}
            <Tag
              color={visitType === 'Initial' ? colors.info : colors.success}
              style={{ borderRadius: radius.pill, fontSize: 11, lineHeight: '18px', border: 'none' }}
            >
              {visitType}
            </Tag>
          </div>
          <div style={{ marginTop: 3, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
              <IdcardOutlined style={{ marginRight: 3 }} />
              {patient.mrn}
            </Text>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
              {patient.age}y / {patient.gender}
            </Text>
            {patient.bloodType && (
              <>
                <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
                <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
                  <HeartOutlined style={{ marginRight: 3 }} />
                  {patient.bloodType}
                </Text>
              </>
            )}
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>|</span>
            <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
              <PhoneOutlined style={{ marginRight: 3 }} />
              {patient.phone}
            </Text>
          </div>
        </div>
      </Space>

      {/* Right: reason, allergies, insurance */}
      <Space size={10}>
        <Tag
          style={{
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff',
            maxWidth: 260,
            whiteSpace: 'normal',
            fontSize: 12,
            borderRadius: radius.sm,
          }}
        >
          {visitReason}
        </Tag>

        {/* Allergies */}
        {activeAllergies.length === 0 ? (
          <Tag
            icon={<SafetyCertificateOutlined />}
            style={{
              background: 'rgba(82,196,26,0.15)',
              border: '1px solid rgba(82,196,26,0.4)',
              color: '#b7eb8f',
              borderRadius: radius.sm,
              fontSize: 12,
            }}
          >
            NKA
          </Tag>
        ) : (
          <Tooltip
            title={
              <div>
                {activeAllergies.map((a) => (
                  <div key={a.id} style={{ padding: '2px 0' }}>
                    <strong>{a.allergen}</strong> ({a.severity}) - {a.reaction}
                  </div>
                ))}
              </div>
            }
          >
            <Tag
              icon={<AlertOutlined />}
              style={{
                background: hasSevereAllergy ? 'rgba(255,77,79,0.2)' : 'rgba(250,173,20,0.2)',
                border: `1px solid ${hasSevereAllergy ? 'rgba(255,77,79,0.5)' : 'rgba(250,173,20,0.5)'}`,
                color: hasSevereAllergy ? '#ffa39e' : '#ffd666',
                cursor: 'pointer',
                borderRadius: radius.sm,
                fontSize: 12,
              }}
            >
              {activeAllergies.length} Allerg{activeAllergies.length > 1 ? 'ies' : 'y'}
            </Tag>
          </Tooltip>
        )}

        {patient.insuranceProvider && (
          <Tag
            style={{
              background: 'rgba(22,119,255,0.15)',
              border: '1px solid rgba(22,119,255,0.3)',
              color: '#91caff',
              borderRadius: radius.sm,
              fontSize: 12,
            }}
          >
            {patient.insuranceProvider}
          </Tag>
        )}
      </Space>
    </div>
  );
};

export default PatientBanner;
