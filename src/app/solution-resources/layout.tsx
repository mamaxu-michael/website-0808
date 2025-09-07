import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '解决方案资源中心',
  description: '精选碳足迹方法、行业洞察与最佳实践，支持企业低碳转型。',
  alternates: { canonical: '/solution-resources' }
};

export default function SolutionResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}


