export default {
  meta: {
    type: 'layout',
    fixable: 'whitespace',
    messages: {
      requireSingleNewline: 'must end with exactly one newline',
      disallowMultipleNewlines: 'must end with exactly one newline',
      noWhitespaceOnlyLines: 'Line {{line}} contains only whitespace (tabs or spaces). Remove all whitespace from this line.',
    },
  },
  create(context) {
    const sourceCode = context.sourceCode;
    return {
      Program(node) {
        const text = sourceCode.getText();
        const lines = text.split(/\r?\n/);

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          if (line.length > 0 && line.trim() === '' && (line.includes(' ') || line.includes('\t'))) {
            context.report({
              node,
              messageId: 'noWhitespaceOnlyLines',
              data: { line: i + 1 },
              fix(fixer) {
                let lineStart = 0;
                for (let j = 0; j < i; j++) {
                  lineStart += lines[j].length + 1;
                }
                const lineEnd = lineStart + line.length;
                return fixer.replaceTextRange([lineStart, lineEnd], '');
              },
            });
          }
        }

        let trailingEmptyLines = 0;
        for (let i = lines.length - 1; i >= 0; i--) {
          if (lines[i].trim() === '') {
            trailingEmptyLines++;
          } else {
            break;
          }
        }

        if (trailingEmptyLines !== 1) {
          context.report({
            node,
            messageId: trailingEmptyLines > 1 
              ? 'disallowMultipleNewlines' 
              : 'requireSingleNewline',
            data: { count: trailingEmptyLines },
            fix(fixer) {
              const text = sourceCode.getText();
              const lines = text.split(/\r?\n/);
              
              let lastNonEmptyIndex = lines.length - 1;
              while (lastNonEmptyIndex >= 0 && lines[lastNonEmptyIndex].trim() === '') {
                lastNonEmptyIndex--;
              }
              
              if (lastNonEmptyIndex < 0) {
                return fixer.replaceTextRange([0, text.length], '\n');
              }
              
              let endOfLastNonEmpty = 0;
              for (let i = 0; i <= lastNonEmptyIndex; i++) {
                endOfLastNonEmpty += lines[i].length;
                if (i < lastNonEmptyIndex) {
                  endOfLastNonEmpty += 1;
                }
              }
              
              return fixer.replaceTextRange([endOfLastNonEmpty, text.length], '\n\n');
            },
          });
        }
      },
    };
  },
};

