import React from 'react';
import { sectionIconSize } from '../../theme/designTokens';

interface SectionIconProps {
  icon: React.ReactNode;
  color: string;
  bg: string;
}

const SectionIcon: React.FC<SectionIconProps> = ({ icon, color, bg }) => (
  <div
    style={{
      width: sectionIconSize.width,
      height: sectionIconSize.height,
      borderRadius: sectionIconSize.borderRadius,
      background: bg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <span style={{ color, fontSize: sectionIconSize.fontSize }}>{icon}</span>
  </div>
);

export default SectionIcon;
