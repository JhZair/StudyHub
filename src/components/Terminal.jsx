import React, { useState, useEffect } from 'react';

const Terminal = () => {
  const [lines, setLines] = useState([]);
  const [cursor, setCursor] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCursor(prev => !prev);
    }, 500);

    const commands = [
      {
        command: 'npm install react-router-dom',
        output: 'added 1 package in 2s\n\n✨  Done in 2.12s.'
      },
      {
        command: 'npm install axios',
        output: 'added 1 package in 1s\n\n✨  Done in 1.53s.'
      },
      {
        command: 'npm install tailwindcss',
        output: 'added 3 packages in 3s\n\n✨  Done in 3.25s.'
      },
      {
        command: 'npm install styled-components',
        output: 'added 1 package in 2s\n\n✨  Done in 2.34s.'
      },
      {
        command: 'npm install @emotion/react',
        output: 'added 1 package in 1s\n\n✨  Done in 1.12s.'
      }
    ];

    const addLine = setInterval(() => {
      const newLines = [...lines];
      if (newLines.length < 5) {
        const randomCmd = commands[Math.floor(Math.random() * commands.length)];
        newLines.push(`$ ${randomCmd.command}\n${randomCmd.output}`);
        setLines(newLines);
      }
    }, 3000);

    return () => {
      clearInterval(interval);
      clearInterval(addLine);
    };
  }, [lines]);

  return (
    <div className="terminal">
      <div className="header">
        <div className="buttons">
          <div className="button red"></div>
          <div className="button yellow"></div>
          <div className="button green"></div>
        </div>
        <p className="title">bash</p>
      </div>
      <div className="content">
        {lines.map((line, index) => (
          <p key={index} className="line">
            {line.split('\n').map((part, partIndex) => (
              <span key={partIndex} className={part.startsWith('$') ? 'command' : 'output'}>
                {part}
              </span>
            ))}
          </p>
        ))}
        <p className="line">
          <span className="command">$</span>
          <span className="cursor" style={{ visibility: cursor ? 'visible' : 'hidden' }}>
            _
          </span>
        </p>
      </div>
    </div>
  );
};

export default Terminal;
