type Props = {
  params: {
    maturity: string;
  };
};

export default function DelegateDetail({ params }: Props) {
  const { maturity } = params;

  return (
    <div>
      <h1>Delegate Detail</h1>
      <p>Maturity: {maturity}</p>
      {/* Your delegate detail content */}
    </div>
  );
}
