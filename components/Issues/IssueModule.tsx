import { FC } from 'react';

import IssueCard from './IssueCard';

interface IssueModuleProps {
  title: string;
  issue: any;
}

const IssueModule: FC<IssueModuleProps> = ({ title, issue }) => {
  return (
    <>
      <h1>{title}</h1>
      <IssueCard issue={issue}></IssueCard>
    </>
  );
};

export default IssueModule;
