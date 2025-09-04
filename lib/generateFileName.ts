export function generateFileName(originalName: string, prefix = 'product') {
  const extension = originalName.split('.').pop();
  const uniqueId = generateUnique(6);
  return `${prefix}-${uniqueId}.${extension}`;
}

function generateUnique(length: number) {
  return (
    Math.random()
      .toString(36)
      .substring(2, length + 2) + Date.now().toString(36)
  );
}
