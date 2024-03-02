import { IDType } from 'mobx-restful';

export default {
  KaiYuanShe: '開源社',
  our_vision: '我們的願景',
  our_vision_content: '立足中國、貢獻全球，推動開源成為新時代的生活方式',
  our_principles: '我們的原則',
  contribution: '貢獻',
  consensus: '共識',
  collegiality: '共治',
  open_source_governance: '開源治理',
  global_bridging: '國際橋樑',
  community_development: '社區發展',
  open_source_project: '開源項目',
  project_incubation: '項目孵化',
  our_mission: '我們的使命',
  latest_news: '最新動態',
  latest_activity: '最新活動',
  slogan: '開源社-開源人的家',
  our_projects: '我們的專案',
  activity_map: '活動地圖',
  previous_activities: '往屆活動',

  // Main Navigator
  community_structure: '組織機構',
  community_structure_overview: '組織架構全景圖',
  advisory_committee: '顧問委員會',
  our_members: '正式成員',
  our_articles: '開源文庫',
  coscon: '中國開源年會 (COSCon)',
  kcc: '開源社城市社區 (KCC)',
  kys_forum: '開源社論壇',
  open_source_book_club: '開源讀書會',
  original_articles: '原創文章',
  translated_articles: '翻譯文章',
  all_articles: '全部文章',
  our_annual_report: '年度報告',
  china_open_source_annual_report: '中國開源年度報告',
  kaiyuanshe_annual_report: '開源社年度報告',
  china_open_source_landscape: '開源地圖',
  open_source_projects: '開源項目',
  our_partners: '合作夥伴',
  community_list: '開源社城市社區（KCC）',
  china_open_source_pioneer: '中國開源先鋒',
  COSCon_star: 'COSCon 之星',
  open_source_star: '開源之星',
  community_cooperation_star: '社區合作之星',
  open_source_treasure_box: '開源百寶箱',
  open_hackathon_platform: '開放黑客鬆平台',
  xiaoyuan_chatbot: '小源問答機器人',
  about_us: '關於我們',
  cultural_and_creative_store: '文創商店',
  meeting_calendar: '會議日曆',

  no_more: '沒有更多',
  load_more: '加載更多……',
  organization_member: '組織成員',
  council: '理事會',
  organization_of_open_source_society: '開源社組織機構',
  become_volunteer: '成為志願者',
  china_open_source_map: '中國開源地圖',
  panorama: '全景圖',
  join_the_open_source_map: '+ 加入開源地圖',
  map: '地圖',
  chart: '圖表',
  related_articles: '相關文章',
  no_data: '暫無數據',
  functions: 'functions',
  executive_committee: '執行委員會',
  project_committee: '項目委員會',
  consultant_committee: '顧問委員會',
  legal_advisory_committee: '法律諮詢委員會',
  unpublished: '未公開',
  unclassified: '未分組',
  community_city_ranking: '社區城市排行',
  community_field_ranking: '社區領域排行',
  community_founding_chronology: '社區創始年表',
  community_type_distribution: '社區類型分佈',
  panorama_of_china_open_source_community: '中國開源社區全景圖',

  // Search Page
  keyword: '關鍵詞',
  tag: '標籤',
  search_results: '搜索結果',
  article: '文章',
  member: '成員',
  department: '部門',
  organization_short: '組織',
  activity: '活動',

  // Organization page
  reset: '重置',
  total_x_organizations: ({ totalCount }: { totalCount: number }) =>
    `共 ${totalCount} 家`,
  filter: '篩選',

  // Activity pages
  wonderful_activity: '精彩活動',
  register_volunteer: '義工/講師報名註冊',
  submit_agenda: '議題征集',
  submit_agenda_file: '議題文檔提交',
  reimbursement_application: '報銷申請',
  participant_registration: '參會註冊',

  member_x: '成員X',
  calendar: '日曆',
  share: '分享',
  file_download: '檔案下載',
  attendee_ratings: '觀眾評分',
  related_agenda: '相關議程',

  //invitation pages
  press_to_share: '長按圖片分享',

  // Cooperation Page
  主办单位: '主辦單位',
  承办单位: '承辦單位',
  协办单位: '協辦單位',
  指导单位: '指導單位',
  大会合作单位: '大會合作單位',
  战略赞助: '戰略贊助',
  白金赞助: '白金贊助',
  金牌赞助: '金牌贊助',
  银牌赞助: '銀牌贊助',
  铜牌赞助: '銅牌贊助',
  星牌赞助: '星牌贊助',
  特别支持: '特別支援',
  亮点赞助: '亮點贊助',
  成员赞助: '成員贊助',
  讲师赞助: '講師贊助',
  国际讲师差旅赞助: '國際講師差旅贊助',
  元宇宙会场赞助: '元宇宙會場贊助',
  网站支持: '網站支持',
  报名平台伙伴: '報名平台夥伴',
  视频直播伙伴: '視頻直播夥伴',
  战略合作媒体: '戰略合作媒體',
  媒体伙伴: '媒體夥伴',
  社区伙伴: '社區夥伴',

  //finance Page
  bill_id: '單號',
  bill_createAt: '支付日期',
  bill_location: '支付地點',
  bill_createBy: '支付人',
  bill_type: '支付類型',
  bill_price: '支付金額',
  bill_invoice: '支付憑證',
  bill_remark: '備註',
  bill_travelFundTask: '差旅志願任務',
  bill_forum: '出品/志願論壇',
  bill_agendas: '申報議程',
  financial_disclosure: '財務公開',

  //RestTable
  create: '新增',
  submit: '提交',
  cancel: '取消',
  edit: '編輯',
  delete: '刪除',
  total_x_rows: ({ totalCount }: { totalCount: number }) =>
    `共 ${totalCount} 行`,
  sure_to_delete_x: ({ keys }: { keys: IDType[] }) =>
    `您確定刪除 ${keys.join('、')} 嗎？`,

  // Election
  election: '選舉',
  candidate: '候選人',
  理事: '理事',
  正式成员: '正式成員',
  last_level: '上屆職級',
  last_committee: '上屆任職委員會',
  last_work_group: '上屆任職工作組',
  last_project_group: '上屆任職專案組',
  next_term_plan: '下屆規劃',
  expert_committee: '專家委員會',
  producer: '出品人',
  volunteer: '志願者',
  gift_wall: '禮品墻',

  // community list & community detail page
  community_member: '社區成員',
  add_member: '數據整理中，敬請期待',
  community: '社區',
  member_register: '申請成為 KCC 成員',
  activity_register: 'KCC 活動信息登記',
  community_register: 'KCC 社區創建申請',

  activity_articles_calendar: '活動日曆',
  host_activity: '主辦活動',

  // GitHub project list page
  kaiyuanshe_projects: '開源社專案',
  home_page: '專案首頁',
  more_projects: '更多專案',

  // Deparment Detail Page
  members: '成員',

  // Election pages
  general_election: '換屆選舉',
  director_nomination: '理事提名',
  member_application: '正式成員提名',
  director_election_voting: '理事競選投票',
  member_application_voting: '成員納新投票',
  nominated: '提名',
  take_charge_of: '擔任',
  grant: '授予',
  nomination_reason: '提名理由',
  previous_term_contribution: '上屆貢獻',
  this_term_proposition: '本屆主張',
  recommendation: '推薦語',
  vote_for_me: '投我一票',
} as const;
