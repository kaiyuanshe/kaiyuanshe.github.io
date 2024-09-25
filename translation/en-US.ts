import { IDType } from 'mobx-restful';

export default {
  KaiYuanShe: 'KAIYUANSHE',
  our_vision: 'Our Vision',
  our_vision_content:
    'Contribute to and promote open source as a new way of life to the world',
  our_principles: 'Our Principles',
  contribution: 'Contribution',
  consensus: 'Consensus',
  collegiality: 'Collegiality',
  open_source_governance: 'Open Source Governance',
  global_bridging: 'Global Bridging',
  community_development: 'Community Development',
  open_source_project: 'Open Source Project',
  project_incubation: 'Project Incubation',
  our_mission: 'Our Mission',
  latest_news: 'Latest News',
  latest_activity: 'Latest Activity',
  slogan: 'KAIYUANSHE - The Home of Open-Sourcers',
  our_projects: 'Our Projects',
  activity_map: 'Activity Map',
  previous_activities: 'Previous Activities',
  activity_statistics: 'Activity Statistics',
  // Main Navigator
  organization_structure: 'Organization Structure',
  organization_structure_chart: 'Organization Structure Chart',
  our_members: 'Our Members',
  our_knowledge_base: 'Our Knowledge Base',
  coscon: 'China Open Source Conference',
  kcc: 'KAIYUANSHE City Community',
  kys_forum: 'KAIYUANSHE Community Forum',
  open_source_book_club: 'Open Source Book Club',
  original_articles: 'Original Articles',
  translated_articles: 'Translated Articles',
  all_articles: 'All Articles',
  our_annual_report: 'Our Annual Report',
  china_open_source_annual_report: 'China Open Source Annual Report',
  kaiyuanshe_annual_report: 'KAIYUANSHE Annual Report',
  open_source_projects: 'Open Source Projects',
  community_list: 'KAIYUANSHE City Community',
  china_open_source_pioneer: 'China Open Source Pioneers',
  stars_of_COSCon: 'Stars of COSCon',
  stars_of_open_source: 'Stars of Open Source',
  stars_of_community_partnership: 'Stars of Community Partnership',
  our_partners: 'Our Partners',
  open_source_treasure_chest: 'Open Source Treasure Chest',
  open_hackathon_platform: 'Open Hackathon Platform',
  xiaoyuan_chatbot: 'XiaoYuan ChatBot',
  about_us: 'About Us',
  cultural_and_creative_shop: 'Cultural and Creative Shop',
  meeting_calendar: 'Meeting Calendar',

  // China Open Source Map
  no_more: 'no more',
  load_more: 'load more...',
  organization_member: 'Organization member',
  board_of_directors: 'Board of Directors',
  become_volunteer: 'become a volunteer',
  China_Open_Source_Map: 'China Open Source Map',
  landscape: 'Landscape',
  join_the_open_source_map: '+ join China open source map',
  map: 'map',
  chart: 'chart',
  related_articles: 'related articles',
  no_data: 'No data',
  functions: 'functions',
  executive_committee: 'Executive Committee',
  project_committee: 'Projects Management Committee',
  advisory_council: 'Advisory Council',
  legal_advisory_council: 'Legal Advisory Council',
  unpublished: 'unpublished',
  unclassified: 'unclassified',
  distribution_of_communities_by_city: 'Distribution of Communities by City',
  distribution_of_communities_by_technology:
    'Distribution of Communities by Technology',
  distribution_of_communities_by_founding_year:
    'Distribution of Communities by Founding Year',
  distribution_of_communities_by_type: 'Distribution of Communities by Type',
  China_open_source_community_landscape:
    "China's open source community landscape",
  distribution_of_activity_topics_by_heat:
    'Distribution of activity topics by heat',
  distribution_of_mentor_organizations_by_topics:
    'Distribution of mentor organizations by topics',

  // China NGO Map
  China_NGO_Map: 'China NGO Map',
  join_NGO_map: '+ join NGO map',
  China_NGO_Landscape: 'China NGO Landscape',

  // Search Page
  keyword: 'Keyword',
  tag: 'Tag',
  search_results: 'search results',
  article: 'article',
  member: 'member',
  department: 'department',
  organization: 'organization',
  activity: 'activity',

  // Organization page
  reset: 'reset',
  total_x_organizations: ({ totalCount }: { totalCount: number }) =>
    `total ${totalCount} organizations`,
  filter: 'filter',

  // Activity pages
  highlight_events: 'Highlight Events',
  volunteer_speaker_registration: 'Volunteer/Speaker Registration',
  CFP_submission: 'CFP Submission',
  CFP_file_submission: 'CFP File Submission',
  reimbursement_application: 'Reimbursement Application',
  participant_registration: 'Participant Registration',

  member_x: 'member X',
  calendar: 'Calendar',
  share: 'share',
  file_download: 'File Download',
  attendee_ratings: 'Attendee Ratings',
  related_agenda: 'Related Agenda',

  //invitation pages
  press_to_share: 'press image to share',

  // Cooperation Page
  主办单位: 'Hosted by',
  承办单位: 'Organized by',
  协办单位: 'Co-organized by',
  指导单位: 'Directed by',
  大会合作单位: 'Conference Partners',
  战略赞助: 'Strategic Sponsor',
  白金赞助: 'Platinum Sponsor',
  金牌赞助: 'Gold Sponsor',
  银牌赞助: 'Silver Sponsor',
  铜牌赞助: 'Bronze Sponsor',
  星牌赞助: 'Startup Sponsor',
  特别支持: 'Special Support',
  亮点赞助: 'Highlight Sponsor',
  成员赞助: 'Member Sponsor',
  讲师赞助: 'Lecturer Travel Sponsor',
  国际讲师差旅赞助: 'International Lecturer Travel Sponsor',
  元宇宙会场赞助: 'Meta-verse Venue Sponsor',
  网站支持: 'Website Support Partner',
  报名平台伙伴: 'Registration Platform Partner',
  视频直播伙伴: 'Live Video Broadcast Partner',
  战略合作媒体: 'Strategic Media Partner',
  媒体伙伴: 'Media Partner',
  社区伙伴: 'Community Partner',

  //finance Page
  bill_id: 'bill id',
  bill_createAt: 'created at',
  bill_location: 'location',
  bill_createBy: 'created by',
  bill_type: 'type',
  bill_price: 'price',
  bill_invoice: 'invoice',
  bill_remark: 'note',
  bill_travelFundTask: 'Volunteer Tasks Assigned',
  bill_forum: 'forum',
  bill_agendas: 'agenda',
  financial_disclosure: 'Financial Disclosure',

  //RestTable
  create: 'create',
  submit: 'submit',
  cancel: 'cancel',
  edit: 'edit',
  delete: 'delete',
  total_x_rows: ({ totalCount }: { totalCount: number }) =>
    `total ${totalCount} rows`,
  sure_to_delete_x: ({ keys }: { keys: IDType[] }) =>
    `Are you sure to delete ${keys.join(', ')} `,

  // Election
  election: 'Election',
  candidate: 'candidate',
  理事: 'Board Directors',
  正式成员: 'Member',
  last_level: 'Last Level',
  last_committee: 'Last Committee',
  last_work_group: 'Last Work Group',
  last_project_group: 'Last Project Group',
  next_term_plan: 'Next Term Plan',
  expert_committee: 'Expert Committee',
  producer_organization: 'Organization',
  producer: 'Producer',
  volunteer: 'Volunteer',
  gift_wall: 'Gift Wall',

  // community list & community detail page
  community_member: 'Community Members',
  add_member: 'Community Member Data is being Compiled, Please Stay Tuned',
  community: ' Community',
  KCC_member_registration: 'Apply to Become a KCC Member',
  KCC_activity_registration: 'KCC Activity Information Registration',
  KCC_community_establishment_registration:
    'KCC City Community Establishment Application',

  activity_articles_calendar: 'Activity Calendar',
  hosted_activity: 'Hosted Activity',

  // GitHub project list page
  kaiyuanshe_projects: 'KAIYUANSHE projects',
  home_page: 'Home page',
  more_projects: 'More projects',

  // Deparment Detail Page
  members: 'Members',

  // Election pages
  general_election: 'General Election',
  director_nomination: 'Director nomination',
  member_application: 'Member application',
  director_election_voting: 'Director election voting',
  member_application_voting: 'Member election voting',
  nominated: 'nominated',
  take_charge_of: 'take charge of',
  grant: 'grant',
  nomination_reason: 'Nomination reason',
  previous_term_contribution: 'Previous term contribution',
  this_term_proposition: 'This term proposition',
  recommendation: 'recommendation',
  vote_for_me: 'Vote for Me',
} as const;
