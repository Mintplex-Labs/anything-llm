import React from 'react';
import { File } from '@phosphor-icons/react';
import BaseNode from './BaseNode';

export default function FileNode({ data, isConnectable }) {
  return (
    <BaseNode
      data={{
        ...data,
        icon: <File className="w-4 h-4 text-theme-text-primary" />,
        label: data.label || 'Open File',
        description: data.description || 'Read or write to a file'
      }}
      isConnectable={isConnectable}
    />
  );
}
