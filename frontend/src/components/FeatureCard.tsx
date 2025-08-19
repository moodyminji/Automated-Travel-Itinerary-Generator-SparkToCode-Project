type Props = {
  title: string;
  body: string;
  icon?: React.ReactNode;
};

export default function FeatureCard({ title, body, icon }: Props) {
  return (
    <div className="card p-5 h-full">
      <div className="flex items-center gap-3 mb-2">
        {icon && <div className="text-secondary-500">{icon}</div>}
        <h3 className="h2">{title}</h3>
      </div>
      <p className="small opacity-80">{body}</p>
    </div>
  );
}
