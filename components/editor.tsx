'use client';

import { useJsonForm } from '@/stores/json-form';
import dynamic from 'next/dynamic';

import Editor from '@monaco-editor/react';
import { Button } from './ui/button';
import { useTheme } from 'next-themes';

export function CodeEditor() {
  const { theme } = useTheme();

  const state = useJsonForm((state) => state);

  function handleEditorChange(value: string | undefined) {
    if (value) state.setJson(JSON.parse(value));
  }

  return (
    <>
      <div className='flex border m-4'>
        <Editor
          height='15vh'
          width='500px'
          theme={theme === 'dark' ? 'vs-dark' : 'vs-light'}
          defaultLanguage='json'
          options={{
            formatOnPaste: true,
            formatOnType: true,
            minimap: {
              enabled: false,
            },
            autoClosingBrackets: 'always',
          }}
          onChange={handleEditorChange}
          value={JSON.stringify(state.json, null, 2)}
        />
      </div>
    </>
  );
}
