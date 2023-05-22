export default {
  KaiYuanShe: 'KaiYuanShe',
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
  about_us: 'About Us',
  our_blogs: 'Our blogs',
  our_members: 'Our members',
  our_community_structure: 'Our community structure',
  china_open_source_landscape: 'China open source landscape',
  our_partners: 'Our partners',
  open_source_treasure_box: 'Treasure-box',
  Web_polyfill_CDN: 'Web polyfill CDN',
  open_source_mirror: 'Open-source mirror',
  license_tool: 'License tool',

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

  member_x: 'member X',

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
} as const;
