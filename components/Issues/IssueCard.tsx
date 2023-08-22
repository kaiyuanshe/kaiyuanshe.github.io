import { FC } from 'react';

interface IssueCardProps {
  issue: any;
}

const IssueCard: FC<IssueCardProps> = ({ issue }) => {
  return <>{issue}</>;
};

export default IssueCard;
