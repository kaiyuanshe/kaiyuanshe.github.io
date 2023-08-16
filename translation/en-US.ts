import { IDType } from 'mobx-restful';

export default {
  KaiYuanShe: 'KaiYuanShe',
  our_vision: 'Our vision',
  our_vision_content:
    'Based in China, contribute to the world, and promote open source as a way of life in the new era',
  our_principles: 'Our principles',
  contribution: 'Contribution',
  consensus: 'Consensus',
  collegiality: 'Collegiality',
  open_source_governance: 'Open source governance',
  global_bridging: 'Global bridging',
  community_development: 'Community development',
  open_source_project: 'Open source project',
  project_incubation: 'Project incubation',
  our_mission: 'Our mission',
  latest_news: 'Latest News',
  slogan: 'kaiyuanshe - the home of open-source believer',
  our_projects: 'Our projects',
  activity_map: 'Activity Map',

  // Main Navigator
  community_structure: 'Community structure',
  community_structure_overview: 'Community structure overview',
  advisory_committee: 'Advisory committee',
  our_members: 'Our members',
  our_articles: 'Our articles',
  coscon: 'China Open Source Conference',
  kcc: 'KaiYuanShe City Community',
  open_source_book_club: 'Open Source Book Club',
  original_articles: 'Original articles',
  translated_articles: 'Translated articles',
  all_articles: 'All articles',
  our_annual_report: 'Our annual report',
  china_open_source_annual_report: 'China Open Source Annual Report',
  kaiyuanshe_annual_report: 'KaiYuanShe Annual Report',
  china_open_source_landscape: 'China open source landscape',
  our_partners: 'Our partners',
  open_source_treasure_box: 'Treasure-box',
  Web_polyfill_CDN: 'Web polyfill CDN',
  open_source_mirror: 'Open-source mirror',
  license_tool: 'License tool',
  about_us: 'About Us',

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
  wonderful_activity: 'Wonderful activity',
  register_volunteer: 'Register Volunteer',
  submit_agenda: 'Submit Agenda',
  submit_agenda_file: 'Submit Agenda File',
  reimbursement_application: 'Reimbursement application',
  participant_registration: 'Participant registration',

  member_x: 'member X',
  calendar: 'Calendar',
  share: 'share',

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
  tip_reuse_condition: 'Do you want to set license conditions for code reuse?',
  tip_infection_intensity:
    'Do you want to choose a strongly infectious protocol?',
  tip_jurisdiction: 'Do you want your region to be the jurisdiction?',
  tip_patent_statement:
    'Do you want to use a license agreement that explicitly grants patent rights (if any)?',
  tip_patent_retaliation:
    'Do you want to use a license agreement that includes a patent retaliation clause?',
  tip_enhanced_attribution:
    'Do you want to use a license agreement that specifies "enhanced attribution"?',
  tip_privacy_loophole:
    'Do you want to use a license that addresses a "privacy loophole"',
  tip_marketing_endorsement: 'Do you want to allow promotional licenses?',
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
  feature_popularity: 'Popularity',
  feature_reuse_condition: 'Reuse Condition',
  feature_infection_intensity: 'Infection Intensity',
  feature_infection_range: 'Infection Range',
  feature_jurisdiction: 'Jurisdiction',
  feature_patent_statement: 'Patent Statement',
  feature_patent_retaliation: 'Patent Retaliation',
  feature_enhanced_attribution: 'Enhanced Attribution',
  feature_privacy_loophole: 'Privacy Loophole',
  feature_marketing_endorsement: 'Marketing Endorsement',
  license_detail: 'license detail',
  attitude_positive: 'Yes',
  attitude_negative: 'Yes',
  range_library: 'library',
  range_file: 'file',
  range_module: 'module',

  //finance Page
  bill_id: 'bill_id',
  bill_createAt: 'bill_createAt',
  bill_createBy: 'bill_createBy',
  bill_type: 'bill_type',

  //RestTable
  create: 'create',
  submit: 'submit',
  cancel: 'cancel',
  edit: 'edit',
  delete: 'delete',
  total_x_rows: ({ totalCount }: { totalCount: number }) =>
    `total ${totalCount} rows`,
  sure_to_delete_x: ({ keys }: { keys: IDType[] }) =>
    `Are you sure delete ${keys.join('、')} `,

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
  producer: 'Producer: ',
  volunteer: 'Volunteer: ',
} as const;
