import React from 'react';
import { Code } from '@phosphor-icons/react';
import BaseNode from './BaseNode';

export default function CodeNode({ data, isConnectable }) {
  return (
    <BaseNode
      data={{
        ...data,
        icon: <Code className="w-4 h-4 text-theme-text-primary" />,
        label: data.label || 'Code Execution',
        description: data.description || 'Execute code snippets'
      }}
      isConnectable={isConnectable}
    />
  );
}
