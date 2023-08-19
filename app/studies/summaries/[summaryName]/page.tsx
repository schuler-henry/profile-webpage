import React from 'react';

export default function Summary({
  params,
}: {
  params: { summaryName: string };
}) {
  return <div>Summary {params.summaryName}</div>;
}
