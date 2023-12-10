import { IDType } from 'mobx-restful';

export default {
  KaiYuanShe: 'KAIYUANSHE',
  our_vision: 'Our Vision',
  our_vision_content:
    'Based in China, contribute to the world, and promote open source as a way of life in the new era',
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
  slogan: 'KAIYUANSHE - The Home of Open-source Believer',
  our_projects: 'Our Projects',
  activity_map: 'Activity Map',
  previous_activities: 'Previous Activities',

  // Main Navigator
  community_structure: 'Community Structure',
  community_structure_overview: 'Community Structure Overview',
  advisory_committee: 'Advisory Committee',
  our_members: 'Our Members',
  our_articles: 'Our Articles',
  coscon: 'China Open Source Conference',
  kcc: 'KAIYUANSHE City Community',
  kcc_forum: 'KAIYUANSHE City Community Forum',
  open_source_book_club: 'Open Source Book Club',
  original_articles: 'Original Articles',
  translated_articles: 'Translated Articles',
  all_articles: 'All Articles',
  our_annual_report: 'Our Annual Report',
  china_open_source_annual_report: 'China Open Source Annual Report',
  kaiyuanshe_annual_report: 'KAIYUANSHE Annual Report',
  china_open_source_landscape: 'China Open Source Landscape',
  open_source_projects: 'Open Source Projects',
  community_list: 'KAIYUANSHE City Community',
  our_partners: 'Our Partners',
  open_source_treasure_box: 'Treasure-box',
  Web_polyfill_CDN: 'Web Polyfill CDN',
  open_source_mirror: 'Open-Source Mirror',
  license_tool: 'License Tool',
  about_us: 'About Us',
  cultural_and_creative_store: 'Cultural and Creative Store',

  no_more: 'no more',
  load_more: 'load more...',
  organization_member: 'Organization member',
  council: 'Council',
  organization_of_open_source_society: 'Organization of Open Source Society',
  become_volunteer: 'become a volunteer',
  china_open_source_map: 'China Open Source Map',
  panorama: 'Panorama',
  join_the_open_source_map: '+ Join the open source map',
  map: 'map',
  chart: 'chart',
  related_articles: 'related articles',
  no_data: 'No data',
  functions: 'functions',
  executive_committee: 'Executive Committee',
  project_committee: 'Project Committee',
  consultant_committee: 'Consultant Committee',
  legal_advisory_committee: 'Legal Advisory Committee',
  unpublished: 'unpublished',
  unclassified: 'unclassified',
  community_city_ranking: 'Community City Ranking',
  community_field_ranking: 'Community Field Ranking',
  community_founding_chronology: 'Community Founding Chronology',
  community_type_distribution: 'Community type distribution',
  panorama_of_china_open_source_community:
    "Panorama of China's open source community",

  // Search Page
  keyword: 'Keyword',
  tag: 'Tag',
  search_results: 'search results',
  article: 'article',
  member: 'member',
  department: 'department',
  organization_short: 'organization',
  activity: 'activity',

  // Organization page
  reset: 'reset',
  total_x_organizations: ({ totalCount }: { totalCount: number }) =>
    `total ${totalCount} organizations`,
  filter: 'filter',

  // Activity pages
  wonderful_activity: 'Wonderful Activity',
  register_volunteer: 'Volunteer/Speaker Registration',
  submit_agenda: 'CFP',
  submit_agenda_file: 'CFP Material Submission',
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
  大会合作单位: 'Conference cooperation sponsorship',
  战略赞助: 'Strategic sponsorship',
  白金赞助: 'Platinum sponsorship',
  金牌赞助: 'Gold sponsorship',
  银牌赞助: 'Silver sponsorship',
  铜牌赞助: 'Bronze sponsorship',
  星牌赞助: 'Star sponsorship',
  特别支持: 'Special support',
  亮点赞助: 'Highlight sponsorship',
  成员赞助: 'Member sponsorship',
  讲师赞助: 'Lecturer sponsorship',
  国际讲师差旅赞助: 'International lecturer travel sponsorship',
  元宇宙会场赞助: 'Metaverse Venue sponsorship',
  网站支持: 'Web-site supports',
  报名平台伙伴: 'Register platform partner',
  视频直播伙伴: 'Live video partner',
  战略合作媒体: 'Strategic partner media',
  媒体伙伴: 'Media partner',
  社区伙伴: 'Community partner',

  //License-tool Page
  feature_attitude_undefined: "I don't care",
  feature_attitude_positive: 'I need',
  feature_attitude_negative: "I don't need",
  infection_range_library: 'Infection range to library',
  infection_range_file: 'Infection range to file',
  infection_range_module: 'Infection range to module',
  infection_range_undefined: 'No request',

  tip_popularity_0:
    'Do you want to limit the result to a license agreement that is "popular and widely used, or has a broad community" as described by the Open Source Initiative (OSI)?',
  tip_popularity_1:
    'This will sacrifice some less popular but perhaps useful features to ensure that the license becomes a mainstream license.',
  tip_reuse_condition:
    'Do you want to set license conditions for code reuse? If not, your license will be one of the so-called "permissive" licenses.',
  tip_infection_intensity:
    'Do you want to choose a strongly Copyleft licensing? When a software project contains some of your code, the project as a whole must be distributed under your license, if it is distributed at all. The effect of this will be that the source code for all additions made to the code will be available. If not,the parts of the project you originated from must be distributed under your license, if it is distributed at all. Other parts may be distributed under other licenses, even though they form part of a work with is - as a whole - a modified version of your code. The effect of this will be that the source code to some additions made to the code may not be available.',
  tip_jurisdiction: 'Do you want your region to be the jurisdiction?',
  tip_patent_statement:
    'Do you want to use a license agreement that explicitly grants patent rights (if any)?',
  tip_patent_retaliation:
    'Do you want to use a license agreement that includes a patent retaliation clause? who brings legal action alleging that the licensed software embodies one of their software patents will lose the license you have granted to copy, use, adapt, and distribute the code. It is intended to dissuade people from bringing this kind of legal action.',
  tip_enhanced_attribution:
    'Do you want to use a license agreement that specifies "enhanced attribution"? It must take a particular form and appear in specific instances, for example on the user interface of softwares  every time it is run. ',
  tip_privacy_loophole:
    'Do you want to use a license that addresses a "privacy loophole". Require that source code must also be released when services are provided over the Web or when code is deployed internally. The purpose of this is to ensure that all those who benefit from open source projects have a responsibility to give back to the community by sharing their improved and adapted versions.',
  tip_marketing_endorsement:
    "Do you want to allow promotional licenses? Avoid using the author's name to promote products or services based on the author's code. Such a restriction is intended to protect the authors reputation or prevent misleading publicity.",
  tip_infection_range:
    'Which parts of the modified version do you want to allow for other licenses, with four options: module-level, file-level, library interface-level, and no requirements ?',
  license_tool_headline: 'Open Source License Selector',
  license_tool_description:
    'This tool is designed to help users understand their own preferences for free and open source software licensing agreements. Users must read these license agreements themselves. It is important to read and fully understand the license agreement you choose before applying it to your project. The classification of license types that support the operation of the tool will inevitably be somewhat reduced. Therefore, the output of the tool cannot and must not be taken as legal advice.',
  warn_info:
    'Remember: You must read and understand the license agreement you choose',
  filter_option: 'filter option',
  option_undefined: 'Not required',
  step_x: ({ step }: { step: number }) => `step ${step}`,
  license_score: 'score',
  popularity: 'Popularity',
  reuseCondition: 'Reuse Condition',
  infectionIntensity: 'Infection Intensity',
  infectionRange: 'Infection Range',
  jurisdiction: 'Jurisdiction',
  patentStatement: 'Patent Statement',
  patentRetaliation: 'Patent Retaliation',
  enhancedAttribution: 'Enhanced Attribution',
  privacyLoophole: 'Privacy Loophole',
  marketingEndorsement: 'Marketing Endorsement',
  license_detail: 'license detail',
  attitude_positive: 'Yes',
  attitude_negative: 'Yes',
  range_library: 'library',
  range_file: 'file',
  range_module: 'module',
  last_step: 'back',

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
  bill_agendas: 'agendas',
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
  理事: 'Council Member',
  正式成员: 'Regular Member',
  last_level: 'Last Level',
  last_committee: 'Last Committee',
  last_work_group: 'Last Work Group',
  last_project_group: 'Last Project Group',
  next_term_plan: 'Next Term Plan',
  expert_committee: 'Expert Committee',
  producer: 'Producer',
  volunteer: 'Volunteer',
  gift_wall: 'Gift Wall',

  //community detail page
  community_member: 'Community Members',
  add_member: 'Community Member Data is being Compiled, Please Stay Tuned',
  community: ' Community',
  member_register: 'Apply to Become a KCC Member',
  activity_register: 'KCC Activity Information Registration',
  community_register: 'KCC Community Establishment Application',

  activity_articles_calendar: 'Activity Calendar',
  host_activity: 'Host Activity',

  // GitHub project list page
  kaiyuanshe_projects: 'KAIYUANSHE projects',
  home_page: 'Home page',
  more_projects: 'More projects',

  // Deparment Detail Page
  members: 'Members',
} as const;
