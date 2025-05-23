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
  activity_statistics: '活動數據統計',

  // Main Navigator
  organization_structure: '組織機構',
  organization_structure_chart: '組織架構全景圖',
  our_members: '正式成員',
  our_knowledge_base: '開源文庫',
  coscon: '中國開源年會 (COSCon)',
  kcc: '開源社城市社區 (KCC)',
  kys_forum: '開源社論壇',
  open_source_book_club: '開源讀書會',
  original_articles: '原創文章',
  translated_articles: '翻譯文章',
  all_articles: '全部文章',
  archived_articles: '歸檔文章',
  our_annual_report: '年度報告',
  china_open_source_annual_report: '中國開源年度報告',
  kaiyuanshe_annual_report: '開源社年度報告',
  open_source_projects: '開源項目',
  our_partners: '合作夥伴',
  community_list: '開源社城市社區（KCC）',
  china_open_source_pioneer: '中國開源先鋒',
  China_Open_Source_coder_rank: '中國開源碼力榜',
  stars_of_open_source: '開源之星',
  excellent_volunteer_of_the_year: '年度優秀志願者',
  stars_of_COSCon: 'COSCon 之星',
  stars_of_community_partnership: '社區合作之星',
  open_source_treasure_chest: '開源百寶箱',
  open_hackathon_platform: '開放黑客鬆平台',
  xiaoyuan_chatbot: '小源問答機器人',
  about_us: '關於我們',
  cultural_and_creative_shop: '文創商店',

  // User pages
  Open_Source_Passport: '開源護照',
  user_Open_Source_Passport: ({ user }: { user: string }) => `${user}的開源護照`,
  profile: '個人資料',
  activity_footprint: '活動足跡',
  member_announcement: '成員公告',
  captcha: '圖形驗證碼',
  mobile_phone_number: '手機號',
  SMS_code: '短訊驗證碼',
  sign_in: '登錄',
  sign_in_successfully: '登錄成功！',
  exit: '退出',

  // China Open Source Map
  no_more: '沒有更多',
  load_more: '加載更多……',
  organization_member: '組織成員',
  board_of_directors: '理事會',
  become_volunteer: '成為志願者',
  China_Open_Source_Map: '中國開源地圖',
  landscape: '全景圖',
  join_the_open_source_map: '+ 加入開源地圖',
  map: '地圖',
  chart: '圖表',
  type: '類型',
  confirm_community_type_filter: ({ type }: { type: string }) =>
    `確定篩選「${type}」類型的開源組織？`,
  confirm_community_tag_filter: ({ tag }: { tag: string }) => `確定篩選「${tag}」領域的開源組織？`,

  related_articles: '相關文章',
  no_data: '暫無數據',
  functions: 'functions',
  executive_committee: '執行委員會',
  project_committee: '項目委員會',
  advisory_council: '顧問委員會',
  legal_advisory_council: '法律諮詢委員會',
  unpublished: '未公開',
  unclassified: '未分組',
  distribution_of_communities_by_city: '社區城市排行',
  distribution_of_communities_by_technology: '社區領域排行',
  distribution_of_communities_by_founding_year: '社區創始年表',
  distribution_of_communities_by_type: '社區類型分佈',
  China_open_source_community_landscape: '中國開源社區全景圖',
  distribution_of_activity_topics_by_heat: '活動主題熱度排行',
  distribution_of_mentor_organizations_by_topics: '導師組織議題排行',

  // China NGO Map
  China_NGO_Map: '中國公益地圖',
  join_NGO_map: '+ 加入公益地圖',
  China_NGO_Landscape: '中國公益組織全景圖',

  // Search page
  keyword: '關鍵詞',
  tag: '標籤',
  search_results: '搜索結果',
  article: '文章',
  member: '成員',
  department: '部門',
  organization: '組織',
  activity: '活動',
  meeting: '會議',
  NGO: 'NGO',
  issue: '意見',
  proposal: '提案',

  // Organization page
  reset: '重置',
  total_x_organizations: ({ totalCount }: { totalCount: number }) => `共 ${totalCount} 家`,
  filter: '篩選',

  // Activity pages
  highlight_events: '精彩活動',
  volunteer_speaker_registration: '義工/講師報名註冊',
  CFP_submission: '議題征集',
  CFP_file_submission: '議題文檔提交',
  reimbursement_application: '報銷申請',
  participant_registration: '參會註冊',
  producer_organization: '出品方',
  producer: '出品人',
  volunteer: '志願者',
  punch_in: '打卡',
  punch_in_tips: '請該打卡點工作人員掃碼',
  confirm: '確認',
  punch_in_successfully: '打卡成功！',
  evaluation_form: '評價問卷',
  gift_wall: '禮品墻',
  available_score: '可用積分',
  score_threshold: '積分門檻',
  exchange: '兌換',
  exchange_tips: '請禮品墻工作人員掃碼',

  member_x: '成員X',
  calendar: '日曆',
  share: '分享',
  file_download: '檔案下載',
  attendee_ratings: '觀眾評分',
  related_agenda: '相關議程',

  // Invitation pages
  press_to_share: '長按圖片分享',

  // Cooperation page
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
  个人赞助: '個人贊助',
  特别支持: '特別支援',
  亮点赞助: '亮點贊助',
  成员赞助: '成員贊助',
  讲师赞助: '講師贊助',
  国际讲师差旅赞助: '國際講師差旅贊助',
  元宇宙会场赞助: '元宇宙會場贊助',
  网站支持: '網站支持',
  报名平台伙伴: '報名平台夥伴',
  视频直播伙伴: '視頻直播夥伴',
  战略合作社区: '戰略合作社區',
  战略合作媒体: '戰略合作媒體',
  媒体伙伴: '媒體夥伴',
  社区伙伴: '社區夥伴',

  // Finance page
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

  // RestTable
  create: '新增',
  view: '查看',
  submit: '提交',
  cancel: '取消',
  edit: '編輯',
  delete: '刪除',
  total_x_rows: ({ totalCount }: { totalCount: number }) => `共 ${totalCount} 行`,
  sure_to_delete_x: ({ keys }: { keys: IDType[] }) => `您確定刪除 ${keys.join('、')} 嗎？`,

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

  // Community list & detail pages
  community_member: '社區成員',
  add_member: '數據整理中，敬請期待',
  community: '社區',
  KCC_member_registration: '申請成為 KCC 成員',
  KCC_activity_registration: 'KCC 活動信息登記',
  KCC_community_establishment_registration: 'KCC 社區創建申請',

  // Article pages
  copyright: '版權聲明',
  original_link: '原文鏈接',
  activity_articles_calendar: '活動日曆',
  hosted_activity: '主辦活動',

  // GitHub project list page
  kaiyuanshe_projects: '開源社專案',
  home_page: '專案首頁',
  more_projects: '更多專案',

  // Deparment pages
  show_active_departments: '顯示活躍部門',
  members: '成員',
  OKR: '目標與關鍵結果',
  key_results: '關鍵結果',
  quarterly: '季度',
  plan: '計劃',
  monthly_report: '月度報告',
  progress: '進度',
  product: '產出',
  problem: '疑難',

  // Governance pages
  open_governance: '開放治理',
  meeting_calendar: '會議日曆',
  video_call: '視頻通話',
  meeting_minutes: '會議紀要',

  // Issue pages
  issue_box: '意見箱',
  submit_issue: '提交新意見',
  detail: '詳情',

  // Proposal pages
  proposal_library: '提案庫',
  submit_proposal: '提交新提案',

  // Election pages
  general_election: '換屆選舉',
  director_nomination: '理事提名',
  member_application: '正式成員提名',
  voting: '投票',
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

  // Member pages
  related: '相關',
} as const;
