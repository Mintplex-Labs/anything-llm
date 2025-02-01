async function executeCode(config) {
  const { language, code } = config;

  // For security, we'll just return what would be executed for now
  return `Would execute ${language} code:\n${code}`;
}

module.exports = executeCode;
