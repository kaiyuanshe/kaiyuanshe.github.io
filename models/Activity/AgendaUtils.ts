import { Agenda } from './Agenda';

export function processAgendaData(agendaGroup: Record<string, Agenda[]>) {
  const keynoteSpeechCounts = Object.fromEntries(
    Object.entries(agendaGroup).map(([forum, elements]) => {
      return [forum, elements.length];
    }),
  );

  const mentorOrganizationCounts = Object.values(agendaGroup)
    .flatMap(forum =>
      forum.flatMap(session => session.mentorOrganizations as string[]),
    )
    .reduce((counts: { [key: string]: number }, organization) => {
      counts[organization] = (counts[organization] || 0) + 1;
      return counts;
    }, {});

  return {
    keynoteSpeechCounts,
    mentorOrganizationCounts,
  };
}
