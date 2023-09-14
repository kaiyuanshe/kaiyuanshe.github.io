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
  slogan: '开源社-开源人的家',
  our_projects: '我们的项目',
  activity_map: '活动地图',

  // Main Navigator
  community_structure: '组织架构',
  community_structure_overview: '组织架构全景图',
  advisory_committee: '顾问委员会',
  our_members: '正式成员',
  our_articles: '开源文库',
  coscon: '中国开源年会 (COSCon)',
  kcc: '开源社城市社区 (KCC)',
  open_source_book_club: '开源读书会',
  original_articles: '原创文章',
  translated_articles: '翻译文章',
  all_articles: '全部文章',
  our_annual_report: '年度报告',
  china_open_source_annual_report: '中国开源年度报告',
  kaiyuanshe_annual_report: '开源社年度报告',
  china_open_source_landscape: '开源地图',
  open_source_projects: '开源项目',
  community_list: '开源社城市社区（KCC）',
  our_partners: '合作伙伴',
  open_source_treasure_box: '开源百宝箱',
  Web_polyfill_CDN: 'Web 标准补丁 CDN',
  open_source_mirror: '开源镜像站',
  license_tool: '开源许可证选择器',
  about_us: '关于我们',

  no_more: '没有更多',
  load_more: '加载更多……',
  organization_member: '组织成员',
  council: '理事会',
  organization_of_open_source_society: '开源社组织机构',
  become_volunteer: '成为志愿者',
  china_open_source_map: '中国开源地图',
  panorama: '全景图',
  join_the_open_source_map: '+ 加入开源地图',
  map: '地图',
  chart: '图表',
  related_articles: '相关文章',
  no_data: '暂无数据',
  functions: 'functions',
  executive_committee: '执行委员会',
  project_committee: '项目委员会',
  consultant_committee: '顾问委员会',
  legal_advisory_committee: '法律咨询委员会',
  unpublished: '未公开',
  unclassified: '未分组',
  community_city_ranking: '社区城市排行',
  community_field_ranking: '社区领域排行',
  community_founding_chronology: '社区创始年表',
  community_type_distribution: '社区类型分布',
  panorama_of_china_open_source_community: '中国开源社区全景图',

  // Search Page
  keyword: '关键词',
  tag: '标签',
  search_results: '搜索结果',
  article: '文章',
  member: '成员',
  department: '部门',
  organization_short: '组织',
  activity: '活动',

  // Organization page
  reset: '重置',
  total_x_organizations: ({ totalCount }: { totalCount: number }) =>
    `共 ${totalCount} 家`,
  filter: '筛选',

  // Activity pages
  wonderful_activity: '精彩活动',
  register_volunteer: '志愿者/讲师报名注册',
  submit_agenda: '议题征集',
  submit_agenda_file: '议题课件提交',
  reimbursement_application: '报销申请',
  participant_registration: '参会注册',

  member_x: '成员X',
  calendar: '日历',
  share: '分享',

  //invitation pages
  press_to_share: '长按图片分享',

  // Cooperation Page
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
  亮点赞助: '亮点赞助',
  成员赞助: '成员赞助',
  讲师赞助: '讲师赞助',
  国际讲师差旅赞助: '国际讲师差旅赞助',
  元宇宙会场赞助: '元宇宙会场赞助',
  网站支持: '网站支持',
  报名平台伙伴: '报名平台伙伴',
  视频直播伙伴: '视频直播伙伴',
  战略合作媒体: '战略合作媒体',
  媒体伙伴: '媒体伙伴',
  社区伙伴: '社区伙伴',

  //License-tool Page
  feature_attitude_undefined: '两者皆可',
  feature_attitude_positive: '我需要',
  feature_attitude_negative: '我不需要',
  infection_range_library: '传染范围到库',
  infection_range_file: '传染范围到文件',
  infection_range_module: '传染范围到模块',
  infection_range_undefined: '不进行要求',

  tip_popularity_0:
    '您想将结果限定为开放源代码促进会 (OSI) 所描述的“流行并广泛使用，或拥有社群”的许可协议吗？',
  tip_popularity_1:
    '为了确保许可协议为主流许可协议，将妥协放弃掉一些不那么主流但可能有用的特征。',
  tip_reuse_condition: '您想对代码的重复使用设置许可条件吗?',
  tip_infection_intensity: '您是否想选择强传染的协议？',
  tip_jurisdiction: '您是否想将自己所在区域作为司法管辖区',
  tip_patent_statement: '您是否想使用明确授予专利权的许可协议（如果有）',
  tip_patent_retaliation: '您是否想使用包含专利报复条款的许可协议',
  tip_enhanced_attribution: '您是否想使用指定“软件归属增强”的许可协议',
  tip_privacy_loophole: '您是否想使用解决“隐私漏洞”的许可协议',
  tip_marketing_endorsement: '您是否想允许推广的许可协议',
  tip_infection_range:
    '您想对修改版的哪些部分可以适用其它许可协议,有四个选择: 模块级，文件级，库接口级，不进行要求',

  license_tool_headline: '开源许可证选择器',
  license_tool_description:
    '该工具旨在帮助用户理解他们自己对于自由和开源软件许可协议的偏好。用户必须自己阅读这些许可协议。在应用项目之前，阅读并完全理解许可协议非常重要。本工具借用的许可分类方式不能保证永远适用，因此，不可将本工具输出的信息作为法律依据。',
  warn_info: '切记：必须阅读并理解您选择的许可协议',
  filter_option: '筛选条件',
  option_undefined: '不要求',
  step_x: ({ step }: { step: number }) => `第 ${step} 步`,
  license_score: '评分',
  feature_popularity: '流行程度',
  feature_reuse_condition: '复用条件',
  feature_infection_intensity: '传染强度',
  feature_infection_range: '传染范围',
  feature_jurisdiction: '法律管辖',
  feature_patent_statement: '专利声明',
  feature_patent_retaliation: '专利报复',
  feature_enhanced_attribution: '归属增强',
  feature_privacy_loophole: '隐私漏洞',
  feature_marketing_endorsement: '营销背书',
  license_detail: '协议详情',
  attitude_positive: '是',
  attitude_negative: '否',
  range_library: '库',
  range_file: '文件',
  range_module: '模块',

  //finance Page
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

  //RestTable
  create: '新增',
  submit: '提交',
  cancel: '取消',
  edit: '编辑',
  delete: '删除',
  total_x_rows: ({ totalCount }: { totalCount: number }) =>
    `共 ${totalCount} 行`,
  sure_to_delete_x: ({ keys }: { keys: IDType[] }) =>
    `您确定删除 ${keys.join('、')} 吗？`,

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
  producer: '出品人：',
  volunteer: '志愿者：',

  //community detail page
  community_member: '社区成员',
  add_member: '数据整理中，敬请期待',
} as const;
