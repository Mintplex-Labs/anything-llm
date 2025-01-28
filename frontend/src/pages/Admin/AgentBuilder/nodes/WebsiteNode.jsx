import React from 'react';
import { Browser } from '@phosphor-icons/react';
import BaseNode from './BaseNode';

export default function WebsiteNode({ data, isConnectable }) {
  return (
    <BaseNode
      data={{
        ...data,
        icon: <Browser className="w-4 h-4 text-theme-text-primary" />,
        label: data.label || 'Open Website',
        description: data.description || 'Navigate to a URL'
      }}
      isConnectable={isConnectable}
    />
  );
}
