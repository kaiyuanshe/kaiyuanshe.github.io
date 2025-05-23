import { IDType } from 'mobx-restful';

export default {
  KaiYuanShe: '开源社',
  our_vision: '我们的愿景',
  our_vision_content: '立足中国、贡献全球，推动开源成为新时代的生活方式',
  our_principles: '我们的原则',
  contribution: '贡献',
  consensus: '共识',
  collegiality: '共治',
  open_source_governance: '开源治理',
  global_bridging: '国际桥梁',
  community_development: '社区发展',
  open_source_project: '开源项目',
  project_incubation: '项目孵化',
  our_mission: '我们的使命',
  latest_news: '最新动态',
  latest_activity: '最新活动',
  slogan: '开源社-开源人的家',
  our_projects: '我们的项目',
  activity_map: '活动地图',
  previous_activities: '往届活动',
  activity_statistics: '活动数据统计',

  // Main Navigator
  organization_structure: '组织架构',
  organization_structure_chart: '组织架构全景图',
  our_members: '正式成员',
  our_knowledge_base: '开源文库',
  coscon: '中国开源年会 (COSCon)',
  kcc: '开源社城市社区 (KCC)',
  kys_forum: '开源社论坛',
  open_source_book_club: '开源读书会',
  original_articles: '原创文章',
  translated_articles: '翻译文章',
  all_articles: '全部文章',
  archived_articles: '归档文章',
  our_annual_report: '年度报告',
  china_open_source_annual_report: '中国开源年度报告',
  kaiyuanshe_annual_report: '开源社年度报告',
  open_source_projects: '开源项目',
  community_list: '开源社城市社区（KCC）',
  china_open_source_pioneer: '中国开源先锋',
  China_Open_Source_coder_rank: '中国开源码力榜',
  stars_of_open_source: '开源之星',
  excellent_volunteer_of_the_year: '年度优秀志愿者',
  stars_of_COSCon: 'COSCon 之星',
  stars_of_community_partnership: '社区合作之星',
  our_partners: '合作伙伴',
  open_source_treasure_chest: '开源百宝箱',
  open_hackathon_platform: '开放黑客松平台',
  xiaoyuan_chatbot: '小源问答机器人',
  about_us: '关于我们',
  cultural_and_creative_shop: '文创商店',

  // User pages
  Open_Source_Passport: '开源护照',
  user_Open_Source_Passport: ({ user }: { user: string }) => `${user}的开源护照`,
  profile: '个人资料',
  activity_footprint: '活动足迹',
  member_announcement: '成员公告',
  captcha: '图形验证码',
  mobile_phone_number: '手机号',
  SMS_code: '短信验证码',
  sign_in: '登录',
  sign_in_successfully: '登录成功！',
  exit: '退出',

  // China Open Source Map
  no_more: '没有更多',
  load_more: '加载更多……',
  organization_member: '组织成员',
  board_of_directors: '理事会',
  become_volunteer: '成为志愿者',
  China_Open_Source_Map: '中国开源地图',
  landscape: '全景图',
  join_the_open_source_map: '+ 加入开源地图',
  map: '地图',
  chart: '图表',
  type: '类型',
  confirm_community_type_filter: ({ type }: { type: string }) =>
    `确定筛选「${type}」类型的开源组织？`,
  confirm_community_tag_filter: ({ tag }: { tag: string }) => `确定筛选「${tag}」领域的开源组织？`,

  related_articles: '相关文章',
  no_data: '暂无数据',
  functions: 'functions',
  executive_committee: '执行委员会',
  project_committee: '项目委员会',
  advisory_council: '顾问委员会',
  legal_advisory_council: '法律咨询委员会',
  unpublished: '未公开',
  unclassified: '未分组',
  distribution_of_communities_by_city: '社区城市排行',
  distribution_of_communities_by_technology: '社区领域排行',
  distribution_of_communities_by_founding_year: '社区创始年表',
  distribution_of_communities_by_type: '社区类型分布',
  China_open_source_community_landscape: '中国开源社区全景图',
  distribution_of_activity_topics_by_heat: '活动主题热度排行',
  distribution_of_mentor_organizations_by_topics: '导师组织议题排行',

  // China NGO Map
  China_NGO_Map: '中国公益地图',
  join_NGO_map: '+ 加入公益地图',
  China_NGO_Landscape: '中国公益组织全景图',

  // Search page
  keyword: '关键词',
  tag: '标签',
  search_results: '搜索结果',
  article: '文章',
  member: '成员',
  department: '部门',
  organization: '组织',
  activity: '活动',
  meeting: '会议',
  NGO: 'NGO',
  issue: '意见',
  proposal: '提案',

  // Organization page
  reset: '重置',
  total_x_organizations: ({ totalCount }: { totalCount: number }) => `共 ${totalCount} 家`,
  filter: '筛选',

  // Activity pages
  highlight_events: '精彩活动',
  volunteer_speaker_registration: '志愿者/讲师报名注册',
  CFP_submission: '议题征集',
  CFP_file_submission: '议题课件提交',
  reimbursement_application: '报销申请',
  participant_registration: '参会注册',
  producer_organization: '出品方',
  producer: '出品人',
  volunteer: '志愿者',
  punch_in: '打卡',
  punch_in_tips: '请该打卡点工作人员扫码',
  confirm: '确认',
  punch_in_successfully: '打卡成功！',
  evaluation_form: '评价问卷',
  gift_wall: '礼品墙',
  available_score: '可用积分',
  score_threshold: '积分门槛',
  exchange: '兑换',
  exchange_tips: '请礼品墙工作人员扫码',

  member_x: '成员X',
  calendar: '日历',
  share: '分享',
  file_download: '资料下载',
  attendee_ratings: '观众评分',
  related_agenda: '相关议程',

  // Invitation pages
  press_to_share: '长按图片分享',

  // Cooperation page
  主办单位: '主办单位',
  承办单位: '承办单位',
  协办单位: '协办单位',
  指导单位: '指导单位',
  大会合作单位: '大会合作单位',
  战略赞助: '战略赞助',
  白金赞助: '白金赞助',
  金牌赞助: '金牌赞助',
  银牌赞助: '银牌赞助',
  铜牌赞助: '铜牌赞助',
  星牌赞助: '星牌赞助',
  个人赞助: '个人赞助',
  特别支持: '特别支持',
  亮点赞助: '亮点赞助',
  成员赞助: '成员赞助',
  讲师赞助: '讲师赞助',
  国际讲师差旅赞助: '国际讲师差旅赞助',
  元宇宙会场赞助: '元宇宙会场赞助',
  网站支持: '网站支持',
  报名平台伙伴: '报名平台伙伴',
  视频直播伙伴: '视频直播伙伴',
  战略合作社区: '战略合作社区',
  战略合作媒体: '战略合作媒体',
  媒体伙伴: '媒体伙伴',
  社区伙伴: '社区伙伴',

  // Finance page
  bill_id: '单号',
  bill_createAt: '支付日期',
  bill_location: '支付地点',
  bill_createBy: '支付人',
  bill_type: '支付类型',
  bill_price: '支付金额',
  bill_invoice: '支付凭证',
  bill_remark: '备注',
  bill_travelFundTask: '差旅志愿任务',
  bill_forum: '出品/志愿论坛',
  bill_agendas: '申报议程',
  financial_disclosure: '财务公开',

  // RestTable
  create: '新增',
  view: '查看',
  submit: '提交',
  cancel: '取消',
  edit: '编辑',
  delete: '删除',
  total_x_rows: ({ totalCount }: { totalCount: number }) => `共 ${totalCount} 行`,
  sure_to_delete_x: ({ keys }: { keys: IDType[] }) => `您确定删除 ${keys.join('、')} 吗？`,

  // Election
  election: '选举',
  candidate: '候选人',
  理事: '理事',
  正式成员: '正式成员',
  last_level: '上届职级',
  last_committee: '上届任职委员会',
  last_work_group: '上届任职工作组',
  last_project_group: '上届任职项目组',
  next_term_plan: '下届规划',
  expert_committee: '专家委员会',

  // Community list & detail pages
  community_member: '社区成员',
  add_member: '数据整理中，敬请期待',
  community: '社区',
  KCC_member_registration: '申请成为 KCC 成员',
  KCC_activity_registration: 'KCC 活动信息登记',
  KCC_community_establishment_registration: 'KCC 社区创建申请',

  // Article pages
  copyright: '版权声明',
  original_link: '原文链接',
  activity_articles_calendar: '活动日历',
  hosted_activity: '主办活动',

  // GitHub project list page
  kaiyuanshe_projects: '开源社项目',
  home_page: '项目主页',
  more_projects: '更多项目',

  // Deparment pages
  show_active_departments: '显示活跃部门',
  members: '成员',
  OKR: '目标与关键结果',
  key_results: '关键结果',
  quarterly: '季度',
  plan: '计划',
  monthly_report: '月度报告',
  progress: '进度',
  product: '产出',
  problem: '疑难',

  // Governance pages
  open_governance: '开放治理',
  meeting_calendar: '会议日历',
  video_call: '视频通话',
  meeting_minutes: '会议纪要',

  // Issue pages
  issue_box: '意见箱',
  submit_issue: '提交新意见',
  detail: '详情',

  // Proposal pages
  proposal_library: '提案库',
  submit_proposal: '提交新提案',

  // Election pages
  general_election: '换届选举',
  director_nomination: '理事提名',
  member_application: '正式成员提名',
  voting: '投票',
  director_election_voting: '理事竞选投票',
  member_application_voting: '成员纳新投票',
  nominated: '提名',
  take_charge_of: '担任',
  grant: '授予',
  nomination_reason: '提名理由',
  previous_term_contribution: '上届贡献',
  this_term_proposition: '本届主张',
  recommendation: '推荐语',
  vote_for_me: '投我一票',

  // Member pages
  related: '相关',
} as const;
