import React from 'react';
import { Globe } from '@phosphor-icons/react';
import BaseNode from './BaseNode';

export default function ApiCallNode({ data, isConnectable }) {
  return (
    <BaseNode
      data={{
        ...data,
        icon: <Globe className="w-4 h-4 text-theme-text-primary" />,
        label: data.label || 'API Call',
        description: data.description || 'Make an HTTP request'
      }}
      isConnectable={isConnectable}
    />
  );
}
